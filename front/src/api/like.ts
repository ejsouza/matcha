import { API_BASE_URL } from 'utils/config';
import { LOGGED_USER } from 'utils/const';

const likeProfile = (id: number) => {
  const currentUser = localStorage.getItem(LOGGED_USER);

  if (!currentUser) {
    // tell the user update failed
    return;
  }
  const data = JSON.parse(currentUser);
  return fetch(`${API_BASE_URL}/likes`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${data.token}`,
    },
    body: JSON.stringify({
      to_user_id: id,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res;
    })
    .catch((err) => {
      console.log(`[catch error likeProfile()] ${err}`);
      throw err;
    });
};

const getAllLikes = () => {
  const currentUser = localStorage.getItem(LOGGED_USER);

  if (!currentUser) {
    // tell the user update failed
    return;
  }
  const data = JSON.parse(currentUser);
  return fetch(`${API_BASE_URL}/likes`, {
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
      console.log(`[catch error getAllLikes()] ${err}`);
      throw err;
    });
};

const getLikedBy = () => {
  const currentUser = localStorage.getItem(LOGGED_USER);

  if (!currentUser) {
    // tell the user update failed
    return;
  }
  const data = JSON.parse(currentUser);
  return fetch(`${API_BASE_URL}/likes/who-liked-me-only`, {
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
      console.log(`[catch error getLikedBy()] ${err}`);
      throw err;
    });
};

export { likeProfile, getAllLikes, getLikedBy };
