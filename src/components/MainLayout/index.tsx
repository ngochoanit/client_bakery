import React, { ReactNode } from 'react';
import { Grid, Layout } from 'antd';
import { useAppSelector } from 'src/redux';
import FooterLayout from './Footer/FooterLayout';
import HeaderLayout from './Header/HeaderLayout';
import SiderLayout from './Sider/SiderLayout';
import MenuMobile from './Sider/MenuMobile';
import ContentLayout from './ContentLayout/ContentLayout';

interface MainLayoutProps {
  children: ReactNode;
}
const prefixCls = 'app-main-layout';
const { useBreakpoint } = Grid;
const MainLayout = function MainLayout(props: MainLayoutProps) {
  const screens = useBreakpoint();
  const isOpen = useAppSelector((s) => s.menu.isOpen);

  const { children } = props;

  return (
    <Layout className={prefixCls}>
      {screens.md ? <SiderLayout collapsed={!isOpen} /> : <MenuMobile />}

      <Layout style={{ height: '100vh' }}>
        <HeaderLayout />
        <ContentLayout>{children}</ContentLayout>
        <FooterLayout />
      </Layout>
    </Layout>
  );
};

export default MainLayout;
