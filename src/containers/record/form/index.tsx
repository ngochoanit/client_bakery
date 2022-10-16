import React, { useEffect } from 'react';
import {
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Typography,
} from 'antd';
import { IFormRecord, IRecord } from 'src/@types/entities/Record';
import TRANSLATE_KEY from 'src/languages/locales/translateKey';
import capitalizeFirstLetter from 'src/utils/capitalizeFirstLetter';
import { recordType, statusMap } from 'src/utils/define';
import { openNotificationWithIcon } from 'src/components/AppNotification';
import { createRecord, updateRecord } from 'src/apis/record';
import ButtonCustom from 'antd-button-color';
import { CloseOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useParams } from 'react-router';
import STATUS from 'src/constants/status';
import RECORD_TYPE from 'src/constants/recordType';
import validateMessages from 'src/helpers/validateMessages';
import { regexNumber, regexRecordName } from 'src/utils/regularExpression';
import AppSelect from 'src/components/AppSelect';
import { difference } from 'src/utils/differenceBetweenTwoObjects';
import { isEmpty } from 'lodash';

const { confirm } = Modal;
const RecordForm = function RecordForm({
  isOpen,
  server,
  recordSelected,
  onClose,
  updateData,
  total,
  data,
}: {
  isOpen: boolean;
  server?: { [key: number]: string };
  recordSelected?: IRecord;
  onClose: () => void;
  updateData: (newData: IRecord[], totalNew: number) => void;
  total: number;
  data: IRecord[];
}) {
  const [formRecord] = Form.useForm<IFormRecord>();
  const typeWatch = Form.useWatch('type', formRecord);
  const { domainId = '', domainName = '', merchantId = '' } = useParams();
  const valueInit = {
    merchantId,
    ttl: 86400,
    name: '',
    status: STATUS.ACTIVE,
    type: RECORD_TYPE.A,
    content: [],
  };

  useEffect(() => {
    if (recordSelected) {
      formRecord.setFieldsValue({ ...recordSelected });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordSelected]);
  const onFinishRecord = async (values: IFormRecord) => {
    // edit record
    const newValues: IFormRecord = { ...values };
    if (typeWatch !== RECORD_TYPE.A) {
      if (!Array.isArray(newValues.content)) {
        newValues.content = [newValues.content];
      }
    }
    if (recordSelected) {
      delete newValues.merchantId;
      const response = await updateRecord(newValues, {
        domainId,
        recordId: recordSelected?.id,
      });
      if (response && response.data) {
        const item = response.data;
        const newData = [...data];
        newData[newData.indexOf(recordSelected)] = item;
        updateData(newData, total);
        openNotificationWithIcon(
          'success',
          TRANSLATE_KEY.notification,
          TRANSLATE_KEY.request_is_being_processed,
        );
        formRecord.resetFields();
        onClose();
      }
    }
    // create record
    else {
      const response = await createRecord(
        { ...newValues },
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
          `${TRANSLATE_KEY.request_is_being_processed}`,
        );
        formRecord.resetFields();
      }
      onClose();
    }
  };
  const onFinishRecordFailed = () => {
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
        formRecord.resetFields();
        onClose();
      },
    });
  };
  const handleCloseForm = () => {
    const values = formRecord.getFieldsValue();
    if (recordSelected) {
      const dataChange = difference(values, recordSelected);
      if (isEmpty(dataChange)) {
        formRecord.resetFields();
        onClose();
      } else {
        showConfirmCancel();
      }
    } else {
      const dataChange = difference(values, valueInit);
      if (isEmpty(dataChange)) {
        formRecord.resetFields();
        onClose();
      } else {
        showConfirmCancel();
      }
    }
  };
  return (
    <Drawer
      title={capitalizeFirstLetter(
        recordSelected
          ? `${TRANSLATE_KEY.edit} ${recordSelected.name}`
          : `${TRANSLATE_KEY.create} ${TRANSLATE_KEY.record} for ${domainName}`,
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
        form={formRecord}
        validateTrigger="onChange"
        labelAlign="left"
        onFinish={onFinishRecord}
        onFinishFailed={onFinishRecordFailed}
      >
        <Form.Item
          name="merchantId"
          label={TRANSLATE_KEY.merchant}
          rules={[
            {
              required: true,
              message: validateMessages.required(TRANSLATE_KEY.merchant),
            },
          ]}
        >
          <Input
            value={recordSelected?.merchantId}
            disabled
            placeholder={TRANSLATE_KEY.merchant}
          />
        </Form.Item>
        <Form.Item
          name="name"
          label={TRANSLATE_KEY.record_name}
          rules={[
            {
              pattern: regexRecordName,
              message: validateMessages.default(TRANSLATE_KEY.record_name),
            },
            {
              max: 50,
              message: validateMessages.stringMaxLength(
                TRANSLATE_KEY.record_name,
                50,
              ),
            },
          ]}
        >
          <Input
            showCount
            maxLength={50}
            placeholder={TRANSLATE_KEY.record_name}
          />
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
          <AppSelect
            dropdownMatchSelectWidth={false}
            placeholder={TRANSLATE_KEY.type}
            onSelect={() => {
              formRecord.setFieldValue('content', undefined);
            }}
          >
            {Object.entries(recordType).map(([key, value]) => {
              return (
                <Select.Option key={key} value={key}>
                  {value}
                </Select.Option>
              );
            })}
          </AppSelect>
        </Form.Item>
        <Form.Item
          name="ttl"
          label={TRANSLATE_KEY.ttl}
          rules={[
            {
              required: true,
              message: validateMessages.required(TRANSLATE_KEY.ttl),
            },
            {
              pattern: regexNumber,
              message: validateMessages.default(TRANSLATE_KEY.ttl),
            },
            () => ({
              validator(_, value: number) {
                if (value >= 0 && value <= 604800) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    validateMessages.numberRange(TRANSLATE_KEY.ttl, 0, 604800),
                  ),
                );
              },
            }),
          ]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="status"
          label={TRANSLATE_KEY.status}
          rules={[
            {
              required: true,
              message: validateMessages.required(TRANSLATE_KEY.status),
            },
          ]}
        >
          <AppSelect
            dropdownMatchSelectWidth={false}
            placeholder={TRANSLATE_KEY.status}
          >
            {Object.entries(statusMap).map(([key, value]) => {
              return (
                <Select.Option key={key} value={key}>
                  {value}
                </Select.Option>
              );
            })}
          </AppSelect>
        </Form.Item>
        <Form.Item
          name="content"
          label={TRANSLATE_KEY.content}
          rules={[
            {
              required: true,
              message: validateMessages.required(TRANSLATE_KEY.content),
            },
          ]}
        >
          {typeWatch === RECORD_TYPE.A ? (
            <AppSelect
              dropdownMatchSelectWidth={false}
              placeholder={TRANSLATE_KEY.content}
              mode="multiple"
              style={{ width: '100%' }}
            >
              {server &&
                Object.entries(server).map(([key, value]) => {
                  return (
                    <Select.Option key={key} value={Number(key)}>
                      {value}
                    </Select.Option>
                  );
                })}
            </AppSelect>
          ) : (
            <Input.TextArea
              showCount
              maxLength={50}
              placeholder={TRANSLATE_KEY.content}
            />
          )}
        </Form.Item>

        <Space style={{ width: '100%', justifyContent: 'right' }}>
          <Button size="middle" onClick={handleCloseForm}>
            {TRANSLATE_KEY.cancel}
          </Button>
          <ButtonCustom type="success" size="middle" htmlType="submit">
            {recordSelected ? TRANSLATE_KEY.update : TRANSLATE_KEY.create}
          </ButtonCustom>
        </Space>
      </Form>
    </Drawer>
  );
};

export default RecordForm;
