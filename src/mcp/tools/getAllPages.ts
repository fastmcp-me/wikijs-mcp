import { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WikiJSClient } from '../../wikijs';

export const PARAMETERS = {};


export const createTool = (wikiClient: WikiJSClient): ToolCallback<typeof PARAMETERS> => {
	return async () => {
		try {
			const result = await wikiClient.getAllPages();

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
						text: `Error getting page by ID: ${errorMessage}`
					}
				],
				isError: true
			};
		}
	}
}