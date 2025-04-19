import { userAgent } from '../env/index.js';
import type { AlertFeature } from '../models/index.js';

export async function makeNWSRequest<T>(url: string): Promise<T | null> {
	const headers = {
		'User-Agent': userAgent,
		Accept: 'application/geo+json',
	};

	try {
		const response = await fetch(url, { headers });
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return (await response.json()) as T;
	} catch (error) {
		console.error('Error making NWS request:', error);
		return null;
	}
}

export function formatAlert(feature: AlertFeature): string {
	const props = feature.properties;
	return [
		`Event: ${props.event || 'Unknown'}`,
		`Area: ${props.areaDesc || 'Unknown'}`,
		`Severity: ${props.severity || 'Unknown'}`,
		`Status: ${props.status || 'Unknown'}`,
		`Headline: ${props.headline || 'No headline'}`,
		'---',
	].join('\n');
}
