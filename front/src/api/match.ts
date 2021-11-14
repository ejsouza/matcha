import { API_BASE_URL } from 'utils/config';
import {
  getUserTokenFromLocalStorage,
  getUserIdFromLocalStorage,
} from 'utils/user';

/**
 * The call to this end point doesn't handle actual matches,
 * instead it only handle unseen matches
 */

export interface MatchesInterface {
  id: number;
  user_id: number;
  seen: boolean;
}

const getUnseenMatches = async (): Promise<Response> => {
  try {
    const res = await fetch(`${API_BASE_URL}/matches`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
      },
    });
    return res;
  } catch (err) {
    console.log(`[catch error getUnseenMatches()] ${err}`);
    throw err;
  }
};

/**
 * The createUnseenMatch() should only be called in the first
 * time a user likes someone but not when the like generates a
 * match.
 */

const createUnseenMatch = async (userId: number): Promise<Response> => {
  try {
    const res = await fetch(`${API_BASE_URL}/matches`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
      },
      body: JSON.stringify({ userId }),
    });
    return res;
  } catch (err) {
    console.log(`[catch error createUnseenMatch()] ${err}`);
    throw err;
  }
};

/**
 * This function calls an endpoint that will remove ALL unseen matches
 * for the respective user.
 * (this endpoint will remove the records, not upadate them)
 */
const deleteUnseenMatches = async (): Promise<Response> => {
  try {
    const userId = getUserIdFromLocalStorage();
    const res = await fetch(`${API_BASE_URL}/matches`, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
      },
      body: JSON.stringify({ userId }),
    });
    return res;
  } catch (err) {
    console.log(`[catch error deleteUnseenMatch()] ${err}`);
    throw err;
  }
};

export { getUnseenMatches, createUnseenMatch, deleteUnseenMatches };
