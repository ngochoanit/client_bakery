import { Select, SelectProps } from 'antd';
import React from 'react';

const AppSelect = function AppSelect(props: SelectProps) {
  return (
    <Select {...props} getPopupContainer={(trigger) => trigger.parentNode} />
  );
};

export default AppSelect;
