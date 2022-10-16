import React, { useEffect, useState } from 'react';
import { Card, Col, Modal, Row, Space, Table, Typography } from 'antd';
import { deleteDomain, getListDomain } from 'src/apis/domain';
import { IDomain } from 'src/@types/entities/Domain';
import usePagination from 'src/hooks/usePagination';
import TRANSLATE_KEY from 'src/languages/locales/translateKey';
import {
  DeleteFilled,
  QuestionCircleOutlined,
  SettingFilled,
  SyncOutlined,
} from '@ant-design/icons';
import Button from 'antd-button-color';
import capitalizeFirstLetter from 'src/utils/capitalizeFirstLetter';
import useMaxHeight from 'src/hooks/useMaxHeight';
import { openNotificationWithIcon } from 'src/components/AppNotification';
import { useNavigate } from 'react-router-dom';
import ROUTE from 'src/constants/route';
import useGetMerchants from 'src/hooks/useGetMerchants';
import { useAppSelector } from 'src/redux';
import { checkStatePending, isAdmin, isUser } from 'src/helpers';
import clsx from 'clsx';
import DOMAIN_TYPE from 'src/constants/domainType';
import DOMAIN_SOA_EDIT_API from 'src/constants/domainSoaEditApi';
import STATE from 'src/constants/state';
import { RREventType } from 'src/@types/entities/socket';
import AppTooltip from 'src/components/AppTooltip';
import AppTag from 'src/components/AppTag';
import DomainForm from './form';
import Filter from './filter';

const { confirm } = Modal;
const Domain = function Domain() {
  const initData: IDomain[] = [];
  const userInfo = useAppSelector((s) => s.auth.user);
  const merchants = useGetMerchants();
  const navigate = useNavigate();
  const [isOpenForm, setIsOpenForm] = useState(false);
  const maxHeight = useMaxHeight();
  const message = useAppSelector((s) => s.socket.message);

  const {
    data,
    currentPage,
    total,
    offset,
    onPaginationChange,
    loading,
    pageSize,
    updateData,
  } = usePagination(initData, getListDomain);
  useEffect(() => {
    if (message?.event === RREventType.CreateOk) {
      openNotificationWithIcon('success', message?.event, message.msg);
      const newData = [...data];
      newData.unshift(message.data as IDomain);
      updateData(newData, total + 1);
    }
    if (message?.event === RREventType.DeleteOk) {
      openNotificationWithIcon(
        'success',
        'Notification',
        `${TRANSLATE_KEY.request_is_being_processed}`,
      );
      const newData = [...data];
      const domainResponse = message.data as IDomain;
      const index = newData.findIndex(
        (item) => item.domainName === domainResponse.domainName,
      );
      if (index !== -1) {
        newData.splice(index, 1);
        updateData(newData, total);
      }
    }
    if (
      message?.event === RREventType.CreateFail ||
      message?.event === RREventType.DeleteFail
    ) {
      const domainResponse = message.data as IDomain;
      const newData = [...data];
      const index = newData.findIndex(
        (item) => item.domainName === domainResponse.domainName,
      );
      if (index !== -1) {
        newData[index] = domainResponse;
        updateData(newData, total);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateData]);
  const handleCloseForm = () => {
    setIsOpenForm(false);
  };
  const showConfirmDelete = async (record: IDomain) => {
    confirm({
      title: capitalizeFirstLetter(
        `${TRANSLATE_KEY.confirm} ${TRANSLATE_KEY.remove}?`,
      ),
      icon: <QuestionCircleOutlined />,
      content: (
        <Typography.Text>
          {`${TRANSLATE_KEY.do_you_want_to_remove}: `}
          <Typography.Text strong>{`${record.domainName}?`}</Typography.Text>
        </Typography.Text>
      ),
      okText: TRANSLATE_KEY.remove,
      transitionName: 'ant-zoom-up',
      maskTransitionName: 'ant-fade',
      centered: true,
      onOk: async () => {
        const response = await deleteDomain({ domainId: record.id });
        if (response) {
          const item = response.data;
          const newData = [...data];
          newData[newData.indexOf(record)] = item;
          updateData(newData, total);
          openNotificationWithIcon(
            'success',
            'Notification',
            `${TRANSLATE_KEY.request_is_being_processed}`,
          );
        }
      },
    });
  };
  const columns = [
    {
      title: 'Index',
      key: 'index',
      align: 'center' as const,
      width: 70,
      render: (value: IDomain, item: IDomain, index: number) => {
        return offset + index + 1;
      },
      fixed: 'left' as const,
    },
    {
      title: TRANSLATE_KEY.domain_name,
      dataIndex: 'domainName',
      key: 'domainName',
      width: 200,
      showSorterTooltip: false,
      sorter: (a: IDomain, b: IDomain) =>
        a.domainName.length - b.domainName.length,
      render: (name: string, record: IDomain) => {
        if (!checkStatePending(record.state)) {
          return (
            <AppTooltip title={TRANSLATE_KEY.clickToConfig} color="primary">
              <Typography.Text
                ellipsis
                className="text-action"
                onClick={() => {
                  navigate(
                    ROUTE.CONFIG_DOMAIN.replace(
                      ':domainId',
                      record.id.toString(),
                    )
                      .replace(':domainName', record.domainName)
                      .replace(
                        ':merchantId',
                        userInfo && isAdmin(userInfo.role)
                          ? record.merchantId
                          : userInfo?.merchantId ?? '',
                      )
                      .replace(':currentTab', 'records'),
                  );
                }}
              >
                {name}
              </Typography.Text>
            </AppTooltip>
          );
        }
        return name;
      },
    },
    {
      title: TRANSLATE_KEY.state,
      dataIndex: 'state',
      key: 'state',
      width: 100,
      align: 'center' as const,
      render: (state: STATE) => {
        if (checkStatePending(state)) {
          return (
            <Space className={clsx(state ?? 'loading')}>
              <SyncOutlined spin />
              {state ? capitalizeFirstLetter(state) : TRANSLATE_KEY.loading}
            </Space>
          );
        }
        return <AppTag color={state}>{capitalizeFirstLetter(state)}</AppTag>;
      },
    },
    {
      title: TRANSLATE_KEY.merchant,
      dataIndex: 'merchantId',
      key: 'merchantId',
      width: 200,
      align: 'left' as const,
      showSorterTooltip: false,
      sorter: (a: IDomain, b: IDomain) =>
        a.merchantId.length - b.merchantId.length,
      render: (merchantId: string) => {
        return (
          <Typography.Paragraph ellipsis={{ rows: 2, tooltip: merchantId }}>
            {merchantId}
          </Typography.Paragraph>
        );
      },
    },
    {
      title: TRANSLATE_KEY.type,
      dataIndex: 'type',
      key: 'type',
      width: 80,
      align: 'center' as const,
      render: (type: DOMAIN_TYPE) => {
        return <AppTag color={type}>{capitalizeFirstLetter(type)}</AppTag>;
      },
    },
    {
      title: TRANSLATE_KEY.soaEditAPI,
      dataIndex: 'soaEditApi',
      key: 'soaEditApi',
      width: 130,
      align: 'center' as const,
      render: (soaEditApi: DOMAIN_SOA_EDIT_API) => {
        return soaEditApi && capitalizeFirstLetter(soaEditApi);
      },
    },
    {
      title: TRANSLATE_KEY.records,
      dataIndex: 'records',
      key: 'records',
      width: 100,
      align: 'center' as const,
      showSorterTooltip: false,
      sorter: (a: IDomain, b: IDomain) => a.records.length - b.records.length,
      render: (records: string[]) => (records ? records.length : 0),
    },
    {
      title: TRANSLATE_KEY.servers,
      dataIndex: 'servers',
      key: 'servers',
      width: 100,
      align: 'center' as const,
      showSorterTooltip: false,
      sorter: (a: IDomain, b: IDomain) => a.servers.length - b.servers.length,
      render: (servers: string[]) => (servers ? servers.length : 0),
    },
    {
      title: TRANSLATE_KEY.actions,
      key: 'actions',
      align: 'center' as const,
      width: 100,
      fixed: 'right' as const,
      render: (_: any, record: IDomain) => (
        <Space size="middle">
          <AppTooltip title={TRANSLATE_KEY.clickToConfig}>
            <Button
              disabled={checkStatePending(record.state)}
              type="primary"
              icon={<SettingFilled />}
              with="link"
              size="middle"
              onClick={() => {
                navigate(
                  ROUTE.CONFIG_DOMAIN.replace(':domainId', record.id.toString())
                    .replace(':domainName', record.domainName)
                    .replace(
                      ':merchantId',
                      userInfo && isAdmin(userInfo.role)
                        ? record.merchantId
                        : userInfo?.merchantId ?? '',
                    )
                    .replace(':currentTab', 'records'),
                );
              }}
            />
          </AppTooltip>
          <AppTooltip
            title={TRANSLATE_KEY.click_to_remove}
            color="error"
            placement="left"
          >
            <Button
              disabled={
                isUser(userInfo?.role) || checkStatePending(record.state)
              }
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
      <Row gutter={[24, 12]}>
        <Col xs={24} id="app-filter">
          <Card bordered size="small">
            <Filter
              merchants={merchants}
              onCreate={() => {
                setIsOpenForm(true);
              }}
            />
          </Card>
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
      <DomainForm
        merchants={merchants}
        isOpen={isOpenForm}
        onClose={handleCloseForm}
        updateData={updateData}
        total={total}
        data={data}
      />
    </>
  );
};

export default Domain;
