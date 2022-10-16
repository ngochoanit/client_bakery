import {
  DatabaseFilled,
  DiffFilled,
  NodeExpandOutlined,
} from '@ant-design/icons';
import { Card, Space, Tabs } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import ROUTE from 'src/constants/route';
import { isAdmin } from 'src/helpers';
import TRANSLATE_KEY from 'src/languages/locales/translateKey';
import { useAppSelector } from 'src/redux';
import ConfigServer from '../configServer';
import Record from '../record';
import TrafficFlow from '../trafficFlow';

function ConfigDomain() {
  const {
    domainId = '',
    domainName = '',
    merchantId = '',
    currentTab = 'records',
  } = useParams();
  const userInfo = useAppSelector((s) => s.auth.user);
  const [isOpen, setIsOpen] = useState(false);
  const onToggle = () => {
    setIsOpen(!isOpen);
  };
  const navigate = useNavigate();
  const [size] = useState<SizeType>('middle');
  const tabs = [
    {
      label: (
        <Space>
          <DiffFilled />
          Records
        </Space>
      ),
      key: 'records',
      children: <Record />,
    },
    {
      label: (
        <Space>
          <DatabaseFilled />
          Servers
        </Space>
      ),
      key: 'servers',
      children: <ConfigServer />,
    },
    {
      label: (
        <Space>
          <NodeExpandOutlined />
          {TRANSLATE_KEY.traffic_flow}
        </Space>
      ),
      key: 'traffic-flow',
      children: <TrafficFlow isOpen={isOpen} onToggle={onToggle} />,
    },
  ];
  return (
    <Card>
      <Tabs
        defaultActiveKey={currentTab}
        items={tabs}
        type="card"
        size={size}
        onChange={(activeKey: string) => {
          navigate(
            ROUTE.CONFIG_DOMAIN.replace(':domainId', domainId)
              .replace(':domainName', domainName)
              .replace(
                ':merchantId',
                userInfo && isAdmin(userInfo.role)
                  ? merchantId
                  : userInfo?.merchantId ?? '',
              )
              .replace(':currentTab', activeKey),
          );
        }}
        // tabBarExtraContent={
        //   currentTab !== 'traffic-flow' && (
        //     <Button
        //       type="success"
        //       disabled={isUser(userInfo?.role)}
        //       icon={<PlusCircleOutlined />}
        //       onClick={onToggle}
        //     >
        //       {`${TRANSLATE_KEY.create} ${
        //         // eslint-disable-next-line no-nested-ternary
        //         currentTab === 'records'
        //           ? 'record'
        //           : currentTab === 'servers'
        //           ? 'server'
        //           : 'traffic flow'
        //       }`}
        //     </Button>
        //   )
        // }
      >
        {/* {tabs.map((tab) => {
          return (
            <Tabs.TabPane tab={tab.tabName} key={tab.key}>
              {tab.children}
            </Tabs.TabPane>
          );
        })} */}
      </Tabs>
    </Card>
  );
}

export default ConfigDomain;
