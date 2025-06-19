import { z } from 'zod';
import { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WikiJSClient } from '../../wikijs';


export const PARAMETERS = {
	path: z.string().describe('The path of the page to retrieve'),
	locale: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/, 'Invalid locale format').describe('The locale of the page (e.g., "en")')
}

export const createTool = (wikiClient: WikiJSClient): ToolCallback<typeof PARAMETERS> => {
	return 	async (request) => {
		try {
			const { path, locale } = request;

			const result = await wikiClient.getPageByPath(path, locale);

			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(result, null, 2)
					}
				]
			};
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			return {
				content: [
					{
						type: 'text',
						text: `Error getting page by path: ${errorMessage}`
					}
				],
				isError: true
			};
		}
	}
}