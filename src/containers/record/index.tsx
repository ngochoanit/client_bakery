import React, { useEffect, useState } from 'react';
import {
  DeleteFilled,
  EditFilled,
  QuestionCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Col, Modal, Row, Space, Table, Typography } from 'antd';
import Button from 'antd-button-color';
import { IRecord } from 'src/@types/entities/Record';
import { deleteRecord, getListRecordsByDomain } from 'src/apis/record';
import useMaxHeight from 'src/hooks/useMaxHeight';
import TRANSLATE_KEY from 'src/languages/locales/translateKey';
import capitalizeFirstLetter from 'src/utils/capitalizeFirstLetter';
import { openNotificationWithIcon } from 'src/components/AppNotification';
import { useParams } from 'react-router';
import { RDQGetListRecordsByDomain } from 'src/@types/apis/RequestData';
import usePagination from 'src/hooks/usePagination';
import { checkStatePending, isUser } from 'src/helpers';
import { useAppSelector } from 'src/redux';
import RECORD_TYPE from 'src/constants/recordType';
import STATUS from 'src/constants/status';
import clsx from 'clsx';
import STATE from 'src/constants/state';
import { getListServersByDomain } from 'src/apis/server';
import AppTooltip from 'src/components/AppTooltip';
import AppTag from 'src/components/AppTag';
import RecordForm from './form';
import Filter from './filter';
import './index.less';

const { confirm } = Modal;
const prefixCls = 'app-record';
const Record = function Record() {
  const { domainId = '', currentTab = '' } = useParams();
  const userInfo = useAppSelector((s) => s.auth.user);
  const initData: IRecord[] = [];
  const [recordSelected, setRecordSelected] = useState<IRecord>();
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [server, setServer] = useState<{ [key: number]: string }>();
  const maxHeight = useMaxHeight(['app-header', 'app-footer'], 342);

  const apiConfig = (params: RDQGetListRecordsByDomain) => {
    return getListRecordsByDomain({ domainId }, params);
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
  } = usePagination(initData, apiConfig, currentTab !== 'records');

  useEffect(() => {
    const getServers = async () => {
      if (currentTab === 'records') {
        const response = await getListServersByDomain(
          { domainId },
          { records: Number.MAX_SAFE_INTEGER },
        );
        if (response && response.data && response.data.length > 0) {
          const serversObj: { [key: string]: string } = {};
          response.data.forEach((item) => {
            serversObj[item.id] = item.publicIp;
          });
          setServer({ ...serversObj });
        }
      }
    };
    getServers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domainId, currentTab]);

  const showConfirmDelete = async (record: IRecord) => {
    confirm({
      title: capitalizeFirstLetter(
        `${TRANSLATE_KEY.confirm} ${TRANSLATE_KEY.remove}?`,
      ),
      icon: <QuestionCircleOutlined />,
      content: (
        <Typography.Text>
          {`${TRANSLATE_KEY.do_you_want_to_remove}: `}
          <Typography.Text strong>{`${record?.name}?`}</Typography.Text>
        </Typography.Text>
      ),
      okText: TRANSLATE_KEY.remove,
      transitionName: 'ant-zoom-up',
      maskTransitionName: 'ant-fade',
      centered: true,
      onOk: async () => {
        if (record) {
          const response = await deleteRecord({
            domainId,
            recordId: record.id,
          });
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
          return;
        }
        openNotificationWithIcon(
          'error',
          'Notification',
          capitalizeFirstLetter(
            `${TRANSLATE_KEY.record} ${TRANSLATE_KEY.not_selected_yet}`,
          ),
        );
      },
    });
  };
  const handleCloseForm = () => {
    // setIsOpenForm(false);
    setIsOpenForm(false);
    setRecordSelected(undefined);
  };

  const columns = [
    {
      title: 'Index',
      key: 'index',
      align: 'center' as const,
      width: 70,
      render: (value: IRecord, item: IRecord, index: number) => {
        return offset + index + 1;
      },
      fixed: 'left' as const,
    },
    {
      title: TRANSLATE_KEY.record_name,
      dataIndex: 'name',
      key: 'name',
      width: 200,
      showSorterTooltip: false,
      sorter: (a: IRecord, b: IRecord) => a.name.length - b.name.length,
      render: (name: string, record: IRecord) => {
        if (isUser(userInfo?.role) || checkStatePending(record.state))
          return name;
        return (
          <AppTooltip title={TRANSLATE_KEY.clickToEdit} color="primary">
            <Typography.Text
              ellipsis
              className="text-action"
              onClick={() => {
                setRecordSelected(record);
                setIsOpenForm(true);
              }}
            >
              {name}
            </Typography.Text>
          </AppTooltip>
        );
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
      title: TRANSLATE_KEY.type,
      dataIndex: 'type',
      key: 'type',
      width: 60,
      showSorterTooltip: false,
      sorter: (a: IRecord, b: IRecord) => a.type.length - b.type.length,
      render: (type: RECORD_TYPE) => type,
    },
    {
      title: TRANSLATE_KEY.ttl,
      dataIndex: 'ttl',
      key: 'ttl',
      width: 80,
      showSorterTooltip: false,
      sorter: (a: IRecord, b: IRecord) => a.ttl - b.ttl,
      render: (ttl: number) => ttl,
    },
    {
      title: TRANSLATE_KEY.content,
      dataIndex: 'content',
      key: 'content',
      width: 200,
      render: (content: string[] | number[], record: IRecord) => {
        if (Array.isArray(content)) {
          if (record.type === RECORD_TYPE.A) {
            return content.map((item) => {
              return (
                <AppTag
                  color="primary"
                  key={item}
                  // onClick={() => {
                  //   if (server && server[item as number]) {
                  //     navigator.clipboard.writeText(server[item as number]);
                  //     message.success(`${TRANSLATE_KEY.copied}`);
                  //   }
                  // }}
                >
                  {server ? server[item as number] : item}
                </AppTag>
              );
            });
          }
          return (
            <Typography.Paragraph ellipsis={{ rows: 2, tooltip: content[0] }}>
              {content[0]}
            </Typography.Paragraph>
          );
        }
        return (
          <Typography.Paragraph ellipsis={{ rows: 2, tooltip: content }}>
            {content}
          </Typography.Paragraph>
        );
      },
    },
    {
      title: TRANSLATE_KEY.status,
      dataIndex: 'status',
      key: 'status',
      width: 80,
      align: 'center' as const,
      showSorterTooltip: false,
      sorter: (a: IRecord, b: IRecord) => a.status.length - b.status.length,
      render: (status: STATUS) => {
        return <AppTag color={status}>{capitalizeFirstLetter(status)}</AppTag>;
      },
    },
    {
      title: TRANSLATE_KEY.actions,
      key: 'actions',
      align: 'center' as const,
      width: 100,
      fixed: 'right' as const,
      render: (_: any, record: IRecord) => (
        <Space size="middle">
          <AppTooltip title={TRANSLATE_KEY.clickToEdit}>
            <Button
              disabled={
                isUser(userInfo?.role) || checkStatePending(record.state)
              }
              type="primary"
              icon={<EditFilled />}
              with="link"
              size="middle"
              onClick={() => {
                setRecordSelected(record);
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
      <RecordForm
        isOpen={isOpenForm}
        server={server}
        recordSelected={recordSelected}
        onClose={handleCloseForm}
        updateData={updateData}
        total={total}
        data={data}
      />
    </>
  );
};
export default Record;
