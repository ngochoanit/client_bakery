import React, { useEffect } from 'react';
import { Button, Drawer, Form, Input, Modal, Space, Typography } from 'antd';
import { openNotificationWithIcon } from 'src/components/AppNotification';
import TRANSLATE_KEY from 'src/languages/locales/translateKey';
import capitalizeFirstLetter from 'src/utils/capitalizeFirstLetter';
import { difference } from 'src/utils/differenceBetweenTwoObjects';
import { omitIsNil } from 'src/utils/omit';
import isEmpty from 'lodash/isEmpty';
import ButtonCustom from 'antd-button-color';
import { CloseOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { IFormMerchant, IMerchant } from 'src/@types/entities/Merchant';
import { createMerchant, updateMerchant } from 'src/apis/merchant';
import validateMessages from 'src/helpers/validateMessages';
import {
  regexDescription,
  regexEmail,
  regexName,
  regexWhitespaceFirst,
} from 'src/utils/regularExpression';

const { confirm } = Modal;
const MerchantForm = function MerchantForm({
  isOpen,
  merchantSelected,
  onClose,
  updateData,
  total,
  data,
}: {
  isOpen: boolean;
  merchantSelected?: IMerchant;
  onClose: () => void;
  updateData: (dataNew: IMerchant[], totalNew: number) => void;
  total: number;
  data: IMerchant[];
}) {
  const [formMerchant] = Form.useForm<IMerchant>();

  useEffect(() => {
    if (merchantSelected) {
      formMerchant.setFieldsValue(merchantSelected);
    } else {
      formMerchant.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchantSelected]);

  const onFinishUser = async (values: IFormMerchant) => {
    // edit merchant
    if (merchantSelected) {
      const dataChange = difference(values, merchantSelected);
      if (isEmpty(dataChange)) {
        openNotificationWithIcon(
          'warning',
          TRANSLATE_KEY.warning,
          TRANSLATE_KEY.form_not_changed,
        );
      } else {
        const response = await updateMerchant(dataChange as IFormMerchant, {
          merchantId: merchantSelected.id,
        });
        if (response && response.data) {
          const item = response.data;
          const newData = [...data];
          newData[newData.indexOf(merchantSelected)] = item;
          updateData(newData, total);
          openNotificationWithIcon(
            'success',
            TRANSLATE_KEY.notification,
            TRANSLATE_KEY.updated_successfully,
          );
          formMerchant.resetFields();
          onClose();
        }
      }
    }
    // create merchant
    else {
      const response = await createMerchant(omitIsNil(values, { deep: false }));
      if (response && response.data) {
        const item = response.data;
        const newData = [...data];
        newData.unshift(item);
        updateData(newData, total + 1);
        openNotificationWithIcon(
          'success',
          TRANSLATE_KEY.notification,
          TRANSLATE_KEY.created_successfully,
        );
        formMerchant.resetFields();
        onClose();
      }
    }
  };
  const onFinishUserFailed = () => {
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
        formMerchant.resetFields();
        onClose();
      },
    });
  };
  const handleCloseForm = () => {
    const values = formMerchant.getFieldsValue();
    if (merchantSelected) {
      const dataChange = difference(values, merchantSelected);
      if (isEmpty(dataChange)) {
        formMerchant.resetFields();
        onClose();
      } else {
        showConfirmCancel();
      }
    } else if (isEmpty(omitIsNil(values, { deep: false }))) {
      formMerchant.resetFields();
      onClose();
    } else {
      showConfirmCancel();
    }
  };
  return (
    <Drawer
      forceRender
      title={capitalizeFirstLetter(
        merchantSelected
          ? `${TRANSLATE_KEY.edit} ${merchantSelected.id}`
          : `${TRANSLATE_KEY.create} ${TRANSLATE_KEY.merchant}`,
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
          onClick={handleCloseForm}
        />
      }
    >
      <Form
        layout="vertical"
        form={formMerchant}
        validateTrigger="onChange"
        labelAlign="left"
        onFinish={onFinishUser}
        onFinishFailed={onFinishUserFailed}
      >
        <Form.Item
          name="id"
          label={TRANSLATE_KEY.merchant_name}
          rules={[
            {
              required: true,
              message: validateMessages.required(TRANSLATE_KEY.merchant_name),
            },
            {
              max: 50,
              message: validateMessages.stringMaxLength(
                TRANSLATE_KEY.merchant_name,
                50,
              ),
            },
            {
              pattern: regexName,
              message: validateMessages.pattern(
                TRANSLATE_KEY.merchant_name,
                TRANSLATE_KEY.merchantNameMess,
              ),
            },
          ]}
        >
          <Input
            showCount
            maxLength={50}
            disabled={!!merchantSelected}
            placeholder={TRANSLATE_KEY.merchant_name}
          />
        </Form.Item>
        <Form.Item
          name="name"
          label={TRANSLATE_KEY.display_name}
          rules={[
            {
              required: true,
              message: validateMessages.required(TRANSLATE_KEY.display_name),
            },
            {
              max: 50,
              message: validateMessages.stringMaxLength(
                TRANSLATE_KEY.display_name,
                50,
              ),
            },
            {
              pattern: regexWhitespaceFirst,
              message: validateMessages.whitespaceFirst(
                TRANSLATE_KEY.last_name,
              ),
            },
          ]}
        >
          <Input
            showCount
            maxLength={50}
            placeholder={TRANSLATE_KEY.display_name}
          />
        </Form.Item>
        <Form.Item
          name="email"
          label={TRANSLATE_KEY.email}
          rules={[
            {
              required: true,
              message: validateMessages.required(TRANSLATE_KEY.email),
            },
            {
              min: 3,
              message: validateMessages.stringMinLength(TRANSLATE_KEY.email, 3),
            },
            {
              max: 50,
              message: validateMessages.stringMaxLength(
                TRANSLATE_KEY.email,
                50,
              ),
            },
            {
              pattern: regexEmail,
              message: validateMessages.pattern(
                TRANSLATE_KEY.email,
                "'example@domain.com'",
              ),
            },
          ]}
        >
          <Input showCount maxLength={50} placeholder="example@domain.com" />
        </Form.Item>
        <Form.Item
          name="description"
          label={TRANSLATE_KEY.description}
          rules={[
            {
              max: 255,
              message: validateMessages.stringMaxLength(
                TRANSLATE_KEY.description,
                255,
              ),
            },
          ]}
        >
          <Input.TextArea
            showCount
            maxLength={255}
            placeholder={TRANSLATE_KEY.description}
          />
        </Form.Item>
        <Space style={{ width: '100%', justifyContent: 'right' }}>
          <Button size="middle" onClick={handleCloseForm}>
            {TRANSLATE_KEY.cancel}
          </Button>
          <ButtonCustom type="success" size="middle" htmlType="submit">
            {merchantSelected ? TRANSLATE_KEY.update : TRANSLATE_KEY.create}
          </ButtonCustom>
        </Space>
      </Form>
    </Drawer>
  );
};

export default MerchantForm;
