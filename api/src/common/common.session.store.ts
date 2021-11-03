import { SessionIdInterface, SessionInterface } from '../session/sessionStore';

export abstract class SessionStore {
  findSession(sessionID: string) {}
  saveSession(sessionID: string, session: SessionInterface) {} //TODO define session type
  findAllSession() {}
}
