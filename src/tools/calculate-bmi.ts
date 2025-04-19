import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

/**
 * Simple tool with parameters
 * @param server - The server instance
 * @returns A tool that calculates the BMI based on weight and height
 */
export const calculateBmi = (server: McpServer) =>
	server.tool(
		'calculate-bmi',
		'Calcula tu índice BMI en función de tu altura y peso',
		{
			weightKg: z.number().describe('Peso en kilogramos'),
			heightM: z.number().describe('Altura en metros'),
		},
		async ({ weightKg, heightM }) => ({
			content: [
				{
					type: 'text',
					text: String(weightKg / (heightM * heightM)),
				},
			],
		}),
	);
