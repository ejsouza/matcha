import { API_BASE_URL } from 'utils/config';
import { getUserTokenFromLocalStorage } from 'utils/user';

export interface ChatMessageInterface {
  sender_id: number;
  receiver_id: number;
  text: string;
}

const getUserChats = async (userId: number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/chat?userId=${userId}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
      },
    });
    return res;
  } catch (err) {
    console.log(`[catch error getUserChats()] ${err}`);
    throw err;
  }
};

const postMessage = async (resource: ChatMessageInterface) => {
  try {
    const res = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
      },
      body: JSON.stringify(resource),
    });
    return res;
  } catch (err) {
    console.log(`[catch error postMessage()] ${err}`);
    throw err;
  }
};

const setChatToSeen = async (chatId: number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/chat/${chatId}`, {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
      },
    });
    return res;
  } catch (err) {
    console.log(`Something went wrong setting chat to seen!`);
  }
};

export { getUserChats, postMessage, setChatToSeen };
