import React, { useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Col, Form, Row, Select } from 'antd';
import useSearchParams from 'src/hooks/useSearchParams';
import TRANSLATE_KEY from 'src/languages/locales/translateKey';
import capitalizeFirstLetter from 'src/utils/capitalizeFirstLetter';
import Button from 'antd-button-color';
import { openNotificationWithIcon } from 'src/components/AppNotification';
import { ITrafficFlowFormSearch } from 'src/@types/entities/TrafficFlow';
import { trafficFlowTypeMap } from 'src/utils/define';

const Filter = function Filter() {
  const [formTrafficFlowSearch] = Form.useForm<ITrafficFlowFormSearch>();
  const { getAllParams, addParams } = useSearchParams();
  const params = getAllParams<ITrafficFlowFormSearch>({
    recordType: '',
  });
  useEffect(() => {
    formTrafficFlowSearch.setFieldsValue(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);
  const onFinish = (values: ITrafficFlowFormSearch) => {
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
      form={formTrafficFlowSearch}
      labelAlign="left"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Row gutter={12} align="bottom">
        <Col xs={24} md={12} lg={12} xl={4}>
          <Form.Item name="recordType" label={`${TRANSLATE_KEY.record_type}`}>
            <Select
              showSearch
              placeholder={capitalizeFirstLetter(
                `${TRANSLATE_KEY.pleaseSelect} ${TRANSLATE_KEY.record_type}`,
              )}
              onSelect={(value: string) => {
                addParams({ recordType: value });
              }}
            >
              <Select.Option value="">{TRANSLATE_KEY.all}</Select.Option>
              {Object.entries(trafficFlowTypeMap).map(([key, value]) => {
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
          <Form.Item label="">
            <Button
              style={{ width: '100%' }}
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
            >
              {TRANSLATE_KEY.search}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
