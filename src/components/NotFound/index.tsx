import { Button, Layout, Result } from 'antd';
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ROUTE from 'src/constants/route';
import TRANSLATE_KEY from 'src/languages/locales/translateKey';
import { useAppSelector } from 'src/redux';

const NotFound = function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = useAppSelector((s) => s.auth.user);
  const isLogin = useAppSelector((s) => s.auth.isLogin);
  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '' || isLogin) {
      navigate(ROUTE.LOGIN);
    }
  }, [location.pathname, navigate, isLogin]);

  return (
    <Layout className="app-flex-center" style={{ height: '100vh' }}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button
            type="primary"
            onClick={() => {
              navigate(userInfo ? ROUTE.HOME : ROUTE.LOGIN);
            }}
          >
            {userInfo ? TRANSLATE_KEY.go_to_home : TRANSLATE_KEY.go_to_login}
          </Button>
        }
      />
    </Layout>
  );
};

export default NotFound;
