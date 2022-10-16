import React, { useState } from 'react';
import {
  DeleteFilled,
  EditFilled,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Card, Col, Modal, Row, Space, Table, Typography } from 'antd';
import Button from 'antd-button-color';
import { IMerchant } from 'src/@types/entities/Merchant';
import { deleteMerchant, getListMerchant } from 'src/apis/merchant';
import { openNotificationWithIcon } from 'src/components/AppNotification';
import useMaxHeight from 'src/hooks/useMaxHeight';
import usePagination from 'src/hooks/usePagination';
import TRANSLATE_KEY from 'src/languages/locales/translateKey';
import capitalizeFirstLetter from 'src/utils/capitalizeFirstLetter';
import { useAppSelector } from 'src/redux';
import { isUser } from 'src/helpers';
import AppTooltip from 'src/components/AppTooltip';
import Filter from './filter';
import MerchantForm from './form';

const { confirm } = Modal;
const Merchant = function Merchant() {
  const initData: IMerchant[] = [];
  const userInfo = useAppSelector((s) => s.auth.user);
  const [merchantSelected, setMerchantSelected] = useState<IMerchant>();
  const [isOpenForm, setIsOpenForm] = useState(false);
  const maxHeight = useMaxHeight();
  const {
    data,
    currentPage,
    total,
    offset,
    onPaginationChange,
    loading,
    pageSize,
    updateData,
  } = usePagination(initData, getListMerchant);
  const showConfirmDelete = async (value: IMerchant) => {
    confirm({
      title: capitalizeFirstLetter(
        `${TRANSLATE_KEY.confirm} ${TRANSLATE_KEY.remove}?`,
      ),
      icon: <QuestionCircleOutlined />,
      content: (
        <Typography.Text>
          {`${TRANSLATE_KEY.do_you_want_to_remove}: `}
          <Typography.Text strong>{`${value?.id}?`}</Typography.Text>
        </Typography.Text>
      ),
      okText: TRANSLATE_KEY.remove,
      transitionName: 'ant-zoom-up',
      maskTransitionName: 'ant-fade',
      centered: true,
      onOk: async () => {
        const response = await deleteMerchant({ merchantId: value.id });
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
    setMerchantSelected(undefined);
    setIsOpenForm(false);
  };
  const columns = [
    {
      title: 'Index',
      key: 'index',
      align: 'center' as const,
      width: 70,
      render: (value: IMerchant, item: IMerchant, index: number) => {
        return offset + index + 1;
      },
      fixed: 'left' as const,
    },
    {
      title: TRANSLATE_KEY.merchant_name,
      dataIndex: 'id',
      key: 'id',
      width: 150,
      showSorterTooltip: false,
      sorter: (a: IMerchant, b: IMerchant) => a.id.length - b.id.length,
      render: (merchantName: string, record: IMerchant) => {
        return isUser(userInfo?.role) ? (
          merchantName
        ) : (
          <AppTooltip title={TRANSLATE_KEY.clickToEdit} color="primary">
            <Typography.Text
              ellipsis
              className="text-action"
              onClick={() => {
                setMerchantSelected(record);
                setIsOpenForm(true);
              }}
            >
              {merchantName}
            </Typography.Text>
          </AppTooltip>
        );
      },
    },
    {
      title: TRANSLATE_KEY.display_name,
      dataIndex: 'name',
      key: 'name',
      width: 150,
      showSorterTooltip: false,
      sorter: (a: IMerchant, b: IMerchant) => a.name.length - b.name.length,
      render: (name: string) => {
        return (
          <Typography.Paragraph ellipsis={{ rows: 2, tooltip: name }}>
            {name}
          </Typography.Paragraph>
        );
      },
    },
    {
      title: TRANSLATE_KEY.email,
      dataIndex: 'email',
      key: 'email',
      width: 210,
      showSorterTooltip: false,
      sorter: (a: IMerchant, b: IMerchant) => a.email.length - b.email.length,
      render: (email: string) => {
        return (
          <Typography.Paragraph ellipsis={{ rows: 2, tooltip: email }}>
            {email}
          </Typography.Paragraph>
        );
      },
    },
    {
      title: TRANSLATE_KEY.description,
      dataIndex: 'description',
      key: 'description',
      width: 240,
      render: (description: string) => {
        return (
          <Typography.Paragraph ellipsis={{ rows: 2, tooltip: description }}>
            {description}
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
      render: (_: any, record: IMerchant) => (
        <Space size="middle">
          <AppTooltip title={TRANSLATE_KEY.clickToEdit}>
            <Button
              disabled={isUser(userInfo?.role)}
              type="primary"
              icon={<EditFilled />}
              with="link"
              size="middle"
              onClick={() => {
                setMerchantSelected(record);
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
              disabled={userInfo?.id === record.id || isUser(userInfo?.role)}
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

      <MerchantForm
        isOpen={isOpenForm}
        merchantSelected={merchantSelected}
        onClose={handleCloseForm}
        updateData={updateData}
        total={total}
        data={data}
      />
    </>
  );
};

export default Merchant;
