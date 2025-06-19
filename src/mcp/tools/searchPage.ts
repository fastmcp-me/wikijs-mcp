import { z } from 'zod';
import { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WikiJSClient } from '../../wikijs';


export const PARAMETERS = {
	query: z.string().min(1, 'Query cannot be empty').describe('Search query to find pages'),
	path: z.string().optional().describe('Optional path to limit search scope'),
	locale: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/, 'Invalid locale format').optional().describe('Optional locale for the search (e.g., "en")')
};


export const createTool = (wikiClient: WikiJSClient): ToolCallback<typeof PARAMETERS> => {
	return async (request) => {
		const { query, path, locale } = request
	
		const result = await wikiClient.searchPages(query, path, locale);
	
		return {
			content: [
				{
					type: 'text',
					text: JSON.stringify(result, null, 2)
				}
			]
		};
	}
}