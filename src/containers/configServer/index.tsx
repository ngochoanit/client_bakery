/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import {
  DeleteFilled,
  EditFilled,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Col, Modal, Row, Space, Table, Tooltip, Typography } from 'antd';
import Button from 'antd-button-color';
import useMaxHeight from 'src/hooks/useMaxHeight';
import TRANSLATE_KEY from 'src/languages/locales/translateKey';
import capitalizeFirstLetter from 'src/utils/capitalizeFirstLetter';
import { openNotificationWithIcon } from 'src/components/AppNotification';
import { useParams } from 'react-router';
import { RDQGetListServersByDomain } from 'src/@types/apis/RequestData';
import usePagination from 'src/hooks/usePagination';
// import RecordForm from './form';
import { IServer } from 'src/@types/entities/Server';
import { deleteServer, getListServersByDomain } from 'src/apis/server';
import { citiesMap, countriesMap, ispMap } from 'src/utils/define';
import { useAppSelector } from 'src/redux';
import { isUser } from 'src/helpers';
import AppTooltip from 'src/components/AppTooltip';
import Filter from './filter';
import ServerForm from './form';
import './index.less';

const { confirm } = Modal;
const prefixCls = 'app-server';
const ConfigServer = function ConfigServer() {
  const { domainId = '', currentTab = '' } = useParams();
  const initData: IServer[] = [];
  const userInfo = useAppSelector((s) => s.auth.user);
  const maxHeight = useMaxHeight(['app-header', 'app-footer'], 342);
  const [serverSelected, setServerSelected] = useState<IServer>();
  const [isOpenForm, setIsOpenForm] = useState(false);
  const apiConfig = (params: RDQGetListServersByDomain) => {
    return getListServersByDomain({ domainId }, params);
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
  } = usePagination(initData, apiConfig, currentTab !== 'servers');

  const showConfirmDelete = async (value: IServer) => {
    confirm({
      title: capitalizeFirstLetter(
        `${TRANSLATE_KEY.confirm} ${TRANSLATE_KEY.remove}?`,
      ),
      icon: <QuestionCircleOutlined />,
      content: (
        <Typography.Text>
          {`${TRANSLATE_KEY.do_you_want_to_remove}: `}
          <Typography.Text strong>{`${value?.publicIp}?`}</Typography.Text>
        </Typography.Text>
      ),
      okText: TRANSLATE_KEY.remove,
      transitionName: 'ant-zoom-up',
      maskTransitionName: 'ant-fade',
      centered: true,
      onOk: async () => {
        const response = await deleteServer({
          domainId,
          serverId: value?.id,
        });
        if (response) {
          const newData = [...data];
          newData.splice(newData.indexOf(value), 1);
          updateData(newData, total - 1);
          openNotificationWithIcon(
            'success',
            TRANSLATE_KEY.notification,
            TRANSLATE_KEY.removedSuccessfully,
          );
        }
      },
    });
  };
  const handleCloseForm = () => {
    setIsOpenForm(false);
    setServerSelected(undefined);
    // onToggle();
  };
  const columns = [
    {
      title: 'Index',
      key: 'index',
      align: 'center' as const,
      width: 70,
      render: (value: IServer, item: IServer, index: number) => {
        return offset + index + 1;
      },
      fixed: 'left' as const,
    },
    {
      title: TRANSLATE_KEY.public_ip,
      dataIndex: 'publicIp',
      key: 'publicIp',
      width: 150,
      render: (text: string, record: IServer) => {
        if (!isUser(userInfo?.role)) {
          return (
            <AppTooltip title={TRANSLATE_KEY.clickToEdit} color="primary">
              <Typography.Text
                ellipsis
                className="text-action"
                onClick={() => {
                  setServerSelected(record);
                  setIsOpenForm(true);
                }}
              >
                {text}
              </Typography.Text>
            </AppTooltip>
          );
        }
        return text;
      },
    },
    {
      title: TRANSLATE_KEY.private_ip,
      dataIndex: 'privateIp',
      key: 'privateIp',
      width: 150,
      render: (text: string) => text,
    },
    {
      title: TRANSLATE_KEY.country,
      dataIndex: 'country',
      key: 'country',
      width: 150,
      showSorterTooltip: false,
      sorter: (a: IServer, b: IServer) =>
        (a.country ? countriesMap[a.country].length : 0) -
        (b.country ? countriesMap[b.country].length : 0),
      render: (text: keyof typeof countriesMap) => {
        return (
          <Typography.Paragraph
            ellipsis={{
              rows: 2,
              tooltip: countriesMap[text] || TRANSLATE_KEY.any,
            }}
          >
            {countriesMap[text] || TRANSLATE_KEY.any}
          </Typography.Paragraph>
        );
      },
    },
    {
      title: TRANSLATE_KEY.region,
      dataIndex: 'region',
      key: 'region',
      width: 150,
      showSorterTooltip: false,
      sorter: (a: IServer, b: IServer) =>
        (a.region ? citiesMap[a.region].length : 0) -
        (b.region ? citiesMap[b.region].length : 0),
      render: (text: keyof typeof citiesMap) => {
        return (
          <Typography.Paragraph
            ellipsis={{
              rows: 2,
              tooltip: citiesMap[text] || TRANSLATE_KEY.any,
            }}
          >
            {citiesMap[text] || TRANSLATE_KEY.any}
          </Typography.Paragraph>
        );
      },
    },
    {
      title: TRANSLATE_KEY.isp,
      dataIndex: 'isp',
      key: 'isp',
      width: 150,
      showSorterTooltip: false,
      sorter: (a: IServer, b: IServer) =>
        (a.isp ? ispMap[a.isp].length : 0) - (b.isp ? ispMap[b.isp].length : 0),
      render: (text: keyof typeof ispMap) => {
        return (
          <Typography.Paragraph
            ellipsis={{
              rows: 2,
              tooltip: ispMap[text] || TRANSLATE_KEY.any,
            }}
          >
            {ispMap[text] || TRANSLATE_KEY.any}
          </Typography.Paragraph>
        );
      },
    },
    {
      title: TRANSLATE_KEY.actions,
      key: 'action',
      align: 'center' as const,
      width: 100,
      fixed: 'right' as const,
      render: (_: any, record: IServer) => (
        <Space size="middle">
          <AppTooltip title={TRANSLATE_KEY.clickToEdit}>
            <Button
              disabled={isUser(userInfo?.role)}
              type="primary"
              icon={<EditFilled />}
              with="link"
              size="middle"
              onClick={() => {
                setServerSelected(record);
                setIsOpenForm(true);
              }}
            />
          </AppTooltip>
          <AppTooltip
            title={TRANSLATE_KEY.click_to_remove}
            color="error"
            placement="left"
          >
            <Button
              disabled={isUser(userInfo?.role)}
              type="danger"
              icon={<DeleteFilled />}
              with="link"
              size="middle"
              onClick={() => {
                showConfirmDelete(record);
              }}
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
          <Filter
            onCreate={() => {
              setIsOpenForm(true);
            }}
          />
        </Col>
        <Col xs={24}>
          <Table
            dataSource={data}
            columns={columns}
            loading={loading}
            rowKey="id"
            scroll={{ scrollToFirstRowOnChange: true, x: '100%', y: maxHeight }}
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
      <ServerForm
        isOpen={isOpenForm}
        serverSelected={serverSelected}
        onClose={handleCloseForm}
        updateData={updateData}
        total={total}
        data={data}
      />
    </>
  );
};
export default ConfigServer;
