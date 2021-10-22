import { API_BASE_URL } from 'utils/config';
import { USER_TOKEN } from 'utils/const';
import { getUserTokenFromLocalStorage } from 'utils/user';
import { UpdateUserInfoInterface } from './user';

const uploadPicture = async (file: File) => {
  let formData = new FormData();
  formData.append('uploaded_file', file);

  return fetch(`${API_BASE_URL}/photos`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
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
  return fetch(`${API_BASE_URL}/photos`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
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
  return fetch(`${API_BASE_URL}/photos/${id}`, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
    },
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
