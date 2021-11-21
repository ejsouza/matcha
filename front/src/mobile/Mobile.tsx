import NavBarDesktop from 'components/desktop/NavBarDesktop';
import SignUp from 'components/SignUp';
import LoginDesktop from 'components/desktop/LoginDesktop';
import HomeMobile from './HomeMobile';
import { useAppSelector } from 'store/hook';

const Mobile = () => {
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
      {isLogged && <HomeMobile />}
    </>
  );
};

export default Mobile;
