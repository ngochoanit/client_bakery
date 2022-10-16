import React from 'react';
import { Button, Dropdown, DropdownProps, Typography } from 'antd';

import './index.less';

interface AppButtonDropdownProps extends DropdownProps {
  icon: React.ReactNode;
  text?: React.ReactNode;
}
function AppButtonDropdown(props: AppButtonDropdownProps) {
  const { icon, text, ...rest } = props;
  return (
    <Dropdown {...rest} className="btn-dropdown">
      <Button>
        <div className="content">
          {text && <Typography.Text className="text">{text}</Typography.Text>}
          {icon}
        </div>
      </Button>
    </Dropdown>
  );
}

export default AppButtonDropdown;
