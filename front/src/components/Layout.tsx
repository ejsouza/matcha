import { FC, ReactNode, useLayoutEffect, useState, useEffect } from 'react';
import Desktop from './Desktop/Desktop';
import { useAppDispatch } from 'store/hook';
import { isDesktopUpdated } from 'store/actions';
import { isDesktop } from 'utils/isDesktop';

const Layout: FC<{ children?: ReactNode }> = ({ children }) => {
  const [size, setSize] = useState([0, 0]);
  const dispatch = useAppDispatch();
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
      <Desktop />
      {children}
    </>
  );
};

export default Layout;
