import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { mcp } from './mcp.js';

async function main() {
	const server = mcp();
	const transport = new StdioServerTransport();
	await server.connect(transport);
}

main().catch((error) => {
	console.error('Fatal error in MCP Server running on stdio:', error);
	process.exit(1);
});
