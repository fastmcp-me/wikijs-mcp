import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { WikiJSMcpServer } from '../../index.js';
import { TransportMethod } from '../interface.js';

export class StdioTransportMethod implements TransportMethod {
    private transport: StdioServerTransport;

    constructor(
        private mcpServer: WikiJSMcpServer,
    ) {

        this.transport = new StdioServerTransport();
    }

    async start(): Promise<void> {
        await this.mcpServer.connect(this.transport);
    }

    async stop(): Promise<void> {
        await this.mcpServer.close();
    }
}