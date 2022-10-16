import React, { useEffect } from 'react';
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Col, Form, Input, Row, Select, Space } from 'antd';
import useSearchParams from 'src/hooks/useSearchParams';
import TRANSLATE_KEY from 'src/languages/locales/translateKey';
import capitalizeFirstLetter from 'src/utils/capitalizeFirstLetter';
import { citiesMap, countriesMap, ispMap } from 'src/utils/define';
import Button from 'antd-button-color';
import { openNotificationWithIcon } from 'src/components/AppNotification';
import { IServerFormSearch } from 'src/@types/entities/Server';
import AppSelect from 'src/components/AppSelect';
import { isUser } from 'src/helpers';
import { useAppSelector } from 'src/redux';

const Filter = function Filter({ onCreate }: { onCreate: () => void }) {
  const [formServerSearch] = Form.useForm<IServerFormSearch>();
  const countryWatch = Form.useWatch('country', formServerSearch);
  const { getAllParams, addParams } = useSearchParams();
  const userInfo = useAppSelector((s) => s.auth.user);
  const params = getAllParams<IServerFormSearch>({
    publicIp: '',
    privateIp: '',
    country: '',
    region: '',
    isp: '',
  });

  useEffect(() => {
    formServerSearch.setFieldsValue(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const onFinish = (values: IServerFormSearch) => {
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
      form={formServerSearch}
      labelAlign="left"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Row gutter={12} align="top">
        <Col xs={24} md={12} lg={12} xl={4}>
          <Form.Item name="publicIp" label={TRANSLATE_KEY.public_ip}>
            <Input placeholder={TRANSLATE_KEY.public_ip} />
          </Form.Item>
        </Col>
        {/* <Col xs={24} md={12} lg={12} xl={4}>
          <Form.Item name="privateIp" label={TRANSLATE_KEY.private_ip}>
            <Input placeholder={TRANSLATE_KEY.private_ip} />
          </Form.Item>
        </Col> */}
        <Col xs={24} md={12} lg={12} xl={4}>
          <Form.Item name="country" label={TRANSLATE_KEY.country}>
            <AppSelect
              dropdownMatchSelectWidth={false}
              showSearch
              filterOption={(input, option) => {
                if (
                  option &&
                  option.children &&
                  typeof option.children === 'string'
                ) {
                  return (
                    (option.children as string)
                      .toLowerCase()
                      .indexOf(input.toLowerCase(), 0) === 0
                  );
                }
                return false;
              }}
              placeholder={TRANSLATE_KEY.country}
              onSelect={(value: string) => {
                if (value !== 'VN') {
                  addParams({ country: value, isp: '', region: '' });
                  return;
                }
                addParams({ country: value });
              }}
            >
              <Select.Option value="">{TRANSLATE_KEY.all}</Select.Option>
              {Object.entries(countriesMap).map(([key, value]) => {
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
          <Form.Item name="region" label={TRANSLATE_KEY.region}>
            <Select
              disabled={countryWatch !== 'VN'}
              filterOption={(input, option) => {
                if (
                  option &&
                  option.children &&
                  typeof option.children === 'string'
                ) {
                  return (
                    (option.children as string)
                      .toLowerCase()
                      .indexOf(input.toLowerCase(), 0) === 0
                  );
                }
                return false;
              }}
              showSearch
              placeholder={capitalizeFirstLetter(
                `${TRANSLATE_KEY.pleaseSelect} ${TRANSLATE_KEY.region}`,
              )}
              onSelect={(value: string) => {
                addParams({ region: value });
              }}
            >
              <Select.Option value="">{TRANSLATE_KEY.all}</Select.Option>
              {Object.entries(citiesMap).map(([key, value]) => {
                return (
                  <Select.Option key={key} value={key}>
                    {value}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12} lg={12} xl={4}>
          <Form.Item name="isp" label={TRANSLATE_KEY.isp}>
            <Select
              disabled={countryWatch !== 'VN'}
              filterOption={(input, option) => {
                if (
                  option &&
                  option.children &&
                  typeof option.children === 'string'
                ) {
                  return (
                    (option.children as string)
                      .toLowerCase()
                      .indexOf(input.toLowerCase(), 0) === 0
                  );
                }
                return false;
              }}
              showSearch
              placeholder={capitalizeFirstLetter(
                `${TRANSLATE_KEY.pleaseSelect} ${TRANSLATE_KEY.isp}`,
              )}
              onSelect={(value: string) => {
                addParams({ isp: value });
              }}
            >
              <Select.Option value="">{TRANSLATE_KEY.all}</Select.Option>
              {Object.entries(ispMap).map(([key, value]) => {
                return (
                  <Select.Option key={key} value={key}>
                    {value}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} xl={4}>
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
