import React, { FC, useEffect, useRef } from 'react';
import localforage from 'localforage';
import { HashRouter as Router } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './redux';
import { LFUserInfo } from './@types/localForage/userInfo';
import { getLocalForageItem } from './utils/localForage';
import LOCAL_FORAGE_KEY from './constants/localForageKey';
import {
  clearData,
  getUserInfo,
  saveAccessToken,
  saveUserId,
  set404,
  setLogin,
} from './redux/slices/authSlice';
import AppRouter from './routes';

const App: FC = function App() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.accessToken);
  const userId = useAppSelector((s) => s.auth.userId);
  const userInfo = useAppSelector((s) => s.auth.user);

  useEffect(() => {
    const getUser = async () => {
      const user = await getLocalForageItem<LFUserInfo>(
        LOCAL_FORAGE_KEY.USER_INFO,
      );
      if (!user) {
        dispatch(clearData());
        dispatch(set404());
        dispatch(setLogin());
      }
    };
    window.addEventListener('storage', getUser);
    return () => {
      window.removeEventListener('storage', getUser);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    const getUser = async () => {
      if (token && userId) {
        if (!userInfo) {
          dispatch(getUserInfo(userId));
        }
      } else {
        const uInfo = await getLocalForageItem<LFUserInfo>(
          LOCAL_FORAGE_KEY.USER_INFO,
        );

        if (uInfo) {
          dispatch(saveUserId(uInfo.userId));
          dispatch(saveAccessToken(uInfo.accessToken));
          dispatch(getUserInfo(uInfo.userId));
        } else {
          dispatch(set404());
          dispatch(setLogin());
        }
      }
    };
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    localforage.setDriver(localforage.LOCALSTORAGE);
  }, []);

  return (
    <Router>
      <AppRouter />
    </Router>
  );
};

export default App;
