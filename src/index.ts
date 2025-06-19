#!/usr/bin/env node

import { WikiJSClient } from './wikijs/index.js';
import { CONFIG } from './config/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { WikiJSMcpServer } from './mcp/index.js';
import { getVersion } from './util/version.js';

async function main() {
	const version = getVersion();	
	console.error(`Version: ${version}`);

	const wikiClient = new WikiJSClient(CONFIG.WIKIJS_URL, CONFIG.WIKIJS_API_KEY);
	
	const server = new WikiJSMcpServer(wikiClient, {
		version, 
		instructions: 'You are a helpful assistant that can search for pages in WikiJS by query string, get a WikiJS page by its ID, and get a WikiJS page by its path and locale.'
	});

	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error('WikiJS MCP server running on stdio');
}

main().catch((error) => {
	console.error('Fatal error in main():', error);
	process.exit(1);
});
