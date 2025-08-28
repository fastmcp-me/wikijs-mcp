const TRANSPORT_METHOD_ENUM = {
    streamableHttp: 'streamable-http',
    stdio: 'stdio',
} as const;

type TransportMethod = (typeof TRANSPORT_METHOD_ENUM)[keyof typeof TRANSPORT_METHOD_ENUM];

type Config = {
    WIKIJS_URL: string;
    WIKIJS_API_KEY: string;
    TRANSPORT_METHOD: TransportMethod;
    TRANSPORT_OPTIONS: TransportOptions<TransportMethod>;
}

type TransportOptions<T extends TransportMethod> = T extends 'streamable-http' ? {
    port?: number;
    host?: string;
    isCorsEnabled?: boolean;
} : {};

function isValidTransportMethod(method: string): method is TransportMethod {
    return Object.values(TRANSPORT_METHOD_ENUM).includes(method as any);
}

export type { Config, TransportOptions, TransportMethod as TrasportMethod };
export { isValidTransportMethod, TRANSPORT_METHOD_ENUM };