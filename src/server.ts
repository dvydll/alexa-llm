import { InMemoryEventStore } from '@modelcontextprotocol/sdk/examples/shared/inMemoryEventStore.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {
	ErrorCode,
	isInitializeRequest,
} from '@modelcontextprotocol/sdk/types.js';

import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { requestId } from 'hono/request-id';

import { randomUUID } from 'node:crypto';

import type { App } from '../types.js';
import { McpServerTransports } from './helpers/index.js';
import { mcp } from './mcp.js';
import {
	getLogger,
	loggerMiddleware,
} from './middlewares/pino-logger.middleware.js';

//=========================================================
// STREAMABLE HTTP TRANSPORT (PROTOCOL VERSION 2025-03-26)
//=========================================================

const server = mcp();
const transports = new McpServerTransports();
const app = new Hono<App>()
	.use('*', requestId())
	.use('*', cors({ origin: '*' }))
	.use('*', loggerMiddleware)
	.all('/', async (c) => {
		// Check for existing session ID
		const sessionId = c.req.header('mcp-session-id');
		const logger = getLogger(c);
		const isPostRequest = c.req.method === 'POST';
		const body = isPostRequest ? await c.req.json() : null;
		const isInitRequest = body && isInitializeRequest(body);

		logger.debug(JSON.stringify(body, null, 2));

		let transport: StreamableHTTPServerTransport;
		if (sessionId && transports.has(sessionId)) {
			logger.info(`Session ID: ${sessionId}`);
			// Check if the transport is of the correct type
			const existingTransport = transports.get(sessionId);
			const isStreamableHTTPServerTransport =
				existingTransport instanceof StreamableHTTPServerTransport;

			// Transport exists but is not a StreamableHTTPServerTransport (could be SSEServerTransport)
			if (!isStreamableHTTPServerTransport)
				return c.json(
					{
						jsonrpc: '2.0',
						error: {
							code: ErrorCode.ConnectionClosed,
							message:
								'Bad Request: Session exists but uses a different transport protocol',
						},
						id: null,
					},
					400,
				);

			// Reuse existing transport
			transport = existingTransport;
		} else if (!sessionId && isInitRequest) {
			logger.info('Initializing new session');

			// Create a new transport
			transport = new StreamableHTTPServerTransport({
				sessionIdGenerator: () => randomUUID(),
				eventStore: new InMemoryEventStore(), // Enable resumability
				onsessioninitialized: (sessionId) => {
					// Store the transport by session ID when session is initialized
					logger.info({ sessionId }, 'StreamableHTTP session initialized');
					transports.set(sessionId, transport);
				},
			});

			// Set up onclose handler to clean up transport when closed
			transport.onclose = () => {
				const sid = transport.sessionId;
				if (sid && transports.has(sid)) {
					logger.info(
						`Transport closed for session ${sid}, removing from transports map`,
					);
					transports.delete(sid);
				}
			};

			// Connect the transport to the MCP server
			await server.connect(transport);
			logger.info({ transport }, 'Connected to MCP server');
		} else {
			// Invalid request - no session ID or not initialization request
			logger.info(
				sessionId ? `Session ID: ${sessionId}` : 'No session ID provided',
			);
			return c.json(
				{
					jsonrpc: '2.0',
					error: {
						code: ErrorCode.ConnectionClosed,
						message: 'Bad Request: No valid session ID provided',
					},
					id: null,
				},
				400,
			);
		}

		// Handle the request with the transport
		logger.info('Handling request with transport');
		await transport.handleRequest(c.env.incoming, c.env.outgoing, body);
		logger.info('Request handled with transport');
		return c.newResponse(null, 201);
	})
	.onError((error, c) => {
		const logger = getLogger(c);
		logger.error(error, 'Error handling MCP request');
		return c.json(
			{
				jsonrpc: '2.0',
				error: {
					code: ErrorCode.InternalError,
					message: 'Internal server error',
				},
				id: null,
			},
			500,
		);
	});

serve({ fetch: app.fetch, port: 3000, hostname: 'localhost' }, (info) => {
	console.info(`Server running at http://${info.address}:${info.port}/`);
});

// Handle server shutdown
process.on('SIGINT', async () => {
	console.info('Shutting down server...');
	await server.close();
	process.exit(0);
});

// export default app;
