import React, { useEffect, useState } from 'react';
import {
  DeleteFilled,
  EditFilled,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Card, Col, Modal, Row, Space, Table, Typography } from 'antd';
import { TUserInfo } from 'src/@types/entities/User';
import { deleteUser, getListUser } from 'src/apis/user';
import usePagination from 'src/hooks/usePagination';
import TRANSLATE_KEY from 'src/languages/locales/translateKey';
import Button from 'antd-button-color';
import capitalizeFirstLetter from 'src/utils/capitalizeFirstLetter';
import moment from 'moment';
import { useAppSelector } from 'src/redux';
import { openNotificationWithIcon } from 'src/components/AppNotification';
import useMaxHeight from 'src/hooks/useMaxHeight';
import { IMerchant } from 'src/@types/entities/Merchant';
import { isAdmin, isUser } from 'src/helpers';
import { getListMerchant } from 'src/apis/merchant';
import ROLE from 'src/constants/role';
import STATUS from 'src/constants/status';
import AppTooltip from 'src/components/AppTooltip';
import AppTag from 'src/components/AppTag';
import Filter from './filter';
import UserForm from './form';

const { confirm } = Modal;
const User = function User() {
  const initData: TUserInfo[] = [];
  const userInfo = useAppSelector((s) => s.auth.user);
  const [merchants, setMerchants] = useState<IMerchant[] | undefined>();
  const [userSelected, setUserSelected] = useState<TUserInfo>();
  const [isOpenForm, setIsOpenForm] = useState(false);
  const maxHeight = useMaxHeight();
  useEffect(() => {
    const getMerchants = async () => {
      if (userInfo) {
        if (isAdmin(userInfo.role)) {
          const response = await getListMerchant({
            records: Number.MAX_SAFE_INTEGER,
          });
          if (response && response.data) {
            setMerchants([...response.data]);
          }
        }
      }
    };
    getMerchants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);
  const {
    data,
    currentPage,
    total,
    offset,
    onPaginationChange,
    loading,
    pageSize,
    updateData,
  } = usePagination(initData, getListUser);
  const showConfirmDelete = async (value: TUserInfo) => {
    confirm({
      title: capitalizeFirstLetter(
        `${TRANSLATE_KEY.confirm} ${TRANSLATE_KEY.remove}?`,
      ),
      icon: <QuestionCircleOutlined />,
      content: (
        <Typography.Text>
          {`${TRANSLATE_KEY.do_you_want_to_remove}: `}
          <Typography.Text strong>{`${value?.email}?`}</Typography.Text>
        </Typography.Text>
      ),
      okText: TRANSLATE_KEY.remove,
      transitionName: 'ant-zoom-up',
      maskTransitionName: 'ant-fade',
      centered: true,
      onOk: async () => {
        const response = await deleteUser({ userId: value.id });
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
    setUserSelected(undefined);
    setIsOpenForm(false);
  };

  const columns = [
    {
      title: 'Index',
      key: 'index',
      align: 'center' as const,
      width: 70,
      render: (value: TUserInfo, item: TUserInfo, index: number) => {
        return offset + index + 1;
      },
      fixed: 'left' as const,
    },
    {
      title: TRANSLATE_KEY.email,
      dataIndex: 'email',
      key: 'email',
      width: 210,
      showSorterTooltip: false,
      sorter: (a: TUserInfo, b: TUserInfo) => a.email.length - b.email.length,
      render: (email: string, record: TUserInfo) => {
        return isUser(userInfo?.role) ? (
          email
        ) : (
          <AppTooltip title={TRANSLATE_KEY.clickToEdit} color="primary">
            <Typography.Text
              ellipsis
              className="text-action"
              onClick={() => {
                setUserSelected(record);
                setIsOpenForm(true);
              }}
            >
              {email}
            </Typography.Text>
          </AppTooltip>
        );
      },
    },
    {
      title: TRANSLATE_KEY.first_name,
      dataIndex: 'firstName',
      key: 'firstName',
      width: 150,
      showSorterTooltip: false,
      sorter: (a: TUserInfo, b: TUserInfo) =>
        a.firstName.length - b.firstName.length,
      render: (firstName: string) => {
        return (
          <Typography.Paragraph ellipsis={{ rows: 2, tooltip: firstName }}>
            {firstName}
          </Typography.Paragraph>
        );
      },
    },
    {
      title: TRANSLATE_KEY.last_name,
      dataIndex: 'lastName',
      key: 'lastName',
      width: 150,

      showSorterTooltip: false,
      sorter: (a: TUserInfo, b: TUserInfo) =>
        a.lastName.length - b.lastName.length,
      render: (lastName: string) => {
        return (
          <Typography.Paragraph ellipsis={{ rows: 2, tooltip: lastName }}>
            {lastName}
          </Typography.Paragraph>
        );
      },
    },
    {
      title: TRANSLATE_KEY.merchant,
      dataIndex: 'merchantId',
      key: 'merchantId',
      width: 150,
      ellipsis: {
        showTitle: true,
      },
      showSorterTooltip: false,
      sorter: (a: TUserInfo, b: TUserInfo) =>
        (a?.merchantId ? a.merchantId.length : 0) -
        (b?.merchantId ? b.merchantId.length : 0),
      render: (merchant: string) => {
        return (
          <Typography.Paragraph ellipsis={{ rows: 2, tooltip: merchant }}>
            {merchant}
          </Typography.Paragraph>
        );
      },
    },
    {
      title: TRANSLATE_KEY.role,
      dataIndex: 'role',
      key: 'role',
      width: 120,
      ellipsis: {
        showTitle: true,
      },
      align: 'center' as const,
      showSorterTooltip: false,
      sorter: (a: TUserInfo, b: TUserInfo) =>
        a.role.toString().length - b.role.toString().length,
      render: (role: ROLE) => {
        return (
          <AppTag color={role}>
            {capitalizeFirstLetter(
              role === 'merchant' ? 'Admin merchant' : role,
            )}
          </AppTag>
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
      sorter: (a: TUserInfo, b: TUserInfo) => a.status.length - b.status.length,
      render: (status: STATUS) => {
        return <AppTag color={status}>{capitalizeFirstLetter(status)}</AppTag>;
      },
    },
    {
      title: TRANSLATE_KEY.created_at,
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 110,
      ellipsis: {
        showTitle: true,
      },
      render: (createdAt: string) => {
        return createdAt ? moment(createdAt).format('DD-MM-YYYY HH:mm:ss') : '';
      },
    },
    {
      title: TRANSLATE_KEY.actions,
      key: 'actions',
      align: 'center' as const,
      fixed: 'right' as const,
      width: 100,
      render: (_: any, record: TUserInfo) => (
        <Space size="middle">
          <AppTooltip title={TRANSLATE_KEY.clickToEdit}>
            <Button
              disabled={isUser(userInfo?.role)}
              type="primary"
              icon={<EditFilled />}
              with="link"
              size="middle"
              onClick={() => {
                setUserSelected(record);
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
              type="danger"
              icon={<DeleteFilled />}
              with="link"
              size="middle"
              disabled={userInfo?.id === record.id || isUser(userInfo?.role)}
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
      <UserForm
        isOpen={isOpenForm}
        merchants={merchants}
        userSelected={userSelected}
        onClose={handleCloseForm}
        updateData={updateData}
        total={total}
        data={data}
      />
    </>
  );
};

export default User;
