import { API_BASE_URL } from 'utils/config';
import {
  getUserTokenFromLocalStorage,
  getUserIdFromLocalStorage,
} from 'utils/user';

const getTags = async () => {
  return fetch(`${API_BASE_URL}/tags/${getUserIdFromLocalStorage()}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
    },
  }).then((res) => res);
};

const getAllAvailableTags = async () => {
  return fetch(`${API_BASE_URL}/tags/${getUserIdFromLocalStorage()}/all`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
    },
  }).then((res) => res);
};

const addTag = async (tagId: number) => {
  return fetch(`${API_BASE_URL}/tags`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
    },
    body: JSON.stringify({ tagId, userId: getUserIdFromLocalStorage() }),
  }).then((res) => res);
};

const removeTag = async (tagId: number) => {
  return fetch(`${API_BASE_URL}/tags/${getUserIdFromLocalStorage()}`, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
    },
    body: JSON.stringify({ tagId }),
  }).then((res) => res);
};

export { getTags, getAllAvailableTags, removeTag, addTag };
