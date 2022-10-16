import React from 'react';
import { Drawer } from 'antd';
import { Link } from 'react-router-dom';
import IMAGES from 'src/constants/images';
import { useAppDispatch, useAppSelector } from 'src/redux';
import { setIsOpen } from 'src/redux/slices/menuSlice';
import SideMenu from '../SideMenu';
import './index.less';

const prefixCls = 'app-menu-mobile';
const MenuMobile = function MenuMobile() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((s) => s.menu.isOpen);
  const itemActive = useAppSelector((s) => s.menu.itemActive);
  return (
    <Drawer
      title={
        <div className={`${prefixCls}-logo`}>
          <Link to="/" className={`${prefixCls}-logo-link`}>
            <img
              alt="logo powerDNS"
              src={IMAGES.logo_white}
              className={`${prefixCls}-logo-img`}
            />
          </Link>
        </div>
      }
      placement="left"
      closable={false}
      onClose={() => {
        dispatch(setIsOpen({ itemActive, isOpen: false }));
      }}
      open={isOpen}
      getContainer={false}
      width={240}
      className={`${prefixCls}`}
    >
      <SideMenu />
    </Drawer>
  );
};

export default MenuMobile;
