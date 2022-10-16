import React from 'react';
import { Tag, TagProps } from 'antd';
import './index.less';
import clsx from 'clsx';

type TAppTagProps = TagProps & {
  color?: 'success' | 'warning' | 'primary' | 'danger' | 'white' | string;
};
const AppTag = function AppTag(props: TAppTagProps) {
  const { color, children, ...rest } = props;
  return (
    <Tag className={clsx('app-tag', color)} {...rest}>
      {children}
    </Tag>
  );
};

export default AppTag;
