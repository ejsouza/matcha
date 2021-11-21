import { API_BASE_URL } from 'utils/config';

interface UserInterface {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const login = async (username: string, password: string) => {
  return fetch(`${API_BASE_URL}/auth`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  }).then((res) => res);
};

const signup = async (user: UserInterface) => {
  try {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: user.userName,
        email: user.email,
        password: user.password,
        firstname: user.firstName,
        lastname: user.lastName,
      }),
    });
    return res;
  } catch (err) {
    console.log(`catch(${err})`);
    throw err;
  }
};

export { login, signup };
