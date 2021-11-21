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
  default_picture?: string;
  popularity?: number;
  is_connected?: number;
  updated_at?: string;
  reported?: boolean;
  distance_preference?: number;
  age_preference_min?: number;
  age_preference_max?: number;
  rate?: number;
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

const getUserAllDetails = async (userId: number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/all-details`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
      },
    });
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
    return res;
  } catch (err) {
    console.log(`[catch error getUserById()] ${err}`);
    throw err;
  }
};

const getUserMatches = async () => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/users/${getUserIdFromLocalStorage()}/matches`,
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
    console.log(`[catch error getUserMatches()] ${err}`);
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

const getUserLikedBy = async (userId: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/liked-by`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
      },
    });
    return res;
  } catch (err) {
    console.log(`[catch error getLikedBy()] ${err}`);
    throw err;
  }
};

const reportUser = async (reportedId: number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/report`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
      },
      body: JSON.stringify({
        reporter_id: getUserIdFromLocalStorage(),
        reported_id: reportedId,
      }),
    });
    return res;
  } catch (err) {
    console.log(`[catch error reportUser()] ${err}`);
    throw err;
  }
};

const blockUser = async (blockedId: number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/block`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
      },
      body: JSON.stringify({
        blocker_id: getUserIdFromLocalStorage(),
        blocked_id: blockedId,
      }),
    });
    return res;
  } catch (err) {
    console.log(`[catch error blockUser()] ${err}`);
    throw err;
  }
};

const updateUserAgePreferences = async (min: number, max: number) => {
  try {
    const userId = getUserIdFromLocalStorage() || 0;
    const res = await fetch(`${API_BASE_URL}/users/${userId}/age-preferences`, {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
      },
      body: JSON.stringify({
        min,
        max,
      }),
    });
    return res;
  } catch (err) {
    console.log(`[catch error updateUserAgePreferences()] ${err}`);
    throw err;
  }
};

const updateUserDistancePreferences = async (distance: number) => {
  try {
    const userId = getUserIdFromLocalStorage() || 0;
    const res = await fetch(
      `${API_BASE_URL}/users/${userId}/distance-preferences`,
      {
        method: 'PATCH',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
        },
        body: JSON.stringify({
          distance,
        }),
      }
    );
    return res;
  } catch (err) {
    console.log(`[catch error updateUserDistancePreferences()] ${err}`);
    throw err;
  }
};

export {
  getUser,
  getUserById,
  getUsers,
  getUserAllDetails,
  getUserMatches,
  getUserLikedBy,
  updateUserInfo,
  updateUserCoordinates,
  reportUser,
  blockUser,
  updateUserAgePreferences,
  updateUserDistancePreferences,
};
