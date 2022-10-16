import React, { useEffect } from 'react';
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Col, Form, Input, Row, Space } from 'antd';
import useSearchParams from 'src/hooks/useSearchParams';
import TRANSLATE_KEY from 'src/languages/locales/translateKey';
import Button from 'antd-button-color';
import { openNotificationWithIcon } from 'src/components/AppNotification';
import { IMerchantFormSearch } from 'src/@types/entities/Merchant';
import { isUser } from 'src/helpers';
import { useAppSelector } from 'src/redux';

const Filter = function Filter({ onCreate }: { onCreate: () => void }) {
  const [formMerchantSearch] = Form.useForm<IMerchantFormSearch>();
  const userInfo = useAppSelector((s) => s.auth.user);
  const { getAllParams, addParams } = useSearchParams();
  const params = getAllParams<IMerchantFormSearch>({
    id: '',
    name: '',
    email: '',
  });
  useEffect(() => {
    formMerchantSearch.setFieldsValue(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onFinish = (values: IMerchantFormSearch) => {
    addParams({ ...values });
  };
  const onFinishFailed = () => {
    openNotificationWithIcon(
      'warning',
      'Warning',
      TRANSLATE_KEY.checkFieldsForm,
    );
  };

  return (
    <Form
      className="app-filter-form"
      layout="vertical"
      form={formMerchantSearch}
      labelAlign="left"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Row gutter={12} align="top">
        <Col xs={24} md={12} lg={5} xl={6}>
          <Form.Item name="id" label={TRANSLATE_KEY.merchant_name}>
            <Input placeholder={TRANSLATE_KEY.merchant_name} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12} lg={5} xl={6}>
          <Form.Item name="name" label={TRANSLATE_KEY.display_name}>
            <Input placeholder={TRANSLATE_KEY.display_name} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12} lg={5} xl={6}>
          <Form.Item name="email" label={`${TRANSLATE_KEY.email}`}>
            <Input placeholder={TRANSLATE_KEY.email} />
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
