import React, { useEffect } from 'react';
import { Col, Form, Input, Row, Select, Space } from 'antd';
import Button from 'antd-button-color';
import { IDomainFormSearch } from 'src/@types/entities/Domain';
import TRANSLATE_KEY from 'src/languages/locales/translateKey';
import { domainType } from 'src/utils/define';
import useSearchParams from 'src/hooks/useSearchParams';
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
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
  const [formDomain] = Form.useForm<IDomainFormSearch>();
  const userInfo = useAppSelector((s) => s.auth.user);
  const { getAllParams, addParams } = useSearchParams();
  const params = getAllParams<IDomainFormSearch>({
    domainName: '',
    type: '',
    merchantId: '',
    soaEditApi: '',
  });

  useEffect(() => {
    formDomain.setFieldsValue(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = (values: IDomainFormSearch) => {
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
      form={formDomain}
      labelAlign="left"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Row gutter={12} align="top">
        <Col xs={24} md={12} lg={4} xl={6}>
          <Form.Item name="domainName" label={TRANSLATE_KEY.domain_name}>
            <Input placeholder={TRANSLATE_KEY.domain_name} />
          </Form.Item>
        </Col>
        {userInfo && isAdmin(userInfo.role) && (
          <Col xs={24} md={12} lg={4} xl={4}>
            <Form.Item name="merchantId" label={TRANSLATE_KEY.merchant}>
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
          <Form.Item name="type" label={TRANSLATE_KEY.type}>
            <AppSelect
              dropdownMatchSelectWidth={false}
              placeholder={TRANSLATE_KEY.type}
              onSelect={(value: string) => {
                addParams({ type: value });
              }}
            >
              <Select.Option value="">{TRANSLATE_KEY.all}</Select.Option>
              {Object.entries(domainType).map(([key, value]) => {
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
                type="success"
                style={{ width: '100%' }}
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
