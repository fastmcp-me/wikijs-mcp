import { HttpTransportMethod } from "./http/index.js";
import { StdioTransportMethod } from "./stdio/index.js";
import { TransportMethod } from "./interface";
import { WikiJSMcpServer } from "../index.js";
import { CONFIG } from "../../config/index.js";
import { TRANSPORT_METHOD_ENUM } from "../../config/types.js";


export function createTransportMethod(
    mcpServer: WikiJSMcpServer,
): TransportMethod {
    switch (CONFIG.TRANSPORT_METHOD) {
        case TRANSPORT_METHOD_ENUM.streamableHttp:
            return new HttpTransportMethod(mcpServer, {
                host: CONFIG.TRANSPORT_OPTIONS.host!,
                port: CONFIG.TRANSPORT_OPTIONS.port!,
                sessionTimeoutMs: CONFIG.TRANSPORT_OPTIONS.sessionTimeoutMs,
            });
        case TRANSPORT_METHOD_ENUM.stdio:
            return new StdioTransportMethod(mcpServer);
    }

    throw new Error(`Invalid transport method: ${CONFIG.TRANSPORT_METHOD}`);
}