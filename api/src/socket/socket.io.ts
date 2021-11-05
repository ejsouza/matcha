import { Server } from 'socket.io';
import * as http from 'http';

import crypto from 'crypto';
// import { io } from '../app';
import InMemorySessionStore, {
  SessionInterface,
} from '../session/sessionStore';

interface NewMessage {
  to: string;
  from: string;
  content: string;
  sent_at: Date;
}

// interface SessionInterface {
//   username: string;
//   userID?: string;
//   sessionID?: string;
//   connected?: boolean;
// }

class SocketIo {
  private _sessionStore = InMemorySessionStore;
  private _io: Server;

  constructor(httpServer: http.Server) {
    this._io = new Server(httpServer, {
      serveClient: false,
      cors: {
        origin: 'http://localhost:3000',
      },
    });

    this.linstener();
  }

  linstener() {
    /**
     * This middleware handle connecting a user with credentials
     * to the same room (if user closes the tab without logout)
     */
    this._io.use((socket, next) => {
      const username = socket.handshake.query.username as string;
      if (username && username !== 'undefined') {
        const userID = this._getRecipientID(username);
        if (userID) {
          socket.join(userID);
        }
      }
      next();
    });

    this._io.on('connection', (socket) => {
      console.log(`connect ${socket.id}`);

      console.log('[ROOMS] ', socket.rooms);

      console.log(`[HANDSHAKE] ${socket.handshake.query.username}`);

      /** --------------------------------- */
      socket.on('ping', () => {
        const start = Date.now();
        console.log(`pong <${socket.id}> (latency: ${Date.now() - start} ms)`);
      });

      socket.on('login', (session: SessionInterface) => {
        const sessionID = session.sessionID || '';
        console.log('looking for sessionID := ', sessionID);
        const s = this._sessionStore.findSession(sessionID);
        if (!s) {
          console.log('did not find any session, create one');
          const sess: SessionInterface = {
            username: session.username,
            userID: this._randomId(),
            sessionID: this._randomId(),
            connected: true,
          };
          this._sessionStore.saveSession(sess.sessionID, sess);
          socket.join(sess.userID);
          socket.emit('session', sess);
        } else {
          console.log(
            `FOUND SESSION ${s.sessionID} userID ${s.userID} uesername ${s.username}`
          );
        }
      });

      socket.on('logout', (username: string) => {
        console.log(`removing session with username := ${username}`);
        this._sessionStore.deleteSession(this._getSessionID(username) || '');
      });

      socket.on('new message', (props: NewMessage) => {
        console.log(
          `new message from ${props.from} to ${props.to} := ${props.content}`
        );
      });

      socket.on('private message', (props: NewMessage) => {
        const userID = this._getRecipientID(props.to);
        console.log(`private message. to := ${props.to} found ? ${userID}`);
        if (userID) {
          console.log(`emitting for userID := ${userID}`);
          socket.to(userID).emit('private message', props);
        }
        socket.emit('for everyone', props);
      });

      socket.on('disconnect', () => {
        console.log(`disconnect ${socket.id}`);
      });
    });
  }

  private _randomId() {
    return crypto.randomBytes(8).toString('hex');
  }

  private _getRecipientID(reciveirName: string) {
    const session = this._sessionStore.findAllSession();
    session.forEach((s) =>
      console.log(
        `[_getRecipientID] username := ${s.username} userID := ${s.userID} sessionID := ${s.sessionID}`
      )
    );
    const to = session.find((s) => s.username === reciveirName);
    console.log(`FOUND RECEIVER <<${to?.username}>>`);

    return to?.userID;
  }

  private _getSessionID(username: string) {
    const session = this._sessionStore.findAllSession();
    const s = session.find((s) => s.username === username);

    return s?.sessionID;
  }
}

export default SocketIo;
