import React from 'react';
import { Tooltip, TooltipProps } from 'antd';
import './index.less';

type TAppTooltipProps = TooltipProps & {
  color?: 'success' | 'warning' | 'primary' | 'error' | 'white';
};
const AppTooltip = function AppTooltip(props: TAppTooltipProps) {
  const { color = 'primary', placement = 'top', children, ...rest } = props;
  return (
    <Tooltip overlayClassName={color} {...rest} placement={placement}>
      {children}
    </Tooltip>
  );
};

export default AppTooltip;
