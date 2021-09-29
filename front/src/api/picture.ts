import { API_BASE_URL } from 'utils/config';
import { LOGGED_USER } from 'utils/const';
import { getUserTokenFromLocalStorage } from 'utils/user';
import { UpdateUserInfoInterface } from './user';

const uploadPicture = async (file: File) => {
  const currentUser = localStorage.getItem(LOGGED_USER);

  if (!currentUser) {
    return;
  }
  const data: UpdateUserInfoInterface = JSON.parse(currentUser);
  let formData = new FormData();
  formData.append('file', file);

  return fetch(`${API_BASE_URL}/pictures`, {
    method: 'POST',
    headers: {
      Authorization: `${data.token}`,
    },
    body: formData,
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

const getPictures = async () => {
  return fetch(`${API_BASE_URL}/pictures`, {
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
      console.log(`[catch error getPicture()] ${err}`);
      throw err;
    });
};

const deletePicture = async (id: number) => {
  return fetch(`${API_BASE_URL}/pictures`, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${getUserTokenFromLocalStorage()}`,
    },
    body: JSON.stringify({ id }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res;
    })
    .catch((err) => {
      console.log(`[catch error deletePicture()] ${err}`);
      throw err;
    });
};

export { uploadPicture, getPictures, deletePicture };
