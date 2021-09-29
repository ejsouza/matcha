import { API_BASE_URL } from 'utils/config';
import { LOGGED_USER } from 'utils/const';
import { UpdateUserInfoInterface } from './user';

const sendMessage = async (message: string, id: string) => {
  const currentUser = localStorage.getItem(LOGGED_USER);
  if (!currentUser) {
    return;
  }
  const data: UpdateUserInfoInterface = JSON.parse(currentUser);
  return fetch(`${API_BASE_URL}/messages`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${data.token}`,
    },
    body: JSON.stringify({
      to_user_id: id,
      content: message,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res;
    })
    .catch((err) => {
      console.log(`[catch error sendMessage()] ${err}`);
      throw err;
    });
};

const getMessage = async () => {
  const currentUser = localStorage.getItem(LOGGED_USER);
  if (!currentUser) {
    return;
  }
  const data: UpdateUserInfoInterface = JSON.parse(currentUser);
  return fetch(`${API_BASE_URL}/messages`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${data.token}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res;
    })
    .catch((err) => {
      console.log(`[catch error getMessage()] ${err}`);
      throw err;
    });
};

export { sendMessage, getMessage };
