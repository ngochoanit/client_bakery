import React, { useState } from 'react';
import { Avatar, Col, Row, Space, Typography } from 'antd';
import './index.less';
import { useAppSelector } from 'src/redux';
import TRANSLATE_KEY from 'src/languages/locales/translateKey';
import { KeyOutlined, UserOutlined } from '@ant-design/icons';
import Button from 'antd-button-color';

const prefixCls = 'app-profile';
const Profile = function Profile() {
  const userInfo = useAppSelector((s) => s.auth.user);
  const [selected, setSelected] = useState(true);
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

  return (
    <Row gutter={[24, 24]} className={prefixCls}>
      <Col xs={24} md={8}>
        <Row gutter={[24, 16]} justify="center" align="middle">
          {userInfo && (
            <Col span={24}>
              <Space
                direction="vertical"
                align="center"
                style={{ width: '100%' }}
                size={[1, 16]}
                wrap
              >
                <Avatar
                  size={80}
                  style={{
                    background: stringToColor(
                      `${userInfo.firstName} ${userInfo.lastName}`,
                    ),
                    marginRight: '8px',
                    fontSize: '32px',
                  }}
                  className="app-user-button-avatar"
                >
                  {userInfo.lastName.slice(0, 1)}
                </Avatar>
                <Typography.Title level={5}>
                  {userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : ''}
                </Typography.Title>
              </Space>
            </Col>
          )}
          <Col span={24}>
            <Button
              type={selected ? 'primary' : 'default'}
              icon={<UserOutlined />}
              style={{ width: '100%' }}
            >
              {TRANSLATE_KEY.personal_information}
            </Button>
          </Col>
          <Col span={24}>
            <Button
              type={!selected ? 'primary' : 'default'}
              icon={<KeyOutlined />}
              style={{ width: '100%' }}
            >
              {TRANSLATE_KEY.password}
            </Button>
          </Col>
        </Row>
      </Col>
      <Col xs={24} md={16}>
        content
      </Col>
    </Row>
  );
};

export default Profile;
