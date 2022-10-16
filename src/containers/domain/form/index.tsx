import React from 'react';
import {
  Button,
  Col,
  Divider,
  Drawer,
  Form,
  Input,
  Layout,
  Modal,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import { IDomain, IFormDomain } from 'src/@types/entities/Domain';
import TRANSLATE_KEY from 'src/languages/locales/translateKey';
import capitalizeFirstLetter from 'src/utils/capitalizeFirstLetter';
import { domainSoaEditAPI, domainType } from 'src/utils/define';
import { openNotificationWithIcon } from 'src/components/AppNotification';
import { createDomain } from 'src/apis/domain';
import { omitIsNil } from 'src/utils/omit';
import { CloseOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import ButtonCustom from 'antd-button-color';
import { IMerchant } from 'src/@types/entities/Merchant';
import { useAppSelector } from 'src/redux';
import { isAdmin, isMerchant } from 'src/helpers';
import DOMAIN_TYPE from 'src/constants/domainType';
import DOMAIN_SOA_EDIT_API from 'src/constants/domainSoaEditApi';
import validateMessages from 'src/helpers/validateMessages';
import { regexDomainName } from 'src/utils/regularExpression';
import { difference } from 'src/utils/differenceBetweenTwoObjects';
import { isEmpty } from 'lodash';

const { confirm } = Modal;
const DomainForm = function DomainForm({
  isOpen,
  merchants,
  onClose,
  updateData,
  total,
  data,
}: {
  isOpen: boolean;
  merchants: IMerchant[] | undefined;
  onClose: () => void;
  updateData: (newData: IDomain[], totalNew: number) => void;
  total: number;
  data: IDomain[];
}) {
  const [formDomain] = Form.useForm<IFormDomain>();
  const userInfo = useAppSelector((s) => s.auth.user);
  const valueInit = {
    domainName: undefined,
    type: DOMAIN_TYPE.MASTER,
    soaEditApi: DOMAIN_SOA_EDIT_API.DEFAULT,
    merchantId:
      userInfo && isMerchant(userInfo?.role) ? userInfo.merchantId : undefined,
  };
  const onFinishDomain = async (values: IFormDomain) => {
    const response = await createDomain(omitIsNil(values, { deep: false }));
    if (response && response.data) {
      const item = response.data;
      const newData = [...data];
      newData.unshift(item);
      updateData(newData, total + 1);
      openNotificationWithIcon(
        'success',
        TRANSLATE_KEY.notification,
        TRANSLATE_KEY.request_is_being_processed,
      );
      formDomain.resetFields();
      onClose();
    }
  };
  const onFinishDomainFailed = () => {
    openNotificationWithIcon(
      'warning',
      TRANSLATE_KEY.warning,
      TRANSLATE_KEY.checkFieldsForm,
    );
  };
  const showConfirmCancel = async () => {
    confirm({
      title: TRANSLATE_KEY.exit,
      icon: <QuestionCircleOutlined />,
      content: <Typography.Text>{TRANSLATE_KEY.confirmExit}</Typography.Text>,
      transitionName: 'ant-zoom-up',
      maskTransitionName: 'ant-fade',
      centered: true,
      okType: 'primary',
      onOk: async () => {
        formDomain.resetFields();
        onClose();
      },
    });
  };
  const handleCloseForm = () => {
    const values = formDomain.getFieldsValue();
    const dataChange = difference(values, valueInit);
    if (isEmpty(dataChange)) {
      formDomain.resetFields();
      onClose();
    } else {
      showConfirmCancel();
    }
  };

  return (
    <Drawer
      forceRender
      width={480}
      title={capitalizeFirstLetter(
        `${TRANSLATE_KEY.create} ${TRANSLATE_KEY.domain}`,
      )}
      closable={false}
      onClose={handleCloseForm}
      open={isOpen}
      bodyStyle={{ display: 'flex', flexDirection: 'column' }}
      extra={
        <ButtonCustom
          type="danger"
          icon={<CloseOutlined />}
          size="small"
          onClick={onClose}
        />
      }
    >
      <Form
        initialValues={{ ...valueInit }}
        layout="vertical"
        form={formDomain}
        labelAlign="left"
        onFinish={onFinishDomain}
        onFinishFailed={onFinishDomainFailed}
      >
        {userInfo &&
          (isAdmin(userInfo.role) ? (
            <Form.Item
              name="merchantId"
              label={TRANSLATE_KEY.merchant}
              rules={[
                {
                  required: true,
                  message: validateMessages.required(
                    TRANSLATE_KEY.merchant_name,
                  ),
                },
              ]}
            >
              <Select placeholder={TRANSLATE_KEY.merchant}>
                {merchants &&
                  merchants.length > 0 &&
                  merchants.map((item) => {
                    return (
                      <Select.Option key={item.id} value={item.id}>
                        {`${capitalizeFirstLetter(
                          item.id,
                        )} - ${capitalizeFirstLetter(item.name)}`}
                      </Select.Option>
                    );
                  })}
              </Select>
            </Form.Item>
          ) : (
            <Form.Item
              name="merchantId"
              label={TRANSLATE_KEY.merchant}
              rules={[
                {
                  required: true,
                  message: validateMessages.required(
                    TRANSLATE_KEY.merchant_name,
                  ),
                },
              ]}
            >
              <Input disabled placeholder={TRANSLATE_KEY.merchant} />
            </Form.Item>
          ))}
        <Form.Item
          name="domainName"
          label={TRANSLATE_KEY.domain_name}
          rules={[
            {
              required: true,
              message: validateMessages.required(TRANSLATE_KEY.domain_name),
            },
            {
              min: 5,
              message: validateMessages.stringMinLength(
                TRANSLATE_KEY.domain_name,
                5,
              ),
            },
            {
              max: 50,
              message: validateMessages.stringMaxLength(
                TRANSLATE_KEY.domain_name,
                50,
              ),
            },
            {
              pattern: regexDomainName,
              message: validateMessages.pattern(
                TRANSLATE_KEY.domain_name,
                "'example.com'",
              ),
            },
          ]}
        >
          <Input placeholder="example.com" />
        </Form.Item>
        <Form.Item
          name="type"
          label={TRANSLATE_KEY.type}
          rules={[
            {
              required: true,
              message: validateMessages.required(TRANSLATE_KEY.type),
            },
          ]}
        >
          <Select placeholder={TRANSLATE_KEY.type}>
            {Object.entries(domainType).map(([key, value]) => {
              return (
                <Select.Option key={key} value={key}>
                  {value}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          name="soaEditApi"
          label={TRANSLATE_KEY.soaEditAPI}
          rules={[
            {
              required: true,
              message: validateMessages.required(TRANSLATE_KEY.soaEditAPI),
            },
          ]}
        >
          <Select placeholder={TRANSLATE_KEY.soaEditAPI}>
            {Object.entries(domainSoaEditAPI).map(([key, value]) => {
              return (
                <Select.Option key={key} value={key}>
                  {value}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Space style={{ width: '100%', justifyContent: 'right' }}>
          <Button size="middle" onClick={handleCloseForm}>
            {TRANSLATE_KEY.cancel}
          </Button>
          <ButtonCustom type="success" size="middle" htmlType="submit">
            {TRANSLATE_KEY.create}
          </ButtonCustom>
        </Space>
      </Form>
      <Divider />
      <Row gutter={[16, 16]} style={{ flex: 1, overflowY: 'auto' }}>
        <Layout>
          <Row gutter={[0, 8]}>
            <Col xs={6}>
              <Typography.Text strong>
                {TRANSLATE_KEY.domain_name}
              </Typography.Text>
            </Col>
            <Col xs={18}>
              <Typography.Text>
                Enter your domain name in the format of name.tld (eg.
                powerdns-admin.com). You can also enter sub-domains to create a
                sub-root zone (eg. sub.powerdns-admin.com) in case you want to
                delegate sub-domain management to specific users.
              </Typography.Text>
            </Col>
          </Row>
        </Layout>
        <Layout>
          <Row gutter={[0, 8]}>
            <Col xs={6}>
              <Typography.Text strong>{TRANSLATE_KEY.type}</Typography.Text>
            </Col>
            <Col xs={18}>
              <Typography.Text>
                The type decides how the domain will be replicated across
                multiple DNS servers.
              </Typography.Text>
              <ul>
                <li style={{ marginTop: '4px' }}>
                  <Typography.Text title="secondary">
                    Native - PowerDNS will not perform any replication. Use this
                    if you only have one PowerDNS server or you handle
                    replication via your backend.
                  </Typography.Text>
                </li>
                <li style={{ marginTop: '4px' }}>
                  <Typography.Text title="secondary">
                    Master - This PowerDNS server will serve as the master and
                    will send zone transfers (AXFRs) to other servers configured
                    as slaves.
                  </Typography.Text>
                </li>
                <li style={{ marginTop: '4px' }}>
                  <Typography.Text title="secondary">
                    Slave - This PowerDNS server will serve as the slave and
                    will request and receive zone transfers (AXFRs) from other
                    servers configured as masters.
                  </Typography.Text>
                </li>
              </ul>
            </Col>
          </Row>
        </Layout>
        <Layout>
          <Row gutter={[0, 8]}>
            <Col xs={6}>
              <Typography.Text strong>
                {TRANSLATE_KEY.soaEditAPI}
              </Typography.Text>
            </Col>
            <Col xs={18}>
              <Typography.Text>
                The SOA-EDIT-API setting defines how the SOA serial number will
                be updated after a change is made to the domain.
              </Typography.Text>
              <ul>
                <li style={{ marginTop: '4px' }}>
                  <Typography.Text title="secondary">
                    DEFAULT - Generate a soa serial of YYYYMMDD01. If the
                    current serial is lower than the generated serial, use the
                    generated serial. If the current serial is higher or equal
                    to the generated serial, increase the current serial by 1.
                  </Typography.Text>
                </li>
                <li style={{ marginTop: '4px' }}>
                  <Typography.Text title="secondary">
                    INCREASE - Increase the current serial by 1.
                  </Typography.Text>
                </li>
                <li style={{ marginTop: '4px' }}>
                  <Typography.Text title="secondary">
                    EPOCH - Change the serial to the number of seconds since the
                    EPOCH, aka unixtime.
                  </Typography.Text>
                </li>
                <li style={{ marginTop: '4px' }}>
                  <Typography.Text title="secondary">
                    OFF - Disable automatic updates of the SOA serial.
                  </Typography.Text>
                </li>
              </ul>
            </Col>
          </Row>
        </Layout>
      </Row>
    </Drawer>
  );
};

export default DomainForm;
