import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getWeatherByCity } from '../helpers/index.js';

/**
 * Async tool with external API call
 * @param server - The server instance
 */
export const fetchWeather = (server: McpServer) =>
	server.tool(
		'fetch-weather',
		'Obtener el clima de una ciudad',
		{
			city: z.string().describe('La ciudad de la que quieres obtener el clima'),
		},
		async ({ city }) => ({
			content: [{ type: 'text', text: await getWeatherByCity(city) }],
		}),
	);
