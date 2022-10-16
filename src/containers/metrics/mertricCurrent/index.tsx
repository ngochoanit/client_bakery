/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  Col,
  Divider,
  Empty,
  Menu,
  Progress,
  Row,
  Space,
  Typography,
} from 'antd';
import { IMetrics } from 'src/@types/entities/Metrics';
import { getMetricsCurrent } from 'src/apis/metrics';

import TRANSLATE_KEY from 'src/languages/locales/translateKey';
import { refreshMetrics } from 'src/utils/define';
import { SettingOutlined } from '@ant-design/icons';
import AppButtonDropdown from 'src/components/AppButtonDropdown';
import './index.less';

const fields = [
  {
    type: 'cpu',
    nameProperty: 'cpu',
  },
  {
    type: 'ram',
    nameProperty: 'ram',
  },
  {
    type: 'disk',
    nameProperty: 'diskSpaceUsage',
  },
  // {
  //   type: 'network_received',
  //   nameProperty: 'networkReceived',
  // },
  // {
  //   type: 'network_transmitted',
  //   nameProperty: 'networkTransmitted',
  // },
];
const generateColors = (percent: number | undefined) => {
  if (percent === undefined) {
    return '#e0e0e0';
  }
  if ((1 - percent) * 100 > 80) return '#f44336';
  if ((1 - percent) * 100 > 60) return '#ff9800';
  return '#4caf50';
};
const MetricsCurrentItem = function MetricsCurrentItem({
  type,
  data,
}: {
  type: string;
  data?: number;
}) {
  return (
    <div className="metrics-item">
      <Space className="metrics-item-title">
        <Typography.Title level={5}>
          {TRANSLATE_KEY[type as keyof typeof TRANSLATE_KEY]}
        </Typography.Title>
      </Space>
      <div className="metrics-item-body">
        <Progress
          strokeWidth={8}
          strokeColor={generateColors(data)}
          trailColor="#e0e0e0"
          type="dashboard"
          percent={(1 - (data ?? 0)) * 100}
          format={(percent: number | undefined) => {
            if (data === undefined) {
              return 'N/A';
            }
            if (percent === 100) {
              return 'MAX';
            }
            return `${percent?.toFixed(2)}%`;
          }}
        />
      </div>
    </div>
  );
};
const MetricsCurrent = function MetricsCurrent({
  merchantId,
  serverIp,
}: {
  merchantId: string;
  serverIp: string;
}) {
  const [metrics, setMetrics] = useState<IMetrics>();
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState(5000);
  const [counter, setCounter] = useState(5000 / 1000);
  const intervalCallId = useRef<NodeJS.Timer>();
  const intervalCounterId = useRef<NodeJS.Timer>();

  useEffect(() => {
    const getMetricsCurrentData = async () => {
      setLoading(true);
      const response = await getMetricsCurrent(
        { merchantId },
        {
          serverIp,
        },
      );
      if (response && response.data) {
        setMetrics({ ...response.data.data });
      } else {
        setMetrics(undefined);
      }
      setLoading(false);
    };

    intervalCallId.current = setInterval(
      (function getData() {
        getMetricsCurrentData();
        return getData;
      })(),
      refresh,
    );

    return () => {
      if (intervalCallId.current) {
        clearInterval(intervalCallId.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchantId, serverIp]);

  useEffect(() => {
    const handleCountDown = () => {
      if (counter === 1) {
        setCounter(refresh / 1000);
      } else {
        setCounter(counter - 1);
      }
    };
    intervalCounterId.current = setInterval(
      (function countDown() {
        return handleCountDown;
      })(),
      1000,
    );

    return () => {
      if (intervalCounterId.current) {
        clearInterval(intervalCounterId.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchantId, serverIp, refresh, counter]);

  const menu = (
    <Menu
      onClick={({ key }) => {
        setRefresh(Number(key));
        setCounter(Number(key) / 1000);
      }}
      items={Object.entries(refreshMetrics).map(([key, value]) => {
        return { key, label: value };
      })}
    />
  );
  return (
    <Card bordered size="small">
      <Row align="middle" gutter={24}>
        <Col>
          <Typography.Title level={5} style={{ margin: 0 }}>
            {`${TRANSLATE_KEY.quick}: ${TRANSLATE_KEY.cpu} / ${TRANSLATE_KEY.ram} / ${TRANSLATE_KEY.disk}`}
          </Typography.Title>
        </Col>
        <Col flex="auto">
          <Divider />
        </Col>
        <Col>
          <Space>
            <Typography.Text strong>
              {`${TRANSLATE_KEY.counterRefresh}: ${counter}s`}
            </Typography.Text>
            <AppButtonDropdown
              overlay={menu}
              text={TRANSLATE_KEY.refresh}
              icon={<SettingOutlined className="app-icon-info icon" />}
            />
          </Space>
        </Col>
      </Row>
      {metrics ? (
        <div className="metrics">
          {fields.map((item, index) => {
            if (metrics) {
              // eslint-disable-next-line no-prototype-builtins
              if (metrics.hasOwnProperty(item.nameProperty)) {
                return (
                  <MetricsCurrentItem
                    key={index}
                    type={item.type}
                    data={
                      metrics[`${item.nameProperty}` as keyof typeof metrics] ??
                      undefined
                    }
                  />
                );
              }
              return (
                <MetricsCurrentItem
                  type={item.type}
                  data={undefined}
                  key={index}
                />
              );
            }
            return (
              <MetricsCurrentItem
                type={item.type}
                data={undefined}
                key={index}
              />
            );
          })}
        </div>
      ) : (
        <Empty />
      )}
    </Card>
  );
};

export default MetricsCurrent;
