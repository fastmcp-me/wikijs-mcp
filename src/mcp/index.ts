import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createTool as createSearchPagesTool, PARAMETERS as SEARCH_PAGES_TOOL_PARAMETERS } from './tools/searchPage.js';
import { createTool as createGetPageByIdTool, PARAMETERS as GET_PAGE_BY_ID_TOOL_PARAMETERS } from './tools/getPageById.js';
import { createTool as createGetPageByPathTool, PARAMETERS as GET_PAGE_BY_PATH_TOOL_PARAMETERS } from './tools/getPageByPath.js';
import { createTool as createGetAllPagesTool, PARAMETERS as GET_ALL_PAGES_TOOL_PARAMETERS } from './tools/getAllPages.js';
import { WikiJSClient } from '../wikijs';
import { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { TransportMethod } from "./transport/interface.js";

export class WikiJSMcpServer {
    private server: McpServer;
    private wikiClient: WikiJSClient;
    private options: {
        version: string;
        instructions: string;
    };

    constructor(wikiClient: WikiJSClient, options: {
        version: string;
        instructions: string;
    }) {
        this.wikiClient = wikiClient;
        this.options = options;
        this.server = this.createServerInstance();
    }

    public createServerInstance(): McpServer {
        const server = new McpServer({
            name: 'wikijs-mcp-server',
            version: this.options.version,
            instructions: this.options.instructions
        });

        this._registerToolsForServer(server);

        return server;
    }


    private _registerToolsForServer(server: McpServer) {
        server.tool(
            'search_pages',
            'Search for pages in WikiJS by query string',
            SEARCH_PAGES_TOOL_PARAMETERS,
            createSearchPagesTool(this.wikiClient));

        server.tool(
            'get_page_by_id',
            'Get a WikiJS page by its ID',
            GET_PAGE_BY_ID_TOOL_PARAMETERS,
            createGetPageByIdTool(this.wikiClient)
        );

        server.tool(   
            'get_page_by_path',
            'Get a WikiJS page by its path and locale',
            GET_PAGE_BY_PATH_TOOL_PARAMETERS,
            createGetPageByPathTool(this.wikiClient)
        );
        
        server.tool(
            'get_all_pages',
            'Get all pages in WikiJS',
            GET_ALL_PAGES_TOOL_PARAMETERS,
            createGetAllPagesTool(this.wikiClient)
        );
    }
    
    public async connect(transport: Transport) {
        await this.server.connect(transport);
    }

    public async start(transport: TransportMethod) {
        await transport.start();
    }

    public async close() {
        await this.server.close();
    }   
    
}
