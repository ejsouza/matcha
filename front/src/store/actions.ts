import {
  IS_LOGGED_UPDATED,
  TOKEN_UPDATED,
  SHOW_LOGIN_CARD_UPDATED,
  SHOW_SIGNUP_CARD_UPDATED,
  IS_DESKTOP_UPDATED,
  USER_INFO_UPDATED,
} from '../utils/const';
import { UserInterface } from 'interfaces';

const isLoggedUpdated = (isLogged: boolean) => {
  return { type: IS_LOGGED_UPDATED, isLogged };
};

const tokenUpdated = (token: string) => {
  return { type: TOKEN_UPDATED, token };
};

const showLoginCardUpdated = (showLoginCard: boolean) => {
  return { type: SHOW_LOGIN_CARD_UPDATED, showLoginCard };
};

const showSignupCardUpdated = (showSignupCard: boolean) => {
  return { type: SHOW_SIGNUP_CARD_UPDATED, showSignupCard };
};

const isDesktopUpdated = (isDesktop: boolean) => {
  return { type: IS_DESKTOP_UPDATED, isDesktop };
};

const userInfoUpdated = (user: UserInterface) => {
  return { type: USER_INFO_UPDATED, user };
};

export {
  isLoggedUpdated,
  tokenUpdated,
  showLoginCardUpdated,
  isDesktopUpdated,
  showSignupCardUpdated,
  userInfoUpdated,
};
