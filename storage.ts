import { Session, InsertSession } from "@shared/schema";

export interface IStorage {
  getSession(sessionId: string): Promise<Session | undefined>;
  createSession(session: InsertSession): Promise<Session>;
  updateSession(sessionId: string, worldState: any): Promise<Session>;
}

export class MemStorage implements IStorage {
  private sessions: Map<string, Session>;
  private currentId: number;

  constructor() {
    this.sessions = new Map();
    this.currentId = 1;
  }

  async getSession(sessionId: string): Promise<Session | undefined> {
    return this.sessions.get(sessionId);
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = this.currentId++;
    const session: Session = { ...insertSession, id, createdAt: new Date().toISOString() };
    this.sessions.set(insertSession.sessionId, session);
    return session;
  }

  async updateSession(sessionId: string, worldState: any): Promise<Session> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }
    const updatedSession = { ...session, worldState };
    this.sessions.set(sessionId, updatedSession);
    return updatedSession;
  }
}

export const storage = new MemStorage();
