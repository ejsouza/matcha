import { Server } from 'socket.io';
import * as http from 'http';
import crypto from 'crypto';
import userService from '../services/users.service';
import InMemorySessionStore, {
  SessionInterface,
} from '../session/sessionStore';

interface NewMessage {
  to: string;
  from: string;
  content: string;
  sent_at: Date;
}

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
          socket.join(userID.toString());
        }
      }
      next();
    });

    this._io.on('connection', (socket) => {
      if (socket.handshake.query.username) {
        /**
         * Here if username is undefined or not found it will fail
         * in the service, so nothing to worry
         * 1 means online and 0 means offline
         */
        const username = socket.handshake.query.username as string;
        this.status(username, 1);
        this.updateLastSeen(username);
      }

      socket.on('login', (session: SessionInterface) => {
        /**
         *  If we get here the login was successful
         *  the front only emit 'login' after successful login
         *  so we can just set the user to connected status
         */
        this.status(session.username, 1);
        this.updateLastSeen(session.username);

        const sessionID = session.sessionID || '';
        const s = this._sessionStore.findSession(sessionID);
        if (!s) {
          const sess: SessionInterface = {
            username: session.username,
            userID: this._randomId(),
            sessionID: this._randomId(),
            connected: true,
          };
          this._sessionStore.saveSession(sess.sessionID, sess);

          socket.join(sess.userID.toString());
          this._io.to(sess.userID).emit('session', sess);
        }
      });

      socket.on('logout', (username: string) => {
        this._sessionStore.deleteSession(this._getSessionID(username) || '');
        this.status(username, 0);
        socket.emit('nullish session');
      });

      /**
       * 'private message' are the messages send by the chat
       */
      socket.on('private message', (props: NewMessage) => {
        const userID = this._getRecipientID(props.to);
        if (userID) {
          socket.to(userID).emit('private message', props);
        }
      });

      /**
       * 'direct message' are the messages send by message
       */
      socket.on('direct message', (receiverName: string) => {
        const userID = this._getRecipientID(receiverName);

        if (userID) {
          this._io.to(userID).emit('direct message', 'update global');
        }
      });

      /**
       * The 'visit' event will receive the username to emit 'visit' to.
       * It can be from oneself for updating components in different
       * parts of the app, or from a user visiting other user.
       */
      socket.on('visit', (receiverName: string) => {
        const userID = this._getRecipientID(receiverName);

        if (userID) {
          this._io.to(userID).emit('visit');
        }
      });

      socket.on('match', (receiverName: string) => {
        const userID = this._getRecipientID(receiverName);
        if (userID) {
          this._io.to(userID).emit('match');
        }
      });

      socket.on('like', (receiverName: string) => {
        const userID = this._getRecipientID(receiverName);
        if (userID) {
          this._io.to(userID).emit('like');
        }
      });

      socket.on('user updated', (receiverName: string) => {
        const userID = this._getRecipientID(receiverName);
        if (userID) {
          this._io.to(userID).emit('update user deck');
        }
      });

      /**
       * Check if no event emmited remove this event.
       */
      socket.on('gonne offline', (props: { username: string }) => {
        if (props.username) {
          this.status(props.username, 0);
        }
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
    const to = session.find((s) => s.username === reciveirName);

    return to?.userID;
  }

  private _getSessionID(username: string) {
    const session = this._sessionStore.findAllSession();
    const s = session.find((s) => s.username === username);

    return s?.sessionID;
  }

  async status(username: string, status: number) {
    const user = await userService.getUserByUsername(username);
    if (user) {
      await userService.status(user.id, status);
    }
  }

  async updateLastSeen(username: string) {
    await userService.updateLastSeen(username);
  }
}

export default SocketIo;
