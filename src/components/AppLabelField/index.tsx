import React from 'react';
import { Typography } from 'antd';
import clsx from 'clsx';

const AppLabelField = function AppLabelField({
  title,
  required,
}: {
  title: string;
  required?: boolean;
}) {
  return (
    <Typography.Text
      className={clsx('app-label-field', required && 'required')}
    >
      {title}
    </Typography.Text>
  );
};

export default AppLabelField;
