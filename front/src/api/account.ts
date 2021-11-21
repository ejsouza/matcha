import { API_BASE_URL } from 'utils/config';

const verifyAccount = async (token: string) => {
  if (!token) {
    return;
  }
  try {
    const res = await fetch(`${API_BASE_URL}/account?token=${token}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res;
  } catch (err) {
    console.log(`[catch error verifyAccountf()] ${err}`);
    throw err;
  }
};

export { verifyAccount };
