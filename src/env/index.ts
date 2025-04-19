import { resolve } from 'node:path';
import { env, loadEnvFile } from 'node:process';

const envFile = resolve(import.meta.dirname, '../../.env');
try {
	loadEnvFile(envFile);
} catch (error) {
	console.warn('Error loading .env file', error);
}

export const {
	NWS_API_BASE_URL: nwsApiBaseUrl = 'https://api.weather.gov',
	USER_AGENT: userAgent = 'weather-app/1.0',
} = env;
