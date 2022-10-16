import React from 'react';
import { Layout } from 'antd';
import IMAGES from 'src/constants/images';
import { Link } from 'react-router-dom';
import './index.less';
import clsx from 'clsx';
import SideMenu from './SideMenu';

const { Sider } = Layout;
const prefixCls = 'app-sider';
const SiderLayout = function SiderLayout({
  collapsed,
}: {
  collapsed: boolean;
}) {
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className={prefixCls}
      width={240}
    >
      <div className={`${prefixCls}-logo`}>
        <Link to="/">
          <img
            alt="logo powerDNS"
            src={IMAGES.logo_short}
            className={clsx(`${prefixCls}-logo-img`, collapsed && 'active')}
          />
          <img
            alt="logo powerDNS"
            src={IMAGES.logo_white}
            className={clsx(`${prefixCls}-logo-img`, !collapsed && 'active')}
          />
        </Link>
      </div>
      <SideMenu />
    </Sider>
  );
};

export default SiderLayout;
