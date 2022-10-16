import React, { useEffect } from 'react';
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Col, Form, Input, Row, Select, Space } from 'antd';
import { IUerFormSearch } from 'src/@types/entities/User';
import useSearchParams from 'src/hooks/useSearchParams';
import TRANSLATE_KEY from 'src/languages/locales/translateKey';
import { roleMap, statusMap } from 'src/utils/define';
import Button from 'antd-button-color';
import { openNotificationWithIcon } from 'src/components/AppNotification';
import { IMerchant } from 'src/@types/entities/Merchant';
import { useAppSelector } from 'src/redux';
import { isAdmin, isUser } from 'src/helpers';
import AppSelect from 'src/components/AppSelect';

const Filter = function Filter({
  onCreate,
  merchants,
}: {
  onCreate: () => void;
  merchants: IMerchant[] | undefined;
}) {
  const [formUserSearch] = Form.useForm<IUerFormSearch>();
  const userInfo = useAppSelector((s) => s.auth.user);
  const { getAllParams, addParams } = useSearchParams();
  const params = getAllParams<IUerFormSearch>({
    merchantId: '',
    email: '',
    role: '',
    status: '',
  });
  useEffect(() => {
    formUserSearch.setFieldsValue(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onFinish = (values: IUerFormSearch) => {
    addParams({ ...values });
  };
  const onFinishFailed = () => {
    openNotificationWithIcon(
      'warning',
      TRANSLATE_KEY.warning,
      TRANSLATE_KEY.checkFieldsForm,
    );
  };

  return (
    <Form
      className="app-filter-form"
      layout="vertical"
      form={formUserSearch}
      labelAlign="left"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Row gutter={12} align="top">
        <Col xs={24} md={12} lg={5} xl={6}>
          <Form.Item name="email" label={`${TRANSLATE_KEY.email}`}>
            <Input placeholder={TRANSLATE_KEY.email} />
          </Form.Item>
        </Col>
        {userInfo && isAdmin(userInfo.role) && (
          <Col xs={24} md={12} lg={4} xl={4}>
            <Form.Item name="merchantId" label={`${TRANSLATE_KEY.merchant}`}>
              <AppSelect
                dropdownMatchSelectWidth={false}
                placeholder={TRANSLATE_KEY.merchant}
                onSelect={(value: string) => {
                  addParams({ merchantId: value });
                }}
              >
                <Select.Option value="">{TRANSLATE_KEY.all}</Select.Option>
                {merchants &&
                  merchants.length > 0 &&
                  merchants.map((item) => {
                    return (
                      <Select.Option key={item.id} value={item.id}>
                        {item.id}
                      </Select.Option>
                    );
                  })}
              </AppSelect>
            </Form.Item>
          </Col>
        )}
        <Col xs={24} md={12} lg={4} xl={4}>
          <Form.Item name="role" label={`${TRANSLATE_KEY.role}`}>
            <AppSelect
              dropdownMatchSelectWidth={false}
              placeholder={TRANSLATE_KEY.role}
              onSelect={(value: string) => {
                addParams({ role: value });
              }}
            >
              <Select.Option value="">{TRANSLATE_KEY.all}</Select.Option>
              {Object.entries(roleMap).map(([key, value]) => {
                return (
                  <Select.Option key={key} value={key}>
                    {value}
                  </Select.Option>
                );
              })}
            </AppSelect>
          </Form.Item>
        </Col>
        <Col xs={24} md={12} lg={4} xl={4}>
          <Form.Item name="status" label={`${TRANSLATE_KEY.status}`}>
            <AppSelect
              dropdownMatchSelectWidth={false}
              placeholder={TRANSLATE_KEY.status}
              onSelect={(value: string) => {
                addParams({ status: value });
              }}
            >
              <Select.Option value="">{TRANSLATE_KEY.all}</Select.Option>
              {Object.entries(statusMap).map(([key, value]) => {
                return (
                  <Select.Option key={key} value={key}>
                    {value}
                  </Select.Option>
                );
              })}
            </AppSelect>
          </Form.Item>
        </Col>
        <Col xs={24} md={12} lg={4} xl={4}>
          <Space size="middle" align="end">
            <Form.Item label={TRANSLATE_KEY.search}>
              <Button
                style={{ width: '100%' }}
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
              >
                {TRANSLATE_KEY.search}
              </Button>
            </Form.Item>
            <Form.Item label={TRANSLATE_KEY.create}>
              <Button
                disabled={isUser(userInfo?.role)}
                style={{ width: '100%' }}
                type="success"
                icon={<PlusCircleOutlined />}
                onClick={onCreate}
              >
                {TRANSLATE_KEY.create}
              </Button>
            </Form.Item>
          </Space>
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
