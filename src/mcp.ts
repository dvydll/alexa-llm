import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { calculateBmi } from './tools/calculate-bmi.js';
import { fetchWeather } from './tools/fetch-weather.js';

export const mcp = () => {
	const server = new McpServer({
		name: 'Demo Server',
		description: 'Demo server for Model Context Protocol (MCP)',
		version: '1.0.0',
	});

	// Add tools to the server
	calculateBmi(server);
	fetchWeather(server);

	return server;
};
