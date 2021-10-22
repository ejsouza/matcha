import redux, { createStore } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import {
  IS_LOGGED_UPDATED,
  TOKEN_UPDATED,
  SHOW_LOGIN_CARD_UPDATED,
  SHOW_SIGNUP_CARD_UPDATED,
  IS_DESKTOP_UPDATED,
  USER_INFO_UPDATED,
} from '../utils/const';

import { UserInterface } from 'interfaces';

let store: redux.Store | undefined;
export const user: UserInterface = {
  activated: null,
  birthdate: null,
  created_at: new Date(),
  updated_at: new Date(),
  biography: '',
  email: '',
  firstname: '',
  gender: null,
  id: 0,
  lastname: '',
  localisation: {
    x: 0,
    y: 0,
  },
  modified: null,
  sexual_orientation: 'bisexual',
  username: '',
  default_picture: '',
  is_connected: 0,
};

const initialState = {
  isLogged: false,
  token: '',
  showLoginCard: false,
  showSignupCard: false,
  isDesktop: true,
  user,
};

const updateIsLogged = (isLogged: boolean) => {
  return <const>{
    type: IS_LOGGED_UPDATED,
    isLogged,
  };
};

const updateToken = (token: string) => {
  return <const>{
    type: TOKEN_UPDATED,
    token,
  };
};

const updateShowLoginCard = (showLoginCard: boolean) => {
  return <const>{
    type: SHOW_LOGIN_CARD_UPDATED,
    showLoginCard,
  };
};

const updateShowSignupCard = (showSignupCard: boolean) => {
  return <const>{
    type: SHOW_SIGNUP_CARD_UPDATED,
    showSignupCard,
  };
};

const updateIsDesktop = (isDesktop: boolean) => {
  return <const>{
    type: IS_DESKTOP_UPDATED,
    isDesktop,
  };
};

const updateUserInfo = (user: UserInterface) => {
  console.log(`Store[update user] ${user}`);
  return <const>{
    type: USER_INFO_UPDATED,
    user,
  };
};

type ActionsType = ReturnType<
  | typeof updateIsLogged
  | typeof updateToken
  | typeof updateShowLoginCard
  | typeof updateIsDesktop
  | typeof updateShowSignupCard
  | typeof updateUserInfo
>;
type State = typeof initialState;

const reducer = (state = initialState, action: ActionsType): State => {
  switch (action.type) {
    case IS_LOGGED_UPDATED:
      return {
        ...state,
        isLogged: action.isLogged,
      };
    case TOKEN_UPDATED:
      return {
        ...state,
        token: action.token,
      };
    case SHOW_LOGIN_CARD_UPDATED:
      return {
        ...state,
        showLoginCard: action.showLoginCard,
      };
    case SHOW_SIGNUP_CARD_UPDATED:
      return {
        ...state,
        showSignupCard: action.showSignupCard,
      };
    case IS_DESKTOP_UPDATED:
      return {
        ...state,
        isDesktop: action.isDesktop,
      };
    case USER_INFO_UPDATED:
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
};

store = configureStore({
  reducer: reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const initStore = (preloadedState = initialState) => {
  return createStore(reducer, preloadedState);
};

export const appStore = initStore(initialState);
