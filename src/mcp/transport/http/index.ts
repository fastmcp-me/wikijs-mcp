import { WikiJSMcpServer } from '../../index.js';
import { TransportMethod } from '../interface.js';
import { HttpServer } from './server.js';
import { SessionManager } from './session-manager.js';

export interface HttpServerOptions {
  port: number;
  host: string;
  sessionTimeoutMs?: number;
  cors?: {
    origin?: string;
    headers?: string[];
    methods?: string[];
  }
}

export class HttpTransportMethod implements TransportMethod {
    private httpServer: HttpServer;
    private sessionManager: SessionManager;

    constructor(
      private mcpServer: WikiJSMcpServer,
      private options: HttpServerOptions
    ) {
      this.sessionManager = new SessionManager(this.options.sessionTimeoutMs);

      this.httpServer = new HttpServer(
        this.mcpServer,
        this.sessionManager,
        {
          cors: this.options.cors
        }
      );
    }

    async start() {
      this.httpServer.listen(this.options.port, this.options.host)
    }

    async stop() {
      this.sessionManager.clearAllSessions();
    }

}