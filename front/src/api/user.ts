import { API_BASE_URL } from 'utils/config';
import {
  getUserTokenFromLocalStorage,
  getUserIdFromLocalStorage,
} from 'utils/user';

/**
 * This interface is used in some places insted the one
 * defined in interfaces/ because all the fields in this
 * one here is optional, the user will not update all his/her
 * info every single time.
 */
export interface UpdateUserInfoInterface {
  activated?: number | null;
  birthdate?: string | Date;
  created?: number | null;
  biography?: string;
  email?: string;
  firstname?: string;
  gender?: string | null;
  id?: number;
  lastname?: string;
  localisation?: {
    x: number; // longitude
    y: number; // latitude
  };
  modified?: number | null;
  sexual_orientation?: string | null;
  username?: string;
  tags?: {
    id?: number;
    user_id?: number;
    name?: string;
  }[];
  pictures?: {
    id?: number;
    path?: string;
  }[];
  age?: number;
  default_picture?: string;
}

const updateUserInfo = async (user: UpdateUserInfoInterface) => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/users/${getUserIdFromLocalStorage()}`,
      {
        method: 'PATCH',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
        },
        body: JSON.stringify(user),
      }
    );
    return res;
  } catch (err) {
    console.log(`[catch error updateUserInfo()] ${err}`);
    throw err;
  }
};

const updateUserCoordinates = async (user: UpdateUserInfoInterface) => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/users/${getUserIdFromLocalStorage()}/coordinates`,
      {
        method: 'PATCH',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
        },
        body: JSON.stringify(user),
      }
    );
    return res;
  } catch (err) {
    console.log(`[catch error updateUserCoordinates()] ${err}`);
    throw err;
  }
};

const getUser = async () => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/users/${getUserIdFromLocalStorage()}`,
      {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
        },
      }
    );
    return res;
  } catch (err) {
    console.log(`[catch error getUser()] ${err}`);
    throw err;
  }
};

const getUserById = async (id: number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
      },
    });
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    return res;
  } catch (err) {
    console.log(`[catch error getUserById()] ${err}`);
    throw err;
  }
};

const getUsers = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
      },
    });
    return res;
  } catch (err) {
    console.log(`[catch error getUsers()] ${err}`);
    throw err;
  }
};

export {
  getUser,
  getUserById,
  getUsers,
  updateUserInfo,
  updateUserCoordinates,
};
