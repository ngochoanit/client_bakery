import React from 'react';
import { Layout, Typography } from 'antd';
import './index.less';
import { Link } from 'react-router-dom';

const prefixCls = 'app-footer';
const { Footer } = Layout;
const { Text } = Typography;
const FooterLayout = function FooterLayout() {
  return (
    <Footer className={prefixCls} id="app-footer">
      <div>
        <Text>{`Copyright ©${new Date().getFullYear()} `}</Text>
        <Link to="/#">Sigma PowerDNS</Link>
      </div>
    </Footer>
  );
};

export default FooterLayout;
