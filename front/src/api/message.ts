import { API_BASE_URL } from 'utils/config';
import { getUserTokenFromLocalStorage } from 'utils/user';

const sendMessage = async (message: string, id: string) => {
  return fetch(`${API_BASE_URL}/messages`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
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
  return fetch(`${API_BASE_URL}/messages`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${getUserTokenFromLocalStorage()}`,
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
