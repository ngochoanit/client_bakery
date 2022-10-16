import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import menu, { MenuItem } from 'src/constants/menu';
import type { MenuProps } from 'antd';
import { useAppDispatch, useAppSelector } from 'src/redux';
import { Link } from 'react-router-dom';
import { setItemActive } from 'src/redux/slices/menuSlice';
import { useLocation } from 'react-router';

const prefixCls = 'app-side-menu';
const SideMenu = function SideMenu() {
  const user = useAppSelector((s) => s.auth.user);
  const [menuList, setMenuLit] = useState<MenuProps['items']>([]);
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((s) => s.menu.isOpen);
  const location = useLocation();
  const getMenu = (list: MenuItem[]): MenuProps['items'] => {
    // eslint-disable-next-line array-callback-return, consistent-return
    const menuItems: MenuProps['items'] = [];
    list.forEach((item, index) => {
      if (!item.role || (user && item.role.includes(user.role))) {
        menuItems.push({
          label: item?.route ? (
            <Link to={item.route}>{item.text}</Link>
          ) : (
            item.text
          ),
          key: item.route ? item.route : index,
          icon: item.icon,
          children: item.children ? getMenu(item.children) : undefined,
        });
      }
    });
    return menuItems;
  };
  useEffect(() => {
    if (user) {
      setMenuLit(getMenu(menu));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const pathSnippets = location.pathname
    .split('/')
    .filter((i) => i)
    .map((j) => `/${j}`);
  return (
    <Menu
      className={prefixCls}
      defaultSelectedKeys={
        pathSnippets.length > 0 ? [...pathSnippets] : ['/domains']
      }
      mode="inline"
      items={menuList}
      theme="dark"
      onSelect={({ key }) => {
        dispatch(setItemActive({ itemActive: key, isOpen }));
      }}
    />
  );
};

export default SideMenu;
