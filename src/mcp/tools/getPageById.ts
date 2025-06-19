import { z } from 'zod';
import { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WikiJSClient } from '../../wikijs';


export const PARAMETERS ={
    id: z.number().describe('The ID of the page to retrieve')
};


export const createTool = (wikiClient: WikiJSClient): ToolCallback<typeof PARAMETERS> => {
	return async (request) => {
		try {
			const { id } = request;
			const result = await wikiClient.getPageById(id);

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