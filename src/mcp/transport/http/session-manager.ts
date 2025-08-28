import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

interface SessionInfo {
  transport: StreamableHTTPServerTransport;
  createdAt: Date;
  lastActivity: Date;
}

export class SessionManager {
  private sessions = new Map<string, SessionInfo>();
  private cleanupInterval?: NodeJS.Timeout;
  private readonly CLEANUP_INTERVAL_MS = 1000;

  constructor(private sessionTimeoutMs: number = 30 * 60 * 1000) {
    this.startPeriodicCleanup();
  }

  addSession(sessionId: string, transport: StreamableHTTPServerTransport): void {
    const now = new Date();
    
    this.removeSessionSync(sessionId);
    
    const sessionInfo: SessionInfo = {
      transport,
      createdAt: now,
      lastActivity: now,
    };
    
    this.sessions.set(sessionId, sessionInfo);
  }

  getSession(sessionId: string): StreamableHTTPServerTransport | undefined {
    const session = this.sessions.get(sessionId);

    if (session) {
      this.updateActivity(sessionId);
      return session.transport;
    }

    return undefined;
  }

  hasSession(sessionId: string): boolean {
    return this.sessions.has(sessionId);
  }

  updateActivity(sessionId: string): void {
    const session = this.sessions.get(sessionId);

    if (session) {
      session.lastActivity = new Date();
    }
  }

  async removeSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    
    try {
      await session.transport.close();
      this.sessions.delete(sessionId);
    } catch (error) {
      console.error(`Error closing session ${sessionId}:`, error);
    }
  }

  private removeSessionSync(sessionId: string): void {
    const session = this.sessions.get(sessionId);

    if (!session) return;

    this.sessions.delete(sessionId);

    session.transport.close().catch(error => {
      console.error(`Error closing session ${sessionId}:`, error);
    });
  }

  private startPeriodicCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      this.tick();
    }, this.CLEANUP_INTERVAL_MS);
  }

  private tick(): void {
    const now = new Date();
    const expiredSessions: string[] = [];

    for (const [sessionId, session] of this.sessions) {
      const timeSinceActivity = now.getTime() - session.lastActivity.getTime();
      
      if (timeSinceActivity > this.sessionTimeoutMs) {
        expiredSessions.push(sessionId);
      }
    }

    if (expiredSessions.length > 0) {
      for (const sessionId of expiredSessions) {
        this.removeSessionSync(sessionId);
      }
    }
  }

  async shutdown(): Promise<void> {
    console.log(`Shutting down session manager with ${this.sessions.size} active sessions...`);
    
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = undefined;
    }

    const sessionIds = Array.from(this.sessions.keys());
    
    const closePromises = sessionIds.map(async (sessionId) => {
      try {
        await Promise.race([
          this.removeSession(sessionId),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Close timeout')), 5000)
          )
        ]);
      } catch (error) {
        console.error(`Failed to close session ${sessionId}:`, error);
        this.sessions.delete(sessionId);
      }
    });

    await Promise.allSettled(closePromises);
    
    this.sessions.clear();
  }


  getActiveSessionCount(): number {
    return this.sessions.size;
  }

  clearAllSessions(): void {
    const sessionIds = Array.from(this.sessions.keys());
    for (const sessionId of sessionIds) {
      this.removeSessionSync(sessionId);
    }
  }
}