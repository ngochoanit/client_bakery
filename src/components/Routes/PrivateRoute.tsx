/* eslint-disable react/require-default-props */

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
// import { IRRSocket, RREventType } from 'src/@types/entities/socket';
import ROUTE from 'src/constants/route';
// import useSocket from 'src/hooks/useSocket';
import { useAppSelector } from 'src/redux';
import MainLayout from '../MainLayout';

interface PropsType {
  children: any;
  title?: string;
}

const PrivateRoute = function PrivateRoute(props: PropsType) {
  const { title = 'Home page', children } = props;
  const userInfo = useAppSelector((s) => s.auth.user);
  // const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // const { appSocket } = useSocket();

  const { t } = useTranslation();
  useEffect(() => {
    // set title
    document.title = t(title);
  }, [title, t]);

  useEffect(() => {
    if (!userInfo) {
      navigate(ROUTE.LOGIN);
    }
  }, [navigate, userInfo]);

  // useEffect(() => {
  //   if (appSocket) {
  //     appSocket.on('create_domain_ok', (data: IRRSocket) => {
  //       console.log(data);
  //       // dispatch(saveMessage({ ...data, event: RREventType.CreateOk }));
  //     });
  //     appSocket.on('create_domain_fail', (data: IRRSocket) => {
  //       console.log(data);
  //       // dispatch(saveMessage({ ...data, event: RREventType.CreateFail }));
  //     });
  //     appSocket.on('delete_domain_ok', (data: IRRSocket) => {
  //       console.log(data);
  //       // dispatch(saveMessage({ ...data, event: RREventType.DeleteOk }));
  //     });
  //     appSocket.on('delete_domain_fail', (data: IRRSocket) => {
  //       console.log(data);
  //       // dispatch(saveMessage({ ...data, event: RREventType.DeleteFail }));
  //     });
  //     appSocket.on('create_record_ok', (data: IRRSocket) => {
  //       console.log(data);
  //       // dispatch(saveMessage({ ...data, event: RREventType.CreateOk }));
  //     });
  //     appSocket.on('create_record_fail', (data: IRRSocket) => {
  //       console.log(data);
  //       // dispatch(saveMessage({ ...data, event: RREventType.CreateFail }));
  //     });
  //     appSocket.on('delete_record_ok', (data: IRRSocket) => {
  //       console.log(data);
  //       // dispatch(saveMessage({ ...data, event: RREventType.DeleteOk }));
  //     });
  //     appSocket.on('delete_record_fail', (data: IRRSocket) => {
  //       console.log(data);
  //       // dispatch(saveMessage({ ...data, event: RREventType.DeleteFail }));
  //     });
  //     appSocket.on('update_record_ok', (data: IRRSocket) => {
  //       console.log(data);
  //       // dispatch(saveMessage({ ...data, event: RREventType.UpdateOk }));
  //     });
  //     appSocket.on('update_record_fail', (data: IRRSocket) => {
  //       console.log(data);
  //       // dispatch(saveMessage({ ...data, event: RREventType.UpdateFail }));
  //     });
  //   }
  // }, [appSocket, dispatch]);
  return <MainLayout>{children}</MainLayout>;
};

export default PrivateRoute;
