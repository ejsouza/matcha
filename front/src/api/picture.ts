import { API_BASE_URL } from 'utils/config';
import { getUserTokenFromLocalStorage } from 'utils/user';

const upload = async (file: File) => {
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
      return res;
    })
    .catch((err) => {
      console.log(`[catch error uploadPicture()] ${err}`);
      throw err;
    });
};

const get = async () => {
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

const remove = async (id: number) => {
  return fetch(`${API_BASE_URL}/photos/${id}`, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
    },
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(`[catch error deletePicture()] ${err}`);
      throw err;
    });
};

const setDefault = async (path: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/photos`, {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
      },
      body: JSON.stringify({ file_path: path }),
    });
    return res;
  } catch (err) {
    console.log(`[catch error setAsDefaultPicture()] ${err}`);
    throw err;
  }
};

export { upload, get, remove, setDefault };
