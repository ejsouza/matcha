import { SessionStore } from '../common/common.session.store';

export interface SessionInterface {
  sessionID: string;
  userID: string;
  username: string;
  connected: boolean;
}

export interface SessionIdInterface {
  sessionID: string;
}

class InMemorySessionStore extends SessionStore {
  sessions: Map<string, SessionInterface>;
  constructor() {
    super();
    this.sessions = new Map();
  }

  findSession(sessionID: string) {
    return this.sessions.get(sessionID);
  }

  saveSession(sessionID: string, session: SessionInterface) {
    this.sessions.set(sessionID, session);
  }

  findAllSession() {
    return [...this.sessions.values()];
  }

  deleteSession(sessionID: string) {
    const deleted = this.sessions.delete(sessionID);
  }
}

export default new InMemorySessionStore();
