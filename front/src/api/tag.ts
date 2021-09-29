import { API_BASE_URL } from 'utils/config';

export const getTags = async (token: string) => {
  return fetch(`${API_BASE_URL}/tags`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  }).then((res) => res);
};
