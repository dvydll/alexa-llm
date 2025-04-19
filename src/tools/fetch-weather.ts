import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

/**
 * Async tool with external API call
 * @param server - The server instance
 */
export const fetchWeather = (server: McpServer) =>
	server.tool(
		'fetch-weather',
		'Fetch weather data for a specific city',
		{ city: z.string().describe('The city for which to fetch weather data') },
		async ({ city }) => {
			const response = await fetch(`https://api.weather.com/${city}`);
			const data = await response.text();
			return {
				content: [{ type: 'text', text: data }],
			};
		},
	);
