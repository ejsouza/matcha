import NavBar from './NavBarDesktop';
import SignUp from 'components/SignUp';
import LoginDesktop from './LoginDesktop';
import HomeDesktop from './HomeDesktop';
import { useAppSelector } from 'store/hook';

const Desktop = () => {
  const isLogged = useAppSelector((state) => state.isLogged);
  return (
    <>
      {!isLogged && (
        <>
          <NavBar />
          <LoginDesktop />
          <SignUp />
        </>
      )}
      {isLogged && <HomeDesktop />}
    </>
  );
};

export default Desktop;
