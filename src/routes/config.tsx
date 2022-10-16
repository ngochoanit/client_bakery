import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from 'src/components/Routes/PrivateRoute';
import PublicRoute from 'src/components/Routes/PublicRoute';
import ROLE from 'src/constants/role';
import ROUTE from 'src/constants/route';
import TRANSLATE_KEY from 'src/languages/locales/translateKey';
import configBackendPage from 'src/pages/configBackend';
import ConfigDomainPage from 'src/pages/configDomain';
import configRemotePage from 'src/pages/configRemote';
import DomainPage from 'src/pages/domain';
import LoginPage from 'src/pages/login';
import MerchantPage from 'src/pages/merchant';
import NotFoundPage from 'src/pages/notFound';
import UserPage from 'src/pages/user';
import ProfilePage from 'src/pages/profile';
import MetricsPage from 'src/pages/metrics';

export type IRoute = RouteObject & {
  path: ROUTE | string;
  element: React.ReactNode;
  title?: string;
  isPrivate?: boolean;
  is404?: boolean;
  role?: ROLE[];
};

export type IRoute2 = RouteObject & {
  path: ROUTE | string;
  element: React.ReactNode;
  title?: string;
  isPrivate?: boolean;
  isDocument?: boolean;
};

export const routes: IRoute[] = [
  {
    path: ROUTE.HOME,
    element: DomainPage,
    title: TRANSLATE_KEY.home_page,
    isPrivate: true,
  },
  {
    path: ROUTE.LOGIN,
    element: LoginPage,
    title: TRANSLATE_KEY.login,
    isAuth: true,
  },
  {
    path: ROUTE.PROFILE,
    element: ProfilePage,
    title: TRANSLATE_KEY.profile,
    isPrivate: true,
  },
  // {
  //   path: ROUTE.DASHBOARD,
  //   element: DomainPage,
  //   title: TRANSLATE_KEY.dashboard,
  //   isPrivate: true,
  // },
  {
    path: ROUTE.CONFIG_DOMAIN,
    element: ConfigDomainPage,
    title: TRANSLATE_KEY.domains_config,
    isPrivate: true,
  },
  {
    path: ROUTE.DOMAINS,
    element: DomainPage,
    title: TRANSLATE_KEY.domains,
    isPrivate: true,
  },
  {
    path: ROUTE.USERS,
    element: UserPage,
    title: TRANSLATE_KEY.users,
    isPrivate: true,
    role: [ROLE.ADMIN, ROLE.MERCHANT],
  },
  {
    path: ROUTE.MERCHANTS,
    element: MerchantPage,
    title: TRANSLATE_KEY.merchants,
    isPrivate: true,
    role: [ROLE.ADMIN],
  },
  // {
  //   path: ROUTE.ADMIN_CONFIG_BACKEND_ID,
  //   element: configBackendPage,
  //   title: TRANSLATE_KEY.config_backend,
  //   isPrivate: true,
  //   role: [ROLE.ADMIN],
  // },
  // {
  //   path: ROUTE.ADMIN_CONFIG_BACKEND,
  //   element: configBackendAdminPage,
  //   title: TRANSLATE_KEY.config_backend,
  //   isPrivate: true,
  //   role: [ROLE.ADMIN],
  // },
  {
    path: ROUTE.CONFIG_BACKEND,
    element: configBackendPage,
    title: TRANSLATE_KEY.config_backend,
    isPrivate: true,
  },
  {
    path: ROUTE.METRICS,
    element: MetricsPage,
    title: TRANSLATE_KEY.metrics,
    isPrivate: true,
    role: [ROLE.ADMIN, ROLE.MERCHANT, ROLE.USER],
  },
  {
    path: ROUTE.CONFIG_REMOTE_BACKEND,
    element: configRemotePage,
    title: TRANSLATE_KEY.config_remote_backend,
    isPrivate: true,
  },
  {
    path: '*',
    title: '404',
    is404: true,
    element: NotFoundPage,
  },
].map((route) => {
  if (route.isPrivate) {
    return {
      ...route,
      element: (
        <PrivateRoute title={route.title}>
          <route.element />
        </PrivateRoute>
      ),
    };
  }
  return {
    ...route,
    element: (
      <PublicRoute title={route.title}>
        <route.element />
      </PublicRoute>
    ),
  };
});
