#!/usr/bin/env node

import { WikiJSClient } from './wikijs/index.js';
import { CONFIG } from './config/index.js';
import { WikiJSMcpServer } from './mcp/index.js';
import { getVersion } from './util/version.js';
import { createTransportMethod } from './mcp/transport/index.js';

async function main() {
	const version = getVersion();	
	console.error(`Version: ${version}`);

	const wikiClient = new WikiJSClient(CONFIG.WIKIJS_URL, CONFIG.WIKIJS_API_KEY);
	
	const server = new WikiJSMcpServer(wikiClient, {
		version, 
		instructions: 'You are a helpful assistant that can search for pages in WikiJS by query string, get a WikiJS page by its ID, and get a WikiJS page by its path and locale.'
	});

	const transport = createTransportMethod(server);

	await server.start(transport);

	console.error(`WikiJS MCP server running on ${CONFIG.TRANSPORT_METHOD}`);

	process.on('SIGINT', async () => {
		console.error('Received SIGINT, shutting down gracefully...');
		await server.close();
		process.exit(0);
	});

	process.on('SIGTERM', async () => {
		console.error('Received SIGTERM, shutting down gracefully...');
		await server.close();
		await transport.stop();
		process.exit(0);
	});
}

main().catch((error) => {
	console.error('Fatal error in main():', error);
	process.exit(1);
});
