/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import {
  Card,
  Col,
  DatePicker,
  DatePickerProps,
  Divider,
  Empty,
  Form,
  Row,
  Space,
  Spin,
  Typography,
} from 'antd';
import { IDataChart, IMetricsDetailForm } from 'src/@types/entities/Metrics';
import { getMetricsDetail } from 'src/apis/metrics';
import useSearchParams from 'src/hooks/useSearchParams';
import { useAppSelector } from 'src/redux';
import { isAdmin } from 'src/helpers';
import TRANSLATE_KEY from 'src/languages/locales/translateKey';
import moment from 'moment';
import {
  AreaChart,
  Tooltip,
  CartesianGrid,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';
import ChartTooltip from 'src/components/ChartTooltip';
import './index.less';
import { RangePickerProps } from 'antd/lib/date-picker';

const { RangePicker } = DatePicker;
const prefixCls = 'metrics-detail';
const MetricsDetail = function MetricsDetail({
  merchantId,
  serverIp,
}: {
  merchantId: string;
  serverIp: string;
}) {
  const userInfo = useAppSelector((s) => s.auth.user);
  const { getAllParams, addParams, removeParam } = useSearchParams();
  const params = getAllParams<IMetricsDetailForm>({
    merchantId: undefined,
    domainId: undefined,
    serverIp: undefined,
    startTime: undefined,
    endTime: undefined,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<IDataChart>();
  const [startTime, setStartTime] = useState(
    params.startTime
      ? moment(params.startTime)
      : moment().subtract(1, 'day').startOf('day'),
  );

  const [endTime, setEndTime] = useState(
    params.endTime ? moment(params.endTime) : moment(),
  );
  useEffect(() => {
    setStartTime(
      params.startTime
        ? moment(params.startTime)
        : moment().subtract(1, 'day').startOf('day'),
    );
    setEndTime(params.endTime ? moment(params.endTime) : moment());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);
  const range = (start: number, end: number) => {
    const result = [];
    // eslint-disable-next-line no-plusplus
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };
  useEffect(() => {
    const getMetricsDetailData = async () => {
      setLoading(true);
      const response = await getMetricsDetail(
        { merchantId },
        {
          serverIp,
          startTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
          endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
        },
      );
      if (response && response.data && response.data.metrics.length > 0) {
        const temp = response.data.metrics;
        const convertData: IDataChart = {
          step: response.data.step,
          cpu: [],
          ram: [],
          diskSpaceUsage: [],
          networkReceived: [],
          networkTransmitted: [],
        };
        temp.forEach((item) => {
          if (item?.data?.cpu) {
            convertData.cpu.push({
              key: moment.unix(item.timestamp).format('YYYY:MM:DD HH:mm:ss'),
              value: (1 - (item.data?.cpu ?? 0)) * 100,
            });
          }
          if (item?.data?.ram) {
            convertData.ram.push({
              key: moment.unix(item.timestamp).format('YYYY:MM:DD HH:mm:ss'),
              value: (1 - (item.data?.ram ?? 0)) * 100,
            });
          }
          if (item?.data?.diskSpaceUsage) {
            convertData.diskSpaceUsage.push({
              key: moment.unix(item.timestamp).format('YYYY:MM:DD HH:mm:ss'),
              value: (1 - (item.data?.diskSpaceUsage ?? 0)) * 100,
            });
          }
        });
        setMetrics({ ...convertData });
      } else {
        setMetrics({
          step: 0,
          cpu: [],
          ram: [],
          diskSpaceUsage: [],
          networkReceived: [],
          networkTransmitted: [],
        });
      }
      setLoading(false);
    };
    getMetricsDetailData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  return (
    <Card bordered size="small" className={prefixCls}>
      <Row align="middle" gutter={24}>
        <Col>
          <Typography.Title level={5} style={{ margin: 0 }}>
            {`${TRANSLATE_KEY.detail}: ${TRANSLATE_KEY.cpu} / ${TRANSLATE_KEY.ram} / ${TRANSLATE_KEY.disk}`}
          </Typography.Title>
        </Col>
        <Col flex="auto">
          <Divider />
        </Col>
        <Col>
          <Space>
            <Form.Item
              className="form-item"
              style={{ marginBottom: 0 }}
              label={
                <Typography.Text strong>
                  {TRANSLATE_KEY.startTime}
                </Typography.Text>
              }
            >
              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                getPopupContainer={(trigger) =>
                  trigger.parentNode! as HTMLElement
                }
                disabledDate={(current) => {
                  return current && current > endTime;
                }}
                disabledTime={(current) => {
                  if (
                    current &&
                    current.format('YYYY-MM-DD') ===
                      endTime.format('YYYY-MM-DD')
                  ) {
                    return {
                      disabledHours: () => range(endTime.hours(), 24),
                      disabledMinutes: () => range(endTime.minute(), 60),
                      disabledSeconds: () => range(endTime.second(), 60),
                    };
                  }
                  return {
                    disabledHours: () => [],
                    disabledMinutes: () => [],
                    disabledSeconds: () => [],
                  };
                }}
                placeholder={TRANSLATE_KEY.startTime}
                value={startTime}
                showTime={{
                  defaultValue: params.startTime
                    ? moment(params.startTime)
                    : moment().subtract(1, 'day').startOf('day'),
                }}
                onChange={(
                  value: DatePickerProps['value'] | RangePickerProps['value'],
                  dateString: string,
                ) => {
                  // setStartTime(moment(dateString));

                  removeParam('startTime');
                  addParams({
                    startTime: dateString,
                  });
                }}
              />
            </Form.Item>
            <Form.Item
              className="form-item"
              style={{ marginBottom: 0 }}
              label={
                <Typography.Text strong>
                  {TRANSLATE_KEY.endTime}
                </Typography.Text>
              }
            >
              <DatePicker
                getPopupContainer={(trigger) =>
                  trigger.parentNode! as HTMLElement
                }
                placeholder={TRANSLATE_KEY.endTime}
                disabledDate={(current) => {
                  const customDate = params.endTime
                    ? moment(params.endTime)
                    : moment();
                  return (
                    current && (current > customDate || current < startTime)
                  );
                }}
                disabledTime={(current) => {
                  if (
                    current &&
                    current.format('YYYY-MM-DD') ===
                      moment().format('YYYY-MM-DD')
                  ) {
                    return {
                      disabledHours: () => range(endTime.hours(), 24),
                      disabledMinutes: () => range(endTime.minute(), 60),
                      disabledSeconds: () => range(endTime.second(), 60),
                    };
                  }
                  if (
                    current &&
                    current.format('YYYY-MM-DD') ===
                      startTime.format('YYYY-MM-DD')
                  ) {
                    return {
                      disabledHours: () => range(0, startTime.hours()),
                      disabledMinutes: (hours: number) => {
                        if (hours === startTime.hours()) {
                          return range(0, 60).slice(0, startTime.minutes());
                        }
                        return [];
                      },
                      disabledSeconds: (hours: number, minutes: number) => {
                        if (
                          hours === startTime.hours() &&
                          minutes === startTime.minutes()
                        ) {
                          return range(0, 60).slice(0, startTime.second() + 1);
                        }
                        return [];
                      },
                    };
                  }
                  range(0, startTime.minute());
                  return {
                    disabledHours: () => [],
                    disabledMinutes: () => [],
                    disabledSeconds: () => [],
                  };
                }}
                value={endTime}
                showTime={{
                  defaultValue: params.endTime
                    ? moment(params.endTime)
                    : moment(),
                }}
                onChange={(
                  value: DatePickerProps['value'] | RangePickerProps['value'],
                  dateString: string,
                ) => {
                  console.log(dateString);
                  removeParam('endTime');
                  addParams({
                    endTime: dateString,
                  });
                }}
              />
            </Form.Item>
          </Space>
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <Spin size="large" spinning={loading}>
            <Card
              size="small"
              title={TRANSLATE_KEY.cpu}
              className="metrics-card"
            >
              {metrics?.cpu && metrics?.cpu.length > 0 ? (
                <ResponsiveContainer width="100%" minHeight={300}>
                  <AreaChart
                    data={metrics.cpu}
                    margin={{
                      top: 32,
                      right: 16,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <defs>
                      <linearGradient
                        id="colorValue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#2196f3"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#2196f3"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="key"
                      stroke="#212121"
                      // tickLine={false}
                      // axisLine={false}
                    />
                    <YAxis
                      dataKey="value"
                      stroke="#212121"
                      // tickLine={false}
                      // axisLine={false}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#2196f3"
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <Empty />
              )}
            </Card>
          </Spin>
        </Col>
        <Col xs={24}>
          <Spin size="large" spinning={loading}>
            <Card
              size="small"
              title={TRANSLATE_KEY.ram}
              className="metrics-card"
            >
              {metrics?.ram && metrics?.ram.length > 0 ? (
                <ResponsiveContainer width="100%" minHeight={300}>
                  <AreaChart
                    data={metrics.ram}
                    margin={{
                      top: 32,
                      right: 16,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <defs>
                      <linearGradient
                        id="colorValue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#2196f3"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#2196f3"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="key"
                      stroke="#212121"
                      // tickLine={false}
                      // axisLine={false}
                    />
                    <YAxis
                      dataKey="value"
                      stroke="#212121"
                      // tickLine={false}
                      // axisLine={false}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#2196f3"
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <Empty />
              )}
            </Card>
          </Spin>
        </Col>
        <Col xs={24}>
          <Spin size="large" spinning={loading}>
            <Card
              size="small"
              title={TRANSLATE_KEY.disk_space_usage}
              className="metrics-card"
            >
              {metrics?.diskSpaceUsage && metrics?.diskSpaceUsage.length > 0 ? (
                <ResponsiveContainer width="100%" minHeight={300}>
                  <AreaChart
                    data={metrics.diskSpaceUsage}
                    margin={{
                      top: 32,
                      right: 16,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <defs>
                      <linearGradient
                        id="colorValue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#2196f3"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#2196f3"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="key"
                      stroke="#212121"
                      // tickLine={false}
                      // axisLine={false}
                    />
                    <YAxis
                      dataKey="value"
                      stroke="#212121"
                      // tickLine={false}
                      // axisLine={false}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#2196f3"
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <Empty />
              )}
            </Card>
          </Spin>
        </Col>
      </Row>
    </Card>
  );
};

export default MetricsDetail;
