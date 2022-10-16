import React from 'react';
import { Layout } from 'antd';
import './index.less';

const { Content } = Layout;
interface TContentLayout {
  children: React.ReactNode;
}
const ContentLayout = function ContentLayout(props: TContentLayout) {
  const { children } = props;
  return <Content style={{ padding: '16px' }}>{children}</Content>;
};

export default ContentLayout;
