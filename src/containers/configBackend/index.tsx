import React, { useEffect, useState } from 'react';
import {
  CaretRightOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Card,
  Col,
  Collapse,
  Empty,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Spin,
  Typography,
} from 'antd';
import Button from 'antd-button-color';
import {
  IConfigBackend,
  TConfigBackendForm,
} from 'src/@types/entities/ConfigBackend';

import {
  getListConfigBackend,
  updateConfigBackend,
} from 'src/apis/configBackend';
import { openNotificationWithIcon } from 'src/components/AppNotification';
import { isAdmin, isUser } from 'src/helpers';
import TRANSLATE_KEY from 'src/languages/locales/translateKey';
import { useAppSelector } from 'src/redux';
import capitalizeFirstLetter from 'src/utils/capitalizeFirstLetter';
import { omitIsNil } from 'src/utils/omit';
import useGetMerchants from 'src/hooks/useGetMerchants';
import validateMessages from 'src/helpers/validateMessages';
import AppSelect from 'src/components/AppSelect';
import { regexIpv4 } from 'src/utils/regularExpression';
import { difference } from 'src/utils/differenceBetweenTwoObjects';
import { isEmpty } from 'lodash';
import './index.less';
import AppInputPassword from 'src/components/AppInputPassWord';

const prefixCls = 'config-backend';
const { Panel } = Collapse;
const ConfigBackend = function ConfigBackend() {
  const [isLoading, setIsLoading] = useState(false);
  const [dataConfig, setDataConfig] = useState<IConfigBackend | undefined>();
  const [formConfig] = Form.useForm<TConfigBackendForm>();
  const userInfo = useAppSelector((s) => s.auth.user);

  const merchants = useGetMerchants();

  const handleOnSelectMerchant = async (merchantId: string) => {
    setIsLoading(true);
    const result = await getListConfigBackend({ merchantId });
    if (result && result.data && result.data.length > 0) {
      const item = result.data[0];
      const dataConverter = {
        ...item,
        rules: {
          // healthCheck: { ...item.rules.healthCheck },
          cpu: item.rules.cpu ? item.rules.cpu * 100 : 50,
          ram: item.rules.ram ? item.rules.ram * 100 : 50,
          diskSpaceUsage: item.rules.diskSpaceUsage
            ? item.rules.diskSpaceUsage * 100
            : 50,
          // networkReceived: item.rules.networkReceived
          //   ? item.rules.networkReceived * 100
          //   : 50,
          // networkTransmitted: item.rules.networkTransmitted
          //   ? item.rules.networkTransmitted * 100
          //   : 50,
        },
      };
      setDataConfig({ ...dataConverter });
      formConfig.setFieldsValue({ ...dataConverter });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      if (!isAdmin(userInfo?.role)) {
        const response = await getListConfigBackend({
          merchantId: userInfo?.merchantId,
        });
        if (response && response.data && response.data.length > 0) {
          const item = response.data[0];
          const dataConverter = {
            ...item,
            rules: {
              // healthCheck: { ...item.rules.healthCheck },
              cpu: item.rules.cpu ? item.rules.cpu * 100 : 50,
              ram: item.rules.ram ? item.rules.ram * 100 : 50,
              diskSpaceUsage: item.rules.diskSpaceUsage
                ? item.rules.diskSpaceUsage * 100
                : 50,
              // networkReceived: item.rules.networkReceived
              //   ? item.rules.networkReceived * 100
              //   : 50,
              // networkTransmitted: item.rules.networkTransmitted
              //   ? item.rules.networkTransmitted * 100
              //   : 50,
            },
          };
          setDataConfig({ ...dataConverter });
          formConfig.setFieldsValue({ ...dataConverter });
        }
      }
      setIsLoading(false);
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  const onFinish = async (values: TConfigBackendForm) => {
    setIsLoading(true);
    if (dataConfig && dataConfig.id) {
      delete dataConfig.id;
    }
    const dataChange = await difference(
      omitIsNil(values, { deep: true }),
      omitIsNil(dataConfig, { deep: true }),
    );
    if (isEmpty(dataChange)) {
      openNotificationWithIcon(
        'warning',
        TRANSLATE_KEY.warning,
        TRANSLATE_KEY.form_not_changed2,
      );
    } else {
      const data = {
        ...values,
        rules: {
          // healthCheck: { ...values.rules.healthCheck },
          cpu: values.rules.cpu / 100,
          ram: values.rules.ram / 100,
          diskSpaceUsage: values.rules.diskSpaceUsage / 100,
          // networkReceived: values.rules.networkReceived / 100,
          // networkTransmitted: values.rules.networkTransmitted / 100,
        },
      };
      const response = await updateConfigBackend(data);
      if (response && response.data) {
        openNotificationWithIcon(
          'success',
          TRANSLATE_KEY.notification,
          TRANSLATE_KEY.updated_successfully,
        );
        setDataConfig(values);
      }
    }
    setIsLoading(false);
  };
  const onFinishFailed = () => {
    openNotificationWithIcon(
      'warning',
      'Warning',
      TRANSLATE_KEY.checkFieldsForm,
    );
    formConfig.setFieldsValue({ ...dataConfig });
  };

  return (
    <Spin size="large" spinning={isLoading} className={prefixCls}>
      <Form
        disabled={isUser(userInfo?.role)}
        className={prefixCls}
        initialValues={dataConfig}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        form={formConfig}
        layout="vertical"
        labelAlign="left"
      >
        <Card
          title={
            <Typography.Title level={4} style={{ marginBottom: 0 }}>
              {TRANSLATE_KEY.config_backend}
            </Typography.Title>
          }
          extra={
            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                disabled={isUser(userInfo?.role)}
                size="middle"
                type="success"
                htmlType="submit"
              >
                {capitalizeFirstLetter(`${TRANSLATE_KEY.update}`)}
              </Button>
            </Form.Item>
          }
        >
          {userInfo && isAdmin(userInfo.role) && (
            <Card className="form-card-item">
              <Form.Item
                name="merchantId"
                label={`${TRANSLATE_KEY.merchant}`}
                rules={[
                  {
                    required: true,
                    message: validateMessages.required(TRANSLATE_KEY.merchant),
                  },
                ]}
              >
                <AppSelect
                  dropdownMatchSelectWidth={false}
                  placeholder={TRANSLATE_KEY.merchant}
                  onSelect={handleOnSelectMerchant}
                >
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
            </Card>
          )}
          {dataConfig ? (
            <>
              <Row gutter={[0, 0]} align="top" style={{ width: '100%' }}>
                {userInfo && !isAdmin(userInfo.role) && (
                  <Col xs={24}>
                    <Card className="form-card-item">
                      <Form.Item
                        name="merchantId"
                        label={TRANSLATE_KEY.merchant}
                        rules={[
                          {
                            required: true,
                            message: validateMessages.required(
                              TRANSLATE_KEY.merchant,
                            ),
                          },
                        ]}
                      >
                        <Input disabled placeholder={TRANSLATE_KEY.merchant} />
                      </Form.Item>
                    </Card>
                  </Col>
                )}
                <Col xs={24}>
                  <Card className="form-card-item">
                    <Form.Item
                      name="refreshSecond"
                      label={TRANSLATE_KEY.refresh_second}
                      rules={[
                        {
                          required: true,
                          message: validateMessages.required(
                            TRANSLATE_KEY.refresh_second,
                          ),
                        },
                        () => ({
                          validator(_, value: number) {
                            if (value > 0 && value <= 300) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error(
                                validateMessages.numberRangeThan(
                                  TRANSLATE_KEY.refresh_second,
                                  0,
                                  300,
                                ),
                              ),
                            );
                          },
                        }),
                      ]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        addonAfter="sec"
                        placeholder={capitalizeFirstLetter(
                          TRANSLATE_KEY.refresh_second,
                        )}
                      />
                    </Form.Item>
                  </Card>
                </Col>
              </Row>
              <Collapse
                bordered={false}
                // eslint-disable-next-line react/no-unstable-nested-components
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                className="site-collapse-custom-collapse"
              >
                <Panel
                  forceRender
                  header={
                    <Typography.Title level={5} style={{ marginBottom: 0 }}>
                      {TRANSLATE_KEY.config_backend_rules}
                    </Typography.Title>
                  }
                  key="1"
                  className="site-collapse-custom-panel"
                >
                  <Row gutter={[24, 0]} align="top">
                    <Col xs={24} md={12}>
                      <Card className="form-card-item">
                        <Form.Item
                          name={['rules', 'cpu']}
                          label={TRANSLATE_KEY.cpu}
                          rules={[
                            {
                              required: true,
                              message: validateMessages.required(
                                TRANSLATE_KEY.cpu,
                              ),
                            },
                            () => ({
                              validator(_, value: number) {
                                if (value >= 0 && value <= 100) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(
                                  new Error(
                                    validateMessages.numberRange(
                                      TRANSLATE_KEY.cpu,
                                      0,
                                      100,
                                    ),
                                  ),
                                );
                              },
                            }),
                          ]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            addonAfter="%"
                            placeholder={TRANSLATE_KEY.cpu}
                          />
                        </Form.Item>
                      </Card>
                    </Col>
                    <Col xs={24} md={12}>
                      <Card className="form-card-item">
                        <Form.Item
                          name={['rules', 'ram']}
                          label={TRANSLATE_KEY.ram}
                          rules={[
                            {
                              required: true,
                              message: validateMessages.required(
                                TRANSLATE_KEY.ram,
                              ),
                            },
                            () => ({
                              validator(_, value: number) {
                                if (value >= 0 && value <= 100) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(
                                  new Error(
                                    validateMessages.numberRange(
                                      TRANSLATE_KEY.ram,
                                      0,
                                      100,
                                    ),
                                  ),
                                );
                              },
                            }),
                          ]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            addonAfter="%"
                            placeholder={TRANSLATE_KEY.ram}
                          />
                        </Form.Item>
                      </Card>
                    </Col>
                    {/* <Col xs={24} md={12}>
                      <Card className="form-card-item">
                        <Form.Item
                          name={['rules', 'networkReceived']}
                          label={TRANSLATE_KEY.network_received}
                          rules={[
                            {
                              required: true,
                              message: capitalizeFirstLetter(
                                `${TRANSLATE_KEY.please_input} ${TRANSLATE_KEY.network_received}`,
                              ),
                            },
                            () => ({
                              validator(_, value: number) {
                                if (value > 0 && value <= 100) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(
                                  new Error(
                                    capitalizeFirstLetter(
                                      `${TRANSLATE_KEY.network_received} ${TRANSLATE_KEY.number_invalid_between}`,
                                    ),
                                  ),
                                );
                              },
                            }),
                          ]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            addonAfter="%"
                            placeholder={TRANSLATE_KEY.network_received}
                          />
                        </Form.Item>
                      </Card>
                    </Col>
                    <Col xs={24} md={12}>
                      <Card className="form-card-item">
                        <Form.Item
                          name={['rules', 'networkTransmitted']}
                          label={TRANSLATE_KEY.network_transmitted}
                          rules={[
                            {
                              required: true,
                              message: capitalizeFirstLetter(
                                `${TRANSLATE_KEY.please_input} ${TRANSLATE_KEY.network_transmitted}`,
                              ),
                            },
                            () => ({
                              validator(_, value: number) {
                                if (value > 0 && value <= 100) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(
                                  new Error(
                                    capitalizeFirstLetter(
                                      `${TRANSLATE_KEY.network_transmitted} ${TRANSLATE_KEY.number_invalid_between}`,
                                    ),
                                  ),
                                );
                              },
                            }),
                          ]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            addonAfter="%"
                            placeholder={TRANSLATE_KEY.network_transmitted}
                          />
                        </Form.Item>
                      </Card>
                    </Col> */}
                    <Col xs={24} md={12}>
                      <Card className="form-card-item">
                        <Form.Item
                          name={['rules', 'diskSpaceUsage']}
                          label={TRANSLATE_KEY.disk_space_usage}
                          rules={[
                            {
                              required: true,
                              message: validateMessages.required(
                                TRANSLATE_KEY.disk_space_usage,
                              ),
                            },
                            () => ({
                              validator(_, value: number) {
                                if (value >= 0 && value <= 100) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(
                                  new Error(
                                    validateMessages.numberRangeThan(
                                      TRANSLATE_KEY.disk_space_usage,
                                      0,
                                      100,
                                    ),
                                  ),
                                );
                              },
                            }),
                          ]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            addonAfter="%"
                            placeholder={TRANSLATE_KEY.disk_space_usage}
                          />
                        </Form.Item>
                      </Card>
                    </Col>
                  </Row>
                </Panel>
                {/* <Panel
                  forceRender
                  header={
                    <Typography.Title level={5} style={{ marginBottom: 0 }}>
                      {TRANSLATE_KEY.health_check}
                    </Typography.Title>
                  }
                  key="2"
                  className="site-collapse-custom-panel"
                >
                  <Row gutter={[24, 0]} align="top">
                    <Col xs={24} md={12}>
                      <Card className="form-card-item">
                        <Form.Item
                          name={['rules', 'healthCheck', 'url']}
                          label={TRANSLATE_KEY.url}
                          rules={[
                            {
                              required: true,
                              message: capitalizeFirstLetter(
                                `${TRANSLATE_KEY.please_input} ${TRANSLATE_KEY.url}`,
                              ),
                            },
                            {
                              pattern:
                                /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/g,
                              message: capitalizeFirstLetter(
                                `${TRANSLATE_KEY.please_input_valid} ${TRANSLATE_KEY.url}`,
                              ),
                            },
                          ]}
                        >
                          <Input placeholder={TRANSLATE_KEY.url} />
                        </Form.Item>
                      </Card>
                    </Col>
                    <Col xs={24} md={12}>
                      <Card className="form-card-item">
                        <Form.Item
                          name={['rules', 'healthCheck', 'code']}
                          label={TRANSLATE_KEY.http_status_codes}
                          rules={[
                            {
                              required: true,
                              message: capitalizeFirstLetter(
                                `${TRANSLATE_KEY.please_input} ${TRANSLATE_KEY.http_status_codes}`,
                              ),
                            },
                          ]}
                        >
                          <Select
                            placeholder={capitalizeFirstLetter(
                              `${TRANSLATE_KEY.pleaseSelect} ${TRANSLATE_KEY.http_status_codes}`,
                            )}
                          >
                            {Object.entries(httpCodeMap).map(([key, value]) => {
                              return (
                                <Select.Option key={key} value={key}>
                                  {`${key} - ${value}`}
                                </Select.Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </Card>
                    </Col>
                    <Col xs={24} md={12}>
                      <Card className="form-card-item">
                        <Form.Item
                          name={['rules', 'healthCheck', 'timeout']}
                          label={TRANSLATE_KEY.timeout}
                          rules={[
                            {
                              required: true,
                              message: capitalizeFirstLetter(
                                `${TRANSLATE_KEY.please_input} ${TRANSLATE_KEY.timeout}`,
                              ),
                            },
                            () => ({
                              validator(_, value: number) {
                                if (value > 0) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(
                                  new Error(
                                    capitalizeFirstLetter(
                                      `${TRANSLATE_KEY.timeout} ${TRANSLATE_KEY.number_invalid}`,
                                    ),
                                  ),
                                );
                              },
                            }),
                          ]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            addonAfter="sec"
                            placeholder={TRANSLATE_KEY.timeout}
                          />
                        </Form.Item>
                      </Card>
                    </Col>
                  </Row>
                </Panel> */}
                <Panel
                  forceRender
                  header={
                    <Typography.Title level={5} style={{ marginBottom: 0 }}>
                      {TRANSLATE_KEY.prometheus}
                    </Typography.Title>
                  }
                  key="3"
                  className="site-collapse-custom-panel"
                >
                  <Form.List
                    name="prometheus"
                    // initialValue={[
                    //   {
                    //     host: undefined,
                    //     port: undefined,
                    //     user: undefined,
                    //     password: undefined,
                    //   },
                    // ]}
                  >
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }, index) => {
                          return (
                            <div className="space-container" key={key}>
                              <Row
                                gutter={24}
                                align="top"
                                style={{ width: '100%' }}
                                className="space-form"
                              >
                                {/* <MinusCircleOutlined onClick={() => remove(name)} /> */}
                                <Col xs={24} md={12} xl={6}>
                                  {/* <Card className="form-card-item"> */}
                                  <Form.Item
                                    hidden={index >= 1}
                                    {...restField}
                                    name={[name, 'host']}
                                    label={TRANSLATE_KEY.host}
                                    rules={[
                                      {
                                        required: true,
                                        message: validateMessages.required(
                                          TRANSLATE_KEY.host,
                                        ),
                                      },
                                      {
                                        pattern: regexIpv4,
                                        message: validateMessages.pattern(
                                          TRANSLATE_KEY.host,
                                          'ipv4',
                                        ),
                                      },
                                    ]}
                                  >
                                    <Input placeholder={TRANSLATE_KEY.host} />
                                  </Form.Item>
                                  {/* </Card> */}
                                </Col>
                                <Col xs={24} md={12} xl={6}>
                                  {/* <Card className="form-card-item"> */}
                                  <Form.Item
                                    hidden={index >= 1}
                                    name={[name, 'port']}
                                    label={TRANSLATE_KEY.port}
                                    rules={[
                                      {
                                        required: true,
                                        message: validateMessages.required(
                                          TRANSLATE_KEY.disk_space_usage,
                                        ),
                                      },
                                      () => ({
                                        validator(_, value: number) {
                                          if (value >= 0 && value <= 65536) {
                                            return Promise.resolve();
                                          }
                                          return Promise.reject(
                                            new Error(
                                              validateMessages.numberRangeThan(
                                                TRANSLATE_KEY.disk_space_usage,
                                                0,
                                                65536,
                                              ),
                                            ),
                                          );
                                        },
                                      }),
                                    ]}
                                  >
                                    <InputNumber
                                      min={0}
                                      style={{ width: '100%' }}
                                      placeholder={TRANSLATE_KEY.port}
                                    />
                                  </Form.Item>
                                  {/* </Card> */}
                                </Col>
                                <Col xs={24} md={12} xl={6}>
                                  {/* <Card className="form-card-item"> */}
                                  <Form.Item
                                    hidden
                                    name={[name, 'user']}
                                    label={TRANSLATE_KEY.user}
                                  >
                                    <Input placeholder={TRANSLATE_KEY.user} />
                                  </Form.Item>
                                  {/* </Card> */}
                                </Col>
                                <Col xs={24} md={12} xl={6}>
                                  {/* <Card className="form-card-item"> */}
                                  <Form.Item
                                    hidden
                                    name={[name, 'password']}
                                    label={TRANSLATE_KEY.password}
                                  >
                                    <AppInputPassword disabled />
                                  </Form.Item>
                                  {/* </Card> */}
                                </Col>
                              </Row>
                              <Button
                                disabled={isUser(userInfo?.role)}
                                shape="circle"
                                size="small"
                                type="danger"
                                onClick={() => remove(name)}
                                icon={<MinusOutlined />}
                              />
                            </div>
                          );
                        })}

                        <Button
                          disabled={isUser(userInfo?.role)}
                          type="success"
                          hidden={fields.length > 0}
                          onClick={() => add()}
                          icon={<PlusOutlined />}
                        >
                          {TRANSLATE_KEY.add}
                        </Button>
                      </>
                    )}
                  </Form.List>
                </Panel>
              </Collapse>
            </>
          ) : (
            <Empty />
          )}
        </Card>
      </Form>
    </Spin>
  );
};

export default ConfigBackend;
