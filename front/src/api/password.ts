import { API_BASE_URL } from 'utils/config';

const resetPassword = async (email: string, password: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/password`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return res;
  } catch (err) {
    console.log(`[catch error resetPassword()] ${err}`);
    throw err;
  }
};

export { resetPassword };
