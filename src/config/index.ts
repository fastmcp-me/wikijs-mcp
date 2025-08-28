import path from 'path';
import { config as configDotenv } from 'dotenv';
import { fileURLToPath } from 'url';
import { isValidTransportMethod, TRANSPORT_METHOD_ENUM } from './types.js';

configDotenv({
	path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../../.env'),
});

if (!process.env.WIKIJS_URL || !process.env.WIKIJS_API_KEY) {
	throw new Error('WIKIJS_URL and WIKIJS_API_KEY must be set in .env file');
}

const transportMethod = process.env.TRANSPORT_METHOD ?? 'stdio';

if (!isValidTransportMethod(transportMethod)) {
	throw new Error(`invalid TRANSPORT_METHOD: "${transportMethod}", must be one of [${Object.values(TRANSPORT_METHOD_ENUM).join(', ')}]`);
}

const transportOptions = transportMethod == TRANSPORT_METHOD_ENUM.streamableHttp ? {
	PORT: process.env.TRANSPORT_OPTIONS_PORT ? parseInt(process.env.TRANSPORT_OPTIONS_PORT) : 9000,
	HOST: process.env.TRANSPORT_OPTIONS_HOST ? process.env.TRANSPORT_OPTIONS_HOST : "localhost",
	SESSION_TIMEOUT_MS: process.env.TRANSPORT_OPTIONS_SESSION_TIMEOUT_MS ? parseInt(process.env.TRANSPORT_OPTIONS_SESSION_TIMEOUT_MS) : undefined,
	CORS: {
		ORIGIN: process.env.TRANSPORT_OPTIONS_CORS_ORIGIN || undefined,
		HEADERS: process.env.TRANSPORT_OPTIONS_CORS_HEADERS ? process.env.TRANSPORT_OPTIONS_CORS_HEADERS.split(',') : undefined,
		METHODS: process.env.TRANSPORT_OPTIONS_CORS_METHODS ? process.env.TRANSPORT_OPTIONS_CORS_METHODS.split(',') : undefined,
	}
} : {};

export const CONFIG = {
	WIKIJS_URL: process.env.WIKIJS_URL!,
	WIKIJS_API_KEY: process.env.WIKIJS_API_KEY!,
	TRANSPORT_METHOD: transportMethod,
	TRANSPORT_OPTIONS: transportOptions,
};
