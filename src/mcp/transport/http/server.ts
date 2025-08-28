import { WikiJSMcpServer } from "../..";
import express, { Request, Response } from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest, JSONRPCError } from "@modelcontextprotocol/sdk/types.js";
import { randomUUID } from "node:crypto";
import { createCorsMiddleware } from "./middleware/cors.js";
import { SessionManager } from "./session-manager";

type Options = {
  cors?: {
    origin?: string;
    headers?: string[];
    methods?: string[];
  }
}

export class HttpServer {
    private httpServer: express.Express;

    constructor(
        private mcpServer: WikiJSMcpServer,
        private sessionManager: SessionManager,
        private options: Options
    ) {
        this.httpServer = this.createHttpServer();
    }

    listen(port: number, host: string) {
        this.httpServer.listen(port, host, () => {
            console.log(`MCP Streamable HTTP Server listening on port ${port} on host ${host}`);
        });
    }

    private async handleGetRequest(req: Request, res: Response) {
        const sessionId = req.headers["mcp-session-id"];
  
        if (!sessionId || Array.isArray(sessionId) || !this.sessionManager.hasSession(sessionId)) {
          res.status(400).json(
              this.createErrorResponse("Bad Request: invalid session ID or method.")
          );
          return;
        }
  
        console.log(`Establishing SSE stream for session ${sessionId}`);
        const transport = this.sessionManager.getSession(sessionId)!;
  
        await transport.handleRequest(req, res);
  
        return;
      }
  
      private async handlePostRequest(req: Request, res: Response) {
        const sessionId = req.headers["mcp-session-id"]
        try {
  
            if(!sessionId && !isInitializeRequest(req.body)) {
              res.status(400).json(
                this.createErrorResponse("Bad Request: invalid session ID or method.")
              );
              return;
            }
  
            if(sessionId && Array.isArray(sessionId)) {
              res.status(400).json(
                this.createErrorResponse("Bad Request: invalid session ID or method.")
              );
              return;
            }
            
            if (sessionId && this.sessionManager.hasSession(sessionId)) {
              const transport = this.sessionManager.getSession(sessionId)!;
              await transport.handleRequest(req, res, req.body);
              return;
            }
  
            const transport = new StreamableHTTPServerTransport({
              sessionIdGenerator: () => randomUUID(),
              onsessionclosed: (sessionId) => {
                this.sessionManager.removeSession(sessionId);
              },
            });
  
            const serverInstance = this.mcpServer.createServerInstance();
            await serverInstance.connect(transport);
            await transport.handleRequest(req, res, req.body);
  
            const newSessionId = transport.sessionId;
  
            if (newSessionId) {
              this.sessionManager.addSession(newSessionId, transport);
            }
  
            return;
        } catch (error) {
          console.error("Error handling MCP request:", error);
          res.status(500).json(this.createErrorResponse("Internal server error."));
          return;
        }
    }


    private createHttpServer(): express.Express {
        const app = express();
        app.use(express.json({ limit: '10mb' }))

        if (this.options.cors) {
            app.use(createCorsMiddleware(
              this.options.cors.origin,
              this.options.cors.headers,
              this.options.cors.methods
            ));
        }
  
        const router = express.Router();
  
        const MCP_ENDPOINT = "/mcp";
  
        router.post(MCP_ENDPOINT, async (req: Request, res: Response) => {
          await this.handlePostRequest(req, res);
        });
  
        router.get(MCP_ENDPOINT, async (req: Request, res: Response) => {
          await this.handleGetRequest(req, res);
        });
  
        router.get('/health', (req: Request, res: Response) => {
          res.json({
            status: 'healthy',
            activeSessions: this.sessionManager.getActiveSessionCount(),
            uptime: process.uptime(),
          });
        });

        app.use("/", router);
  
        return app;
    }
    

    private createErrorResponse(message: string): JSONRPCError {
        return {
            jsonrpc: "2.0",
            id: randomUUID(),
            error: {
                code: -32000,
                message: message,
            },
        };
    }
}