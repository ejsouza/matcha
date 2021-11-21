import { API_BASE_URL } from 'utils/config';
import { getUserTokenFromLocalStorage } from 'utils/user';

/**
 * @description PUT is used here becuse we should replace the visit if exist
 * @param 			visiteeId
 * @param 			visitorId
 * @returns 		express Response
 */
const visitUserProfile = async (visiteeId: number, visitorId: number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/visits`, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
      },
      body: JSON.stringify({
        visiteeId,
        visitorId,
      }),
    });
    return res;
  } catch (err) {
    console.log(`[catch error visitUserProfile()] ${err}`);
    throw err;
  }
};

const getVisits = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/visits`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
      },
    });
    return res;
  } catch (err) {
    console.log(`[catch error getVisits()] ${err}`);
    throw err;
  }
};

const setVisitToSeen = async (visitorId: number, visiteeId: number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/visits`, {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getUserTokenFromLocalStorage()}`,
      },
      body: JSON.stringify({
        visiteeId,
        visitorId,
      }),
    });
    return res;
  } catch (err) {
    console.log(`[catch error getVisits()] ${err}`);
    throw err;
  }
};

export { visitUserProfile, getVisits, setVisitToSeen };
