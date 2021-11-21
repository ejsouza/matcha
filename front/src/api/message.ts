import { API_BASE_URL } from 'utils/config';
import {
  getUserTokenFromLocalStorage,
  getUserIdFromLocalStorage,
} from 'utils/user';

const sendMessage = async (receiver_id: string, message: string) => {
  return fetch(`${API_BASE_URL}/messages`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
    },
    body: JSON.stringify({
      sender_id: getUserIdFromLocalStorage(),
      receiver_id,
      message,
    }),
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(`[catch error sendMessage()] ${err}`);
      throw err;
    });
};

const getMessages = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/messages`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
      },
    });
    return res;
  } catch (err) {
    console.log(`[catch error getMessages()] ${err}`);
    throw err;
  }
};

const updateSeenMessage = async (messageId: number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
      },
    });
    return res;
  } catch (err) {
    console.log(`[catch error updateSeenMessage()] ${err}`);
    throw err;
  }
};

export { sendMessage, getMessages, updateSeenMessage };
