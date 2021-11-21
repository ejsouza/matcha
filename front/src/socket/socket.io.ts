import io from 'socket.io-client';
import {
  getSessionFromLocalStorage,
  saveSessionToLocalStorage,
} from 'utils/session';
const URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export interface SessionInterface {
  userID: string;
  sessionID: string;
  username: string;
  connected: boolean;
}

/**
 * If user closed the tab without logout
 * send it's username/userID to re-establish the socket connection.
 * Otherwise we lose connection and sending message
 * is not possible until logout and login back
 */
let session = getSessionFromLocalStorage();

const socket = io(URL, { query: { username: `${session?.username}` } });

socket.on('disconnect', () => {
  socket.emit('gonne offline', { username: `${session?.username}` });
});

socket.on('session', (session: SessionInterface) => {
  if (session) {
    saveSessionToLocalStorage(session);
  }
});

export default socket;
