import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from 'components/Layout';
import 'App.css';
import { LOGGED_USER } from 'utils/const';
import { useAppDispatch } from 'store/hook';
import { userInfoUpdated, isLoggedUpdated } from 'store/actions';

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const user = localStorage.getItem(LOGGED_USER);
    if (user) {
      console.log(`Me := ${user}`);
      dispatch(isLoggedUpdated(true));
      dispatch(userInfoUpdated(JSON.parse(user)));
    }
  }, [dispatch]);
  return <Layout />;
}

export default App;
