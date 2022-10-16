import { EyeOutlined } from '@ant-design/icons';
import { Input, InputProps } from 'antd';
import clsx from 'clsx';
import React, { useState } from 'react';
import TRANSLATE_KEY from 'src/languages/locales/translateKey';

const AppInputPassword = function AppInputPassword(props: InputProps) {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <Input
      {...props}
      name="new-password"
      autoComplete="new-password"
      type={isVisible ? 'text' : 'password'}
      suffix={
        <div
          className={clsx(isVisible && 'color-active')}
          style={{ cursor: 'pointer' }}
          onMouseDown={() => {
            setIsVisible(true);
          }}
          onMouseUp={() => {
            setIsVisible(false);
          }}
        >
          <EyeOutlined />
        </div>
      }
      placeholder={TRANSLATE_KEY.password}
    />
  );
};

export default AppInputPassword;
