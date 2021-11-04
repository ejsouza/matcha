import io from 'socket.io-client';
import { CONNECT_ERROR } from './const.socket.io';
import {
  getSessionFromLocalStorage,
  saveSessionToLocalStorage,
  removeSessionFromLocalStorage,
} from 'utils/session';
const URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export interface SessionInterface {
  userID: string;
  sessionID: string;
  username: string;
  connected: boolean;
}

const socket = io(URL);

socket.on(CONNECT_ERROR, (err: any) => {
  console.log(`SOCKET ERROR ${err}`);
});

socket.on('connect', () => {
  console.log(`connect ${socket.id}`);
});

socket.on('disconnect', () => {
  console.log(`disconnect`);
});

socket.on('session', (session: SessionInterface) => {
  console.log('GOT SESSION ', session);
  if (session) {
    saveSessionToLocalStorage(session);
    console.log('should save to local storage');
  }
});

// socket.emit('ping', () => {
//   console.log('pinging...');
// });

export default socket;
