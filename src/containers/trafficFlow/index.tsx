/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { Col, Row, Space, Table, Tag, Tooltip, Typography } from 'antd';
import Button from 'antd-button-color';
import useMaxHeight from 'src/hooks/useMaxHeight';
import TRANSLATE_KEY from 'src/languages/locales/translateKey';
import { useParams } from 'react-router';
import { RDQGetListTrafficFlow } from 'src/@types/apis/RequestData';
import usePagination from 'src/hooks/usePagination';
import { useAppSelector } from 'src/redux';
import { isUser } from 'src/helpers';
import { ITrafficFlow } from 'src/@types/entities/TrafficFlow';
import { getListTrafficFlowByDomain } from 'src/apis/trafficFlow';
import { trafficFlowValueMap } from 'src/utils/define';
import clsx from 'clsx';
import AppTooltip from 'src/components/AppTooltip';
import TrafficFlowForm from './form';
import Filter from './filter';
import './index.less';

const prefixCls = 'app-traffic-flow';

const TrafficFlow = function TrafficFlow({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  const { domainName = '', currentTab = '' } = useParams();
  const initData: ITrafficFlow[] = [];
  const userInfo = useAppSelector((s) => s.auth.user);
  const maxHeight = useMaxHeight();
  const [trafficFlowSelected, setTrafficFlowSelected] =
    useState<ITrafficFlow>();
  const handleCloseForm = () => {
    // setIsOpenForm(false);
    setTrafficFlowSelected(undefined);
    onToggle();
  };
  const apiConfig = (params: RDQGetListTrafficFlow) => {
    return getListTrafficFlowByDomain({ domainName }, params);
  };

  const {
    data,
    currentPage,
    total,
    offset,
    onPaginationChange,
    loading,
    pageSize,
    updateData,
  } = usePagination(initData, apiConfig, currentTab !== 'traffic-flow');

  const columns = [
    {
      title: 'Index',
      key: 'index',
      align: 'center' as const,
      width: 70,
      render: (value: ITrafficFlow, item: ITrafficFlow, index: number) => {
        return offset + index + 1;
      },
      fixed: 'left' as const,
    },
    {
      title: TRANSLATE_KEY.record_type,
      dataIndex: 'recordType',
      key: 'recordType',
      width: 200,
      render: (recordType: string, record: ITrafficFlow) => {
        if (!isUser(userInfo?.role)) {
          return (
            <AppTooltip title={TRANSLATE_KEY.clickToEdit} color="primary">
              <Typography.Text
                ellipsis
                className="text-action"
                onClick={() => {
                  setTrafficFlowSelected(record);
                  onToggle();
                }}
              >
                {recordType}
              </Typography.Text>
            </AppTooltip>
          );
        }
        return recordType;
      },
    },
    {
      title: TRANSLATE_KEY.values,
      dataIndex: 'value',
      key: 'values',
      width: 200,
      render: (value: (keyof typeof trafficFlowValueMap)[]) => {
        if (value.length > 0) {
          return (
            <Space size={[8, 16]} wrap>
              {value.map((item) => {
                return (
                  <Tag className={clsx('app-tag', item)}>
                    {trafficFlowValueMap[item]}
                  </Tag>
                );
              })}
            </Space>
          );
        }
        return value;
      },
    },
    {
      title: TRANSLATE_KEY.action,
      key: 'action',
      align: 'center' as const,
      width: 100,
      fixed: 'right' as const,
      render: (_: any, record: ITrafficFlow) => (
        <Space size="middle">
          <AppTooltip title={TRANSLATE_KEY.clickToEdit}>
            <Button
              disabled={isUser(userInfo?.role)}
              type="primary"
              icon={<EditFilled />}
              with="link"
              size="middle"
              onClick={() => {
                setTrafficFlowSelected(record);
                onToggle();
              }}
            />
          </AppTooltip>
          <AppTooltip
            title={TRANSLATE_KEY.click_to_remove}
            color="error"
            placement="left"
          >
            <Button
              //   disabled={isUser(userInfo?.role)}
              disabled
              type="danger"
              icon={<DeleteFilled />}
              with="link"
              size="middle"
              //   onClick={() => {
              //     showConfirmDelete(record);
              //   }}
            />
          </AppTooltip>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Row gutter={[0, 8]} className={prefixCls}>
        <Col xs={24} id="app-filter" flex="auto">
          {/* <Filter /> */}
        </Col>
        <Col xs={24}>
          <Table
            dataSource={data}
            columns={columns}
            loading={loading}
            rowKey="id"
            scroll={{
              scrollToFirstRowOnChange: true,
              x: '100%',
              y: maxHeight,
            }}
            pagination={{
              pageSize,
              current: currentPage,
              total,
              onChange: (page: number) => {
                onPaginationChange(page);
              },
              showSizeChanger: false,
              showQuickJumper: true,
            }}
          />
        </Col>
      </Row>
      <TrafficFlowForm
        isOpen={isOpen && currentTab === 'traffic-flow'}
        trafficFlowSelected={trafficFlowSelected}
        onClose={handleCloseForm}
        updateData={updateData}
        total={total}
        data={data}
      />
    </>
  );
};
export default TrafficFlow;
