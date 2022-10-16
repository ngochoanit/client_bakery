import React from 'react';
import { Grid, Layout } from 'antd';
import './index.less';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import IMAGES from 'src/constants/images';
import AppUserButton from 'src/components/AppUserButton';
import Button from 'antd-button-color';
import { useAppDispatch, useAppSelector } from 'src/redux';
import { setIsOpen } from 'src/redux/slices/menuSlice';

const { useBreakpoint } = Grid;
const prefixCls = 'app-header';
const { Header } = Layout;
const HeaderLayout = function HeaderLayout() {
  const dispatch = useAppDispatch();
  const itemActive = useAppSelector((s) => s.menu.itemActive);
  const isOpen = useAppSelector((s) => s.menu.isOpen);
  const { md } = useBreakpoint();
  return (
    <Header className={prefixCls} id="app-header">
      <div className={`${prefixCls}-left`}>
        <Button
          with="link"
          type="dark"
          icon={
            !isOpen ? (
              <MenuUnfoldOutlined className={`${prefixCls}-toggle-menu`} />
            ) : (
              <MenuFoldOutlined className={`${prefixCls}-toggle-menu`} />
            )
          }
          onClick={() => {
            dispatch(setIsOpen({ itemActive, isOpen: !isOpen }));
          }}
        />
        {!md && (
          <Link to="/" className={`${prefixCls}-logo-link`}>
            <img
              alt="logo powerDNS"
              src={IMAGES.logo_short}
              className={`${prefixCls}-logo-img`}
            />
          </Link>
        )}
      </div>
      <div className={`${prefixCls}-right`}>
        {/* <Button
          with="link"
          type="dark"
          icon={<BellOutlined style={{ fontSize: '18px' }} />}
          onClick={onToggle}
        /> */}
        <AppUserButton />
      </div>
    </Header>
  );
};

export default HeaderLayout;
