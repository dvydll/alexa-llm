import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { calculateBmi } from './tools/calculate-bmi.js';
import { fetchWeather } from './tools/fetch-weather.js';
import { getAlerts } from './tools/get-alerts.js';
import { getForecast } from './tools/get-forecast.js';

async function main() {
	const server = new McpServer({
		name: 'Demo Server',
		description: 'Demo server for Model Context Protocol',
		// This is the version of the server, not the protocol
		// The protocol version is defined in the package.json file
		// and is the version of the Model Context Protocol
		version: '1.0.0',
		capabilities: { tools: {} },
	});

	// Add tools to the server
	getAlerts(server);
	getForecast(server);
	calculateBmi(server);
	fetchWeather(server);

	const transport = new StdioServerTransport();
	console.info('MCP Server running on stdio');
	await server.connect(transport);
}

main().catch((error) => {
	console.error('Fatal error in MCP Server running on stdio:', error);
	process.exit(1);
});
