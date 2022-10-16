import React from 'react';
import {
  BarChartOutlined,
  ContainerOutlined,
  // DashboardOutlined,
  // FieldTimeOutlined,
  GlobalOutlined,
  TeamOutlined,
  // ClusterOutlined,
  // UnorderedListOutlined,
  UserOutlined,
  // CloudUploadOutlined,
  // SettingOutlined,
} from '@ant-design/icons';
import TRANSLATE_KEY from 'src/languages/locales/translateKey';
import ROLE from './role';
import ROUTE from './route';

export interface MenuItem {
  text: string;
  icon?: React.ReactNode;
  route?: ROUTE;
  // resource?: RESOURCE_NAME;
  children?: MenuItem[];
  params?: { [key: string]: string };
  role?: ROLE[];
  hide?: boolean;
}

const menu: MenuItem[] = [
  // {
  //   text: TRANSLATE_KEY.dashboard,
  //   icon: <DashboardOutlined />,
  //   route: ROUTE.DASHBOARD,
  // },
  {
    text: TRANSLATE_KEY.domains,
    icon: <GlobalOutlined />,
    route: ROUTE.DOMAINS,
  },
  {
    text: TRANSLATE_KEY.config_backend,
    icon: <ContainerOutlined />,
    route: ROUTE.CONFIG_BACKEND,
  },
  {
    text: TRANSLATE_KEY.metrics,
    icon: <BarChartOutlined />,
    route: ROUTE.METRICS,
  },
  {
    text: TRANSLATE_KEY.users,
    icon: <UserOutlined />,
    route: ROUTE.USERS,
    role: [ROLE.ADMIN, ROLE.MERCHANT],
  },
  {
    text: TRANSLATE_KEY.merchants,
    icon: <TeamOutlined />,
    route: ROUTE.MERCHANTS,
    role: [ROLE.ADMIN],
  },
  // {
  //   text: TRANSLATE_KEY.setting_powerdns,
  //   icon: <SettingOutlined />,
  //   route: ROUTE.SETTING_POWERDNS,
  // },
  // {
  //   text: TRANSLATE_KEY.white_list_ip,
  //   icon: <UnorderedListOutlined />,
  //   route: ROUTE.WHITE_LIST_IP,
  // },

  // {
  //   text: TRANSLATE_KEY.config_remote_backend,
  //   icon: <CloudUploadOutlined />,
  //   route: ROUTE.CONFIG_REMOTE_BACKEND,
  // },
  // {
  //   text: TRANSLATE_KEY.logs,
  //   icon: <FieldTimeOutlined />,
  //   children: [
  //     {
  //       text: TRANSLATE_KEY.powerdns,
  //       route: ROUTE.LOG_POWERDNS,
  //     },
  //     {
  //       text: TRANSLATE_KEY.cms,
  //       route: ROUTE.LOG_CMS,
  //     },
  //   ],
  // },
];

export default menu;
