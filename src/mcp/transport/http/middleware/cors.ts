import { Request } from "@modelcontextprotocol/sdk/types.js";
import { NextFunction, Response } from "express";

export function createCorsMiddleware(
    origin: string = "*",
    headers: string[] = ['Content-Type', 'mcp-session-id'],
    methods: string[] = ['GET', 'POST', 'OPTIONS']
){
    return (req: Request, res: Response, next: NextFunction) => {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Headers', headers.join(', '));
        res.header('Access-Control-Allow-Methods', methods.join(', '));
        
        if (req.method === 'OPTIONS') {
            res.sendStatus(200);
            return;
        }
        
        next();
    }
}