import io from 'socket.io-client';
import {
  getSessionFromLocalStorage,
  saveSessionToLocalStorage,
  removeSessionFromLocalStorage,
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

socket.on('connect_error', (err: { message: string }) => {
  console.log(`connect_error due to ${err.message}`);
});

socket.on('connect', () => {
  console.log(`connect ${socket.id}`);
});

socket.on('disconnect', () => {
  console.log(`disconnect`);
  socket.emit('gonne offline', { username: `${session?.username}` });
});

socket.on('session', (session: SessionInterface) => {
  console.log('GOT SESSION ', session);
  if (session) {
    saveSessionToLocalStorage(session);
    console.log('should save to local storage');
  }
});

socket.on('current session', (session: SessionInterface) => {
  console.log(`<<< [SESSION] >>> [${session}]`);
});

socket.on('nullish session', () => {
  /**
   * it's a test to for the crashing after
   * logout but not closing the tab
   */
  // session = undefined;
  console.log(`do I get this nullish session`);
});

// socket.emit('ping', () => {
//   console.log('pinging...');
// });

export default socket;
