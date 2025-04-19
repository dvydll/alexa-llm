import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { nwsApiBaseUrl } from '../env/index.js';
import { formatAlert, makeNWSRequest } from '../helpers/index.js';
import type { AlertsResponse } from '../models/index.js';

export const getAlerts = (server: McpServer) =>
	server.tool(
		'get-alerts',
		'Get weather alerts for a state',
		{
			state: z
				.string()
				.length(2)
				.describe('Two-letter state code (e.g. CA, NY)'),
		},
		async ({ state }) => {
			const stateCode = state.toUpperCase();
			const alertsUrl = new URL(`/alerts?area=${stateCode}`, nwsApiBaseUrl);
			const alertsData = await makeNWSRequest<AlertsResponse>(alertsUrl.href);

			if (!alertsData) {
				return {
					content: [
						{
							type: 'text',
							text: 'Failed to retrieve alerts data',
						},
					],
				};
			}

			const { features = [] } = alertsData;
			if (!features.length) {
				return {
					content: [
						{
							type: 'text',
							text: `No active alerts for ${stateCode}`,
						},
					],
				};
			}

			const formattedAlerts = features.map(formatAlert);
			const alertsText = `Active alerts for ${stateCode}:\n\n${formattedAlerts.join('\n')}`;

			return {
				content: [
					{
						type: 'text',
						text: alertsText,
					},
				],
			};
		},
	);
