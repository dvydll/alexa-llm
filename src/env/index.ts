import { resolve } from 'node:path';
import { env, loadEnvFile } from 'node:process';

const envFile = resolve(import.meta.dirname, '../../.env');
try {
	loadEnvFile(envFile);
} catch (error) {
	console.warn('Error loading .env file', error);
}

export const {
	GEOCODE_API_BASE_URL: geocodeApi = 'https://geocoding-api.open-meteo.com',
	METEO_API_BASE_URL: meteoApi = 'https://api.open-meteo.com',
} = env;
