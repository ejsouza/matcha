import { SessionInterface } from 'socket/socket.io';
import { SESSION } from 'utils/const';

const getSessionFromLocalStorage = () => {
  const local = localStorage.getItem(SESSION);

  if (!local) {
    return undefined;
  }
  const session: SessionInterface = JSON.parse(local);
  return session;
};

const saveSessionToLocalStorage = (session: SessionInterface) => {
  localStorage.setItem(SESSION, JSON.stringify(session));
};

const removeSessionFromLocalStorage = () => {
  localStorage.removeItem(SESSION);
};

export {
  getSessionFromLocalStorage,
  saveSessionToLocalStorage,
  removeSessionFromLocalStorage,
};
