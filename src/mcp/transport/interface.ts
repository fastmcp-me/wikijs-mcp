interface TransportMethod {
    start(): Promise<void>;
    stop(): Promise<void>;
}

export type { TransportMethod };