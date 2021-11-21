import { FC, ReactNode, useLayoutEffect, useState, useEffect } from 'react';
import Desktop from './desktop/Desktop';
import Mobile from 'mobile/Mobile';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { isDesktopUpdated } from 'store/actions';
import { isDesktop } from 'utils/isDesktop';

const Layout: FC<{ children?: ReactNode }> = ({ children }) => {
  const [size, setSize] = useState([0, 0]);
  const dispatch = useAppDispatch();
  const isMobile = useAppSelector((state) => state.isDesktop);
  useLayoutEffect(() => {
    const updateSize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    dispatch(isDesktopUpdated(isDesktop()));
  }, [size, dispatch]);

  return (
    <>
      {/* check if is Desktop before showing */}
      {!isMobile && <Desktop />}
      {isMobile && <Mobile />}
      {children}
    </>
  );
};

export default Layout;
