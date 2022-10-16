import React, { useEffect } from 'react';
import {
  Button,
  Drawer,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Typography,
} from 'antd';
import TRANSLATE_KEY from 'src/languages/locales/translateKey';
import capitalizeFirstLetter from 'src/utils/capitalizeFirstLetter';
import { citiesMap, countriesMap, ispMap } from 'src/utils/define';
import ButtonCustom from 'antd-button-color';
import isEmpty from 'lodash/isEmpty';
import { CloseOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { IFormServer, IServer } from 'src/@types/entities/Server';
import { openNotificationWithIcon } from 'src/components/AppNotification';
import { useParams } from 'react-router';
import { createServer, updateServer } from 'src/apis/server';
import { difference } from 'src/utils/differenceBetweenTwoObjects';
import AppSelect from 'src/components/AppSelect';
import validateMessages from 'src/helpers/validateMessages';
import { regexIpv4 } from 'src/utils/regularExpression';

const { confirm } = Modal;
const ServerForm = function ServerForm({
  isOpen,
  serverSelected,
  onClose,
  updateData,
  total,
  data,
}: {
  isOpen: boolean;
  serverSelected?: IServer;
  onClose: () => void;
  updateData: (newData: IServer[], totalNew: number) => void;
  total: number;
  data: IServer[];
}) {
  const [formServer] = Form.useForm<IFormServer>();
  const { domainId = '', domainName = '', merchantId = '' } = useParams();
  const countryWatch = Form.useWatch('country', formServer);
  const valueInit = {
    publicIp: undefined,
    privateIp: undefined,
    country: undefined,
    region: undefined,
    isp: undefined,
  };
  useEffect(() => {
    if (serverSelected) {
      formServer.setFieldsValue(serverSelected);
    } else {
      formServer.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverSelected]);

  const onFinish = async (values: IFormServer) => {
    // edit server
    if (serverSelected) {
      const dataChange = difference(values, serverSelected);
      if (isEmpty(dataChange)) {
        openNotificationWithIcon(
          'warning',
          'Warning',
          `${TRANSLATE_KEY.form_not_changed}`,
        );
      } else {
        const response = await updateServer(dataChange as IFormServer, {
          domainId,
          serverId: serverSelected?.id,
        });
        if (response && response.data) {
          const item = response.data;
          const newData = [...data];
          newData[newData.indexOf(serverSelected)] = item;
          updateData(newData, total);
          openNotificationWithIcon(
            'success',
            'Notification',
            `${TRANSLATE_KEY.updated_successfully}`,
          );
          formServer.resetFields();
        }
        onClose();
      }
    }
    // create record
    else {
      const response = await createServer(
        { ...values, merchantId },
        {
          domainId,
        },
      );
      if (response && response.data) {
        const item = response.data;
        const newData = [...data];
        newData.unshift(item);
        updateData(newData, total + 1);
        openNotificationWithIcon(
          'success',
          'Notification',
          `${TRANSLATE_KEY.created_successfully}`,
        );
        formServer.resetFields();
      }
      onClose();
    }
  };
  const onFinishFailed = () => {
    openNotificationWithIcon(
      'warning',
      'Warning',
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
        formServer.resetFields();
        onClose();
      },
    });
  };
  const handleCloseForm = () => {
    const values = formServer.getFieldsValue();

    if (serverSelected) {
      const dataChange = difference(values, serverSelected);
      if (isEmpty(dataChange)) {
        formServer.resetFields();
        onClose();
      } else {
        showConfirmCancel();
      }
    } else if (isEmpty(difference(values, valueInit))) {
      formServer.resetFields();
      onClose();
    } else {
      showConfirmCancel();
    }
  };
  return (
    <Drawer
      title={capitalizeFirstLetter(
        serverSelected
          ? `${TRANSLATE_KEY.edit} ${serverSelected.publicIp}`
          : `${TRANSLATE_KEY.add} ${TRANSLATE_KEY.server} for ${domainName}`,
      )}
      closable={false}
      onClose={handleCloseForm}
      visible={isOpen}
      bodyStyle={{ paddingBottom: 80 }}
      extra={
        <ButtonCustom
          type="danger"
          icon={<CloseOutlined />}
          size="small"
          onClick={handleCloseForm}
        />
      }
    >
      <Form
        layout="vertical"
        initialValues={valueInit}
        form={formServer}
        labelAlign="left"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label={TRANSLATE_KEY.merchant}
          rules={[
            {
              required: true,
              message: validateMessages.required(TRANSLATE_KEY.merchant),
            },
          ]}
        >
          <Input
            disabled
            placeholder={TRANSLATE_KEY.merchant}
            value={merchantId}
          />
        </Form.Item>
        <Form.Item
          name="publicIp"
          label={TRANSLATE_KEY.public_ip}
          rules={[
            {
              required: true,
              message: validateMessages.required(TRANSLATE_KEY.public_ip),
            },
            {
              pattern: regexIpv4,
              message: validateMessages.pattern(
                TRANSLATE_KEY.public_ip,
                'ipv4',
              ),
            },
          ]}
        >
          <Input placeholder={TRANSLATE_KEY.public_ip} />
        </Form.Item>
        <Form.Item
          name="privateIp"
          label={TRANSLATE_KEY.private_ip}
          rules={[
            {
              required: true,
              message: validateMessages.required(TRANSLATE_KEY.private_ip),
            },
            {
              pattern: regexIpv4,
              message: validateMessages.pattern(
                TRANSLATE_KEY.private_ip,
                'ipv4',
              ),
            },
          ]}
        >
          <Input placeholder={TRANSLATE_KEY.private_ip} />
        </Form.Item>
        <Form.Item
          name="country"
          label={TRANSLATE_KEY.country}
          rules={[
            {
              required: true,
              message: validateMessages.required(TRANSLATE_KEY.country),
            },
          ]}
        >
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
            onChange={(value: string) => {
              if (value !== 'VN') {
                formServer.setFieldValue('region', '');
                formServer.setFieldValue('isp', '');
              }
            }}
          >
            {Object.entries(countriesMap).map(([key, value]) => {
              return (
                <Select.Option key={key} value={key}>
                  {value}
                </Select.Option>
              );
            })}
          </AppSelect>
        </Form.Item>
        <Form.Item name="region" label={`${TRANSLATE_KEY.region}`}>
          <AppSelect
            dropdownMatchSelectWidth={false}
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
            placeholder={TRANSLATE_KEY.region}
          >
            <Select.Option key={TRANSLATE_KEY.any} value="">
              {TRANSLATE_KEY.any}
            </Select.Option>
            {Object.entries(citiesMap).map(([key, value]) => {
              return (
                <Select.Option key={key} value={key}>
                  {value}
                </Select.Option>
              );
            })}
          </AppSelect>
        </Form.Item>
        <Form.Item name="isp" label={`${TRANSLATE_KEY.isp}`}>
          <AppSelect
            dropdownMatchSelectWidth={false}
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
            placeholder={TRANSLATE_KEY.isp}
          >
            <Select.Option key={TRANSLATE_KEY.any} value="">
              {TRANSLATE_KEY.any}
            </Select.Option>
            {Object.entries(ispMap).map(([key, value]) => {
              return (
                <Select.Option key={key} value={key}>
                  {value}
                </Select.Option>
              );
            })}
          </AppSelect>
        </Form.Item>
        <Space style={{ width: '100%', justifyContent: 'right' }}>
          <Button size="middle" onClick={handleCloseForm}>
            {TRANSLATE_KEY.cancel}
          </Button>
          <ButtonCustom type="success" size="middle" htmlType="submit">
            {serverSelected ? TRANSLATE_KEY.update : TRANSLATE_KEY.create}
          </ButtonCustom>
        </Space>
      </Form>
    </Drawer>
  );
};

export default ServerForm;
