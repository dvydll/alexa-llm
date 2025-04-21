import type { Context } from 'hono';
import { createMiddleware } from 'hono/factory';
import { pino } from 'pino';
import type { App } from '../../types.js';

export const loggerMiddleware = createMiddleware(
	async (c: Context<App>, next) => {
		const logger = pino();
		c.set('logger', logger);
		try {
			logger.info(`-> ${c.req.method}`);
			logger.trace('Request ID:', c.get('requestId'));
			await next();
		} finally {
			logger.info(`<- ${c.req.method}`);
		}
	},
);

export const getLogger = (c: Context<App>) => {
	const logger = c.get('logger');
	if (!logger) throw new Error('Logger not found in context');
	return logger;
};
