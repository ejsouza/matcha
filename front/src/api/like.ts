import { API_BASE_URL } from 'utils/config';
import { LOGGED_USER } from 'utils/const';
import {
  getUserTokenFromLocalStorage,
  getUserIdFromLocalStorage,
} from 'utils/user';

const likeProfile = async (likedId: number) => {
  const res = await fetch(
    `${API_BASE_URL}/likes/${getUserIdFromLocalStorage()}`,
    {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
      },
      body: JSON.stringify({
        liked_id: likedId,
      }),
    }
  );
  return res;
};

const dislikeProfile = async (dislikedId: number) => {
  const res = await fetch(
    `${API_BASE_URL}/likes/${getUserIdFromLocalStorage()}/dislike`,
    {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
      },
      body: JSON.stringify({
        disliked_id: dislikedId,
      }),
    }
  );
  return res;
};

const getAllLikes = async () => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/likes/${getUserIdFromLocalStorage()}`,
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
    console.log(`[catch error getAllLikes()] ${err}`);
    throw err;
  }
};

/**
 *
 * @param likedId
 * @returns likes []
 * @description this function returns all the people the liked user
 * @description has liked to check if is a match with the current user
 */
const getLikedUserLikes = async (likedId: number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/likes/${likedId}`, {
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

export { likeProfile, dislikeProfile, getAllLikes, getLikedUserLikes };
