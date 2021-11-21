import React, { useEffect } from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from 'components/Layout';
import 'App.css';
import { LOGGED_USER } from 'utils/const';
import { useAppDispatch } from 'store/hook';
import { userInfoUpdated, isLoggedUpdated } from 'store/actions';
import NoMatch from 'components/pages/NoMatch';
import AccountActivate from 'components/pages/AccountActivate';
import ForgotPassword from 'components/pages/ForgotPassword';

const App = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const user = localStorage.getItem(LOGGED_USER);
    if (user) {
      dispatch(isLoggedUpdated(true));
      dispatch(userInfoUpdated(JSON.parse(user)));
    }
  }, [dispatch]);
  const routes = useRoutes([
    { path: '/', element: <Layout /> },
    { path: '/account-activate', element: <AccountActivate /> },
    { path: '/forgot-password', element: <ForgotPassword /> },
    { path: '*', element: <NoMatch /> },
  ]);
  return routes;
};

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;
