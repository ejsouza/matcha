import NavBarDesktop from 'components/desktop/NavBarDesktop';
import SignUp from 'components/SignUp';
import LoginDesktop from 'components/desktop/LoginDesktop';
import HomeDesktop from 'components/desktop/HomeDesktop';
import { useAppSelector } from 'store/hook';

const Desktop = () => {
  const isLogged = useAppSelector((state) => state.isLogged);
  return (
    <>
      {!isLogged && (
        <>
          <NavBarDesktop />
          <LoginDesktop />
          <SignUp />
        </>
      )}
      {isLogged && <HomeDesktop />}
    </>
  );
};

export default Desktop;
