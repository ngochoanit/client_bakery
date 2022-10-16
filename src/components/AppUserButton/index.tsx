import React, { useState } from 'react';
import { Avatar, Menu, Popover, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from 'src/redux';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import TRANSLATE_KEY from 'src/languages/locales/translateKey';
import './index.less';
import Button from 'antd-button-color';
import localforage from 'localforage';
import LOCAL_FORAGE_KEY from 'src/constants/localForageKey';
import { clearData } from 'src/redux/slices/authSlice';
import ROUTE from 'src/constants/route';
import { useNavigate } from 'react-router';
import { clearDataMenu } from 'src/redux/slices/menuSlice';

const Content = function Content({ onClose }: { onClose: () => void }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const menuItem = [
    // {
    //   label: TRANSLATE_KEY.profile,
    //   key: TRANSLATE_KEY.profile,
    //   icon: <ProfileOutlined />,
    //   onClick: async () => {
    //     navigate(ROUTE.PROFILE);
    //     onClose();
    //   },
    // },
    {
      label: TRANSLATE_KEY.logout,
      key: TRANSLATE_KEY.logout,
      icon: <LogoutOutlined />,
      onClick: async () => {
        localforage.removeItem(LOCAL_FORAGE_KEY.USER_INFO);
        dispatch(clearData());
        dispatch(clearDataMenu());
        navigate(ROUTE.LOGIN);
      },
    },
  ];
  return <Menu mode="inline" theme="light" items={menuItem} />;
};
const AppUserButton = function AppUserButton() {
  const [visible, setVisible] = useState(false);
  const userInfo = useAppSelector((s) => s.auth.user);
  const stringToColor = (string: string) => {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  };
  const handleVisibleChange = (newVisible: boolean) => {
    setVisible(newVisible);
  };
  return (
    <Popover
      style={{ padding: 0 }}
      content={
        <Content
          onClose={() => {
            setVisible(!visible);
          }}
        />
      }
      trigger="click"
      open={visible}
      onOpenChange={handleVisibleChange}
    >
      <Button
        style={{ maxWidth: 200 }}
        with="link"
        type="dark"
        className="app-flex-center"
      >
        {userInfo ? (
          <Avatar
            size={32}
            style={{
              background: stringToColor(
                `${userInfo.firstName} ${userInfo.lastName}`,
              ),
              marginRight: '8px',
            }}
            className="app-user-button-avatar"
          >
            {userInfo.lastName.slice(0, 1)}
          </Avatar>
        ) : (
          <UserOutlined />
        )}
        <Typography.Paragraph
          style={{ maxWidth: 'calc(100% - 40px)' }}
          ellipsis={{
            rows: 1,
          }}
          strong
        >
          {userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : ''}
        </Typography.Paragraph>
      </Button>
    </Popover>
  );
};

export default AppUserButton;
