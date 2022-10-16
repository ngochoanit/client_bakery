import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Empty,
  Form,
  Modal,
  Select,
  Space,
  Typography,
} from 'antd';
import { useParams } from 'react-router';
import {
  ITrafficFlow,
  TTrafficFlowForm,
} from 'src/@types/entities/TrafficFlow';
import capitalizeFirstLetter from 'src/utils/capitalizeFirstLetter';
import TRANSLATE_KEY from 'src/languages/locales/translateKey';
import { trafficFlowTypeMap, trafficFlowValueMap } from 'src/utils/define';
import ButtonCustom from 'antd-button-color';
import {
  CloseOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import clsx from 'clsx';
import { openNotificationWithIcon } from 'src/components/AppNotification';
import { updateTrafficFlow } from 'src/apis/trafficFlow';
import { generateArray } from 'src/utils/generateArray';
import { isUser } from 'src/helpers';
import { useAppSelector } from 'src/redux';
import AppSelect from 'src/components/AppSelect';
import './index.less';
import { difference } from 'src/utils/differenceBetweenTwoObjects';
import { isEmpty } from 'lodash';

const { confirm } = Modal;
const prefixCls = 'traffic-flow';
const TrafficFlowForm = function TrafficFlowForm({
  trafficFlowSelected,
  isOpen,
  onClose,
  updateData,
  total,
  data,
}: {
  trafficFlowSelected?: ITrafficFlow;
  isOpen: boolean;
  onClose: () => void;
  updateData: (newData: ITrafficFlow[], totalNew: number) => void;
  total: number;
  data: ITrafficFlow[];
}) {
  const { domainName = '' } = useParams();
  const userInfo = useAppSelector((s) => s.auth.user);
  const [formTrafficFlow] = Form.useForm<TTrafficFlowForm>();
  const [algorithms, setAlgorithms] = useState<{ [key: string]: string }>(
    trafficFlowValueMap,
  );
  const watchValue = Form.useWatch('value', formTrafficFlow);
  const [addIndex, setAddIndex] = useState(0);

  useEffect(() => {
    if (trafficFlowSelected) {
      formTrafficFlow.setFieldsValue({ ...trafficFlowSelected });
    } else {
      formTrafficFlow.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trafficFlowSelected]);

  useEffect(() => {
    if (watchValue && watchValue.length > 0) {
      const index = watchValue.findIndex((item: string | undefined) => {
        return item === 'round_robin' || item === 'weighted';
      });
      setAddIndex(index);
      const after = watchValue.slice(0, index + 1);
      if (index !== -1) {
        formTrafficFlow.setFieldValue('value', after);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchValue]);

  const onFinish = async (values: TTrafficFlowForm) => {
    // edit record
    if (trafficFlowSelected) {
      if (values.value[values.value.length - 1] === 'round_robin') {
        const response = await updateTrafficFlow(values, {
          domainName,
          trafficFlowId: trafficFlowSelected.id,
        });
        if (response && response.data) {
          const item = response.data;
          const newData = [...data];
          newData[newData.indexOf(trafficFlowSelected)] = item;
          updateData(newData, total);
          openNotificationWithIcon(
            'success',
            'Notification',
            `${TRANSLATE_KEY.updated_successfully}`,
          );
          formTrafficFlow.resetFields();
        }
        onClose();
      } else {
        openNotificationWithIcon(
          'warning',
          'Warning',
          `${TRANSLATE_KEY.traffic_flow_error}`,
        );
      }
    } else {
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
        formTrafficFlow.resetFields();
        onClose();
      },
    });
  };
  const handleCloseForm = () => {
    const values = formTrafficFlow.getFieldsValue();
    if (trafficFlowSelected) {
      const dataChange = difference(values, trafficFlowSelected);
      if (isEmpty(dataChange)) {
        formTrafficFlow.resetFields();
        onClose();
      } else {
        showConfirmCancel();
      }
    }
  };
  return (
    <Modal
      title={
        <Space
          style={{
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography.Title level={5}>
            {trafficFlowSelected
              ? `${TRANSLATE_KEY.edit} record type ${trafficFlowSelected.recordType}`
              : `${TRANSLATE_KEY.create} ${TRANSLATE_KEY.traffic_flow} for ${domainName}`}
          </Typography.Title>
          <ButtonCustom
            type="danger"
            icon={<CloseOutlined />}
            size="small"
            onClick={handleCloseForm}
          />
        </Space>
      }
      forceRender
      centered
      closable={false}
      visible={isOpen}
      okText={trafficFlowSelected ? TRANSLATE_KEY.update : TRANSLATE_KEY.create}
      onCancel={handleCloseForm}
      width={1200}
      className={prefixCls}
      footer={
        <Space>
          <Button size="middle" onClick={handleCloseForm}>
            {TRANSLATE_KEY.cancel}
          </Button>
          <ButtonCustom
            disabled={isUser(userInfo?.role)}
            type="success"
            size="middle"
            htmlType="submit"
            onClick={() => formTrafficFlow.submit()}
          >
            {TRANSLATE_KEY.update}
          </ButtonCustom>
        </Space>
      }
    >
      <div className="traffic-flow-form">
        {trafficFlowSelected ? (
          <Form
            form={formTrafficFlow}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Card
              className={clsx('form-card-item', 'form-item-record-type')}
              size="small"
              title={
                <Typography.Title level={5}>
                  {TRANSLATE_KEY.record_type}
                </Typography.Title>
              }
            >
              <Form.Item name="recordType">
                <AppSelect
                  dropdownMatchSelectWidth={false}
                  placeholder={TRANSLATE_KEY.type}
                >
                  {Object.entries(trafficFlowTypeMap).map(([key, value]) => {
                    return (
                      <Select.Option key={key} value={key}>
                        {value}
                      </Select.Option>
                    );
                  })}
                </AppSelect>
              </Form.Item>
            </Card>
            <Form.List name="value">
              {(fields, { add, remove }) => (
                <div className="form-list-container">
                  <div
                    className={clsx('first-button-container', 'flex-center')}
                  >
                    <ButtonCustom
                      size="middle"
                      type="success"
                      shape="circle"
                      onClick={() => {
                        return formTrafficFlow.setFieldValue('value', [
                          undefined,
                          ...watchValue,
                        ]);
                      }}
                      icon={<PlusOutlined />}
                    />
                  </div>
                  {fields.map((field, index) => {
                    return (
                      <div
                        className={clsx('form-list-item', 'flex-center')}
                        key={field.key}
                      >
                        <div className="line" />
                        <Card
                          size="small"
                          title={
                            <Typography.Title level={5}>
                              {TRANSLATE_KEY.algorithm}
                            </Typography.Title>
                          }
                          extra={
                            <CloseOutlined
                              onClick={() =>
                                remove(generateArray(index, fields.length))
                              }
                            />
                          }
                          className="form-card-item"
                        >
                          <Form.Item {...field}>
                            <Select
                              placeholder={capitalizeFirstLetter(
                                `${TRANSLATE_KEY.pleaseSelect} ${TRANSLATE_KEY.type}`,
                              )}
                            >
                              {Object.entries(algorithms).map(
                                ([keyItem, value]) => {
                                  return (
                                    <Select.Option
                                      key={keyItem}
                                      value={keyItem}
                                    >
                                      {value}
                                    </Select.Option>
                                  );
                                },
                              )}
                            </Select>
                          </Form.Item>
                        </Card>

                        <div className="line" />
                        <ButtonCustom
                          disabled={index === addIndex}
                          size="middle"
                          type="success"
                          shape="circle"
                          onClick={() => add(undefined, index + 1)}
                          icon={<PlusOutlined />}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </Form.List>
          </Form>
        ) : (
          <Empty />
        )}
      </div>
    </Modal>
  );
};

export default TrafficFlowForm;
