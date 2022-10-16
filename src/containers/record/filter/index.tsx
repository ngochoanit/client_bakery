import React, { useEffect } from 'react';
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Col, Form, Input, Row, Select, Space } from 'antd';
import useSearchParams from 'src/hooks/useSearchParams';
import TRANSLATE_KEY from 'src/languages/locales/translateKey';
import { recordType, statusMap } from 'src/utils/define';
import Button from 'antd-button-color';
import { openNotificationWithIcon } from 'src/components/AppNotification';
import { IRecordFormSearch } from 'src/@types/entities/Record';
import AppSelect from 'src/components/AppSelect';
import { isUser } from 'src/helpers';
import { useAppSelector } from 'src/redux';

const Filter = function Filter({ onCreate }: { onCreate: () => void }) {
  const [formRecordSearch] = Form.useForm<IRecordFormSearch>();
  const userInfo = useAppSelector((s) => s.auth.user);
  const { getAllParams, addParams } = useSearchParams();
  const params = getAllParams<IRecordFormSearch>({
    name: '',
    type: '',
    status: '',
  });
  useEffect(() => {
    formRecordSearch.setFieldsValue(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onFinish = (values: IRecordFormSearch) => {
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
      form={formRecordSearch}
      labelAlign="left"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Row gutter={12} align="top">
        <Col xs={24} md={12} lg={12} xl={4}>
          <Form.Item name="name" label={TRANSLATE_KEY.name}>
            <Input placeholder={TRANSLATE_KEY.record_name} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12} lg={12} xl={4}>
          <Form.Item name="type" label={TRANSLATE_KEY.type}>
            <AppSelect
              dropdownMatchSelectWidth={false}
              placeholder={TRANSLATE_KEY.type}
              onSelect={(value: string) => {
                addParams({ type: value });
              }}
            >
              <Select.Option value="">{TRANSLATE_KEY.all}</Select.Option>
              {Object.entries(recordType).map(([key, value]) => {
                return (
                  <Select.Option key={key} value={key}>
                    {value}
                  </Select.Option>
                );
              })}
            </AppSelect>
          </Form.Item>
        </Col>
        <Col xs={24} md={12} lg={12} xl={4}>
          <Form.Item name="status" label={TRANSLATE_KEY.status}>
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
        <Col xs={24} md={12} lg={12} xl={4}>
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
