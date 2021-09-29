import { API_BASE_URL } from 'utils/config';
import { LOGGED_USER } from 'utils/const';
import { getUserTokenFromLocalStorage } from 'utils/user';

export interface UpdateUserInfoInterface {
  activated?: number | null;
  birthdate?: string | Date;
  created?: number | null;
  description?: string;
  email?: string;
  firstname?: string;
  gender?: string | null;
  id?: number;
  lastname?: string;
  localisation?: {
    longitude: number;
    latitude: number;
  };
  modified?: number | null;
  sexual_orientation?: string | null;
  token?: string;
  username?: string;
  tags?: {
    id?: number;
    user_id?: number;
    title?: string;
  }[];
  age?: number;
}

const updateUserInfo = async (user: UpdateUserInfoInterface) => {
  const currentUser = localStorage.getItem(LOGGED_USER);

  if (!currentUser) {
    // tell the user update failed
    return;
  }
  const data = JSON.parse(currentUser);
  return fetch(`${API_BASE_URL}/users/me`, {
    method: 'PATCH',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${data.token}`,
    },
    body: JSON.stringify(user),
  }).then((res) => res);
};

const getUser = async (token: string) => {
  return fetch(`${API_BASE_URL}/users/me`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  }).then((res) => res);
};

const getUserById = async (id: number) => {
  return fetch(`${API_BASE_URL}/users/${id}`, {
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
      console.log(`[catch error uploadPicture()] ${err}`);
      throw err;
    });
};

const getUsers = async () => {
  const currentUser = localStorage.getItem(LOGGED_USER);
  if (!currentUser) {
    return;
  }
  const data = JSON.parse(currentUser);
  return fetch(`${API_BASE_URL}/users`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${data.token}`,
    },
  }).then((res) => res);
};

export { getUser, getUserById, getUsers, updateUserInfo };
