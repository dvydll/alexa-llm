import type { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import type { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { geocodeApi, meteoApi } from '../env/index.js';

const DAILY_PARAMS = [
	'temperature_2m_max',
	'temperature_2m_min',
	'precipitation_sum',
	'windspeed_10m_max',
	'winddirection_10m_dominant',
	'sunrise',
	'sunset',
	'weathercode',
];

/**
 * Store transports by session ID
 */
export class McpServerTransports extends Map<
	string,
	StreamableHTTPServerTransport | SSEServerTransport
> {}

const geocodeCity = async (city: string) => {
	try {
		if (!city) throw new Error('City is required');

		const geocodingApi = new URL('/v1/search', geocodeApi);
		geocodingApi.searchParams.set('name', city);

		const response = await fetch(geocodingApi.href);
		if (!response.ok)
			throw new Error(`Failed to fetch weather data: ${response.statusText}`);

		const { results } = await response.json();
		if (!results?.length)
			throw new Error(`No results found for city: ${city}`, {
				cause: response,
			});

		const [{ latitude, longitude }] = results;
		return { latitude, longitude };
	} catch (error) {
		console.error('Error fetching geocode:', error);
		return { latitude: Number.NaN, longitude: Number.NaN };
	}
};

export const getWeatherByCity = async (city: string) => {
	const weatherApi = new URL('/v1/forecast', meteoApi);
	weatherApi.searchParams.append('current_weather', 'true');
	weatherApi.searchParams.append('timezone', 'auto');
	weatherApi.searchParams.append('hourly', 'temperature_2m');
	for (const dailyParam of DAILY_PARAMS)
		weatherApi.searchParams.append('daily', dailyParam);

	try {
		const { latitude, longitude } = await geocodeCity(city);
		if (Number.isNaN(latitude) || Number.isNaN(longitude))
			throw new Error('Invalid latitude or longitude', {
				cause: { latitude, longitude },
			});

		weatherApi.searchParams.append('latitude', latitude.toString());
		weatherApi.searchParams.append('longitude', longitude.toString());

		const weatherResponse = await fetch(weatherApi.href);
		if (!weatherResponse.ok)
			throw new Error(
				`Failed to fetch weather data: ${weatherResponse.statusText}`,
				{ cause: weatherResponse },
			);

		return await weatherResponse.text();
	} catch (error) {
		console.error('Error fetching weather data:', error);
		if (error instanceof Error) {
			if (error.cause instanceof Response) {
				const text = await error.cause.text();
				console.error('Error response:', text);
				return `Error fetching weather data: ${text}`;
			}
			return `Error fetching weather data: ${error.message}`;
		}
		return 'Error fetching weather data: Unknown Error';
	}
};
