import React from 'react';
import { Space, Tag, Typography } from 'antd';
import './index.less';

const ChartTooltip = function ChartTooltip(props: any) {
  const { active, payload, label } = props;
  if (active && payload && payload.length > 0) {
    return (
      <Space direction="vertical" className="chart-tooltip">
        <Space>
          <Tag>Time</Tag>
          <Typography.Text strong>{label}</Typography.Text>
        </Space>
        <Space>
          <Tag>Value</Tag>
          <Typography.Text strong>
            {payload[0].value.toFixed(2)}%
          </Typography.Text>
        </Space>
      </Space>
    );
  }

  return null;
};
export default ChartTooltip;
