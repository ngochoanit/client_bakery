import React, { useEffect, useState } from 'react';
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
import { IFormUser, TUserInfo } from 'src/@types/entities/User';
import { openNotificationWithIcon } from 'src/components/AppNotification';
import TRANSLATE_KEY from 'src/languages/locales/translateKey';
import capitalizeFirstLetter from 'src/utils/capitalizeFirstLetter';
import { roleMap, roleMapForMerChant } from 'src/utils/define';
import { difference } from 'src/utils/differenceBetweenTwoObjects';
import { omitIsNil } from 'src/utils/omit';
import isEmpty from 'lodash/isEmpty';
import { createUser, updateUser } from 'src/apis/user';
import ButtonCustom from 'antd-button-color';
import {
  CloseOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { useAppSelector } from 'src/redux';
import { IMerchant } from 'src/@types/entities/Merchant';
import { isAdmin } from 'src/helpers';
import validateMessages from 'src/helpers/validateMessages';
import {
  regexEmail,
  regexPassword,
  regexWhitespaceFirst,
} from 'src/utils/regularExpression';
import clsx from 'clsx';
import ROLE from 'src/constants/role';
import AppSelect from 'src/components/AppSelect';

const { confirm } = Modal;
const UserForm = function UserForm({
  isOpen,
  userSelected,
  merchants,
  onClose,
  updateData,
  total,
  data,
}: {
  isOpen: boolean;
  userSelected?: TUserInfo;
  merchants: IMerchant[] | undefined;
  onClose: () => void;
  updateData: (dataNew: TUserInfo[], totalNew: number) => void;
  total: number;
  data: TUserInfo[];
}) {
  const [formUser] = Form.useForm<IFormUser>();
  const userInfo = useAppSelector((s) => s.auth.user);
  const [isVisible, setIsVisible] = useState(false);
  const watchRole = Form.useWatch('role', formUser);

  useEffect(() => {
    if (userSelected) {
      formUser.setFieldsValue(userSelected);
    } else {
      formUser.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSelected]);

  const onFinishUser = async (values: IFormUser) => {
    // edit user
    if (userSelected) {
      const dataChange = difference(values, userSelected);
      if (isEmpty(dataChange)) {
        openNotificationWithIcon(
          'warning',
          TRANSLATE_KEY.warning,
          TRANSLATE_KEY.form_not_changed,
        );
      } else {
        const response = await updateUser(
          omitIsNil(dataChange, { deep: false }),
          {
            userId: userSelected.id,
          },
        );
        if (response && response.data) {
          const item = response.data;
          const newData = [...data];
          newData[newData.indexOf(userSelected)] = item;
          updateData(newData, total);
          openNotificationWithIcon(
            'success',
            TRANSLATE_KEY.notification,
            TRANSLATE_KEY.updated_successfully,
          );
          formUser.resetFields();
          onClose();
        }
      }
    }
    // createUser
    else {
      const response = await createUser(omitIsNil(values, { deep: false }));
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
        formUser.resetFields();
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
        formUser.resetFields();
        onClose();
      },
    });
  };
  const handleCloseForm = () => {
    const values = formUser.getFieldsValue();
    if (userSelected) {
      const dataChange = difference(values, userSelected);
      if (isEmpty(dataChange)) {
        formUser.resetFields();
        onClose();
      } else {
        showConfirmCancel();
      }
    } else if (isEmpty(omitIsNil(values, { deep: false }))) {
      formUser.resetFields();
      onClose();
    } else {
      showConfirmCancel();
    }
  };
  return (
    <Drawer
      forceRender
      title={
        userSelected
          ? `${TRANSLATE_KEY.edit} ${userSelected.email}`
          : `${TRANSLATE_KEY.create} ${TRANSLATE_KEY.user}`
      }
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
        form={formUser}
        validateTrigger="onChange"
        labelAlign="left"
        onFinish={onFinishUser}
        onFinishFailed={onFinishUserFailed}
      >
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
        {!userSelected && (
          <Form.Item
            name="password"
            label={TRANSLATE_KEY.password}
            rules={[
              {
                required: true,
                message: validateMessages.required(TRANSLATE_KEY.password),
              },
              {
                min: 6,
                message: validateMessages.stringMinLength(
                  TRANSLATE_KEY.password,
                  6,
                ),
              },
              {
                max: 18,
                message: validateMessages.stringMaxLength(
                  TRANSLATE_KEY.password,
                  18,
                ),
              },
              {
                pattern: regexPassword,
                message: validateMessages.pattern(
                  TRANSLATE_KEY.password,
                  TRANSLATE_KEY.invalidPassword,
                ),
              },
            ]}
          >
            <Input
              name="new-password"
              autoComplete="new-password"
              type={isVisible ? 'text' : 'password'}
              showCount
              maxLength={18}
              suffix={
                <div
                  className={clsx(isVisible && 'color-active')}
                  style={{ cursor: 'pointer' }}
                  onMouseDown={() => {
                    setIsVisible(true);
                  }}
                  onMouseUp={() => {
                    setIsVisible(false);
                  }}
                >
                  <EyeOutlined />
                </div>
              }
              placeholder={TRANSLATE_KEY.password}
            />
          </Form.Item>
        )}
        <Form.Item
          name="lastName"
          label={TRANSLATE_KEY.last_name}
          rules={[
            {
              required: true,
              message: validateMessages.required(TRANSLATE_KEY.last_name),
            },
            {
              max: 50,
              message: validateMessages.stringMaxLength(
                TRANSLATE_KEY.last_name,
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
            placeholder={TRANSLATE_KEY.last_name}
          />
        </Form.Item>
        <Form.Item
          name="firstName"
          label={TRANSLATE_KEY.first_name}
          rules={[
            {
              required: true,
              message: validateMessages.required(TRANSLATE_KEY.first_name),
            },
            {
              max: 50,
              message: validateMessages.stringMaxLength(
                TRANSLATE_KEY.first_name,
                50,
              ),
            },
            {
              pattern: regexWhitespaceFirst,
              message: validateMessages.whitespaceFirst(
                TRANSLATE_KEY.first_name,
              ),
            },
          ]}
        >
          <Input
            showCount
            maxLength={50}
            placeholder={capitalizeFirstLetter(
              `${TRANSLATE_KEY.input} ${TRANSLATE_KEY.first_name}`,
            )}
          />
        </Form.Item>
        {userInfo && isAdmin(userInfo.role) ? (
          <Form.Item
            name="role"
            label={TRANSLATE_KEY.role}
            rules={[
              {
                required: true,
                message: validateMessages.required(TRANSLATE_KEY.role),
              },
            ]}
          >
            <AppSelect
              dropdownMatchSelectWidth={false}
              placeholder={TRANSLATE_KEY.role}
            >
              {Object.entries(roleMap).map(([key, value]) => {
                return (
                  <Select.Option key={key} value={key}>
                    {value}
                  </Select.Option>
                );
              })}
            </AppSelect>
          </Form.Item>
        ) : (
          <Form.Item
            name="role"
            label={TRANSLATE_KEY.role}
            rules={[
              {
                required: true,
                message: validateMessages.required(TRANSLATE_KEY.role),
              },
            ]}
          >
            <AppSelect placeholder={TRANSLATE_KEY.role}>
              {Object.entries(roleMapForMerChant).map(([key, value]) => {
                return (
                  <Select.Option key={key} value={key}>
                    {value}
                  </Select.Option>
                );
              })}
            </AppSelect>
          </Form.Item>
        )}

        {userInfo &&
          isAdmin(userInfo.role) &&
          watchRole &&
          !(watchRole === ROLE.ADMIN) && (
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
              <AppSelect placeholder={TRANSLATE_KEY.merchant}>
                {merchants &&
                  merchants.length > 0 &&
                  merchants.map((item) => {
                    return (
                      <Select.Option key={item.id} value={item.id}>
                        {capitalizeFirstLetter(item.id)}
                      </Select.Option>
                    );
                  })}
              </AppSelect>
            </Form.Item>
          )}

        <Space style={{ width: '100%', justifyContent: 'right' }}>
          <Button size="middle" onClick={handleCloseForm}>
            {TRANSLATE_KEY.cancel}
          </Button>
          <ButtonCustom type="success" size="middle" htmlType="submit">
            {userSelected ? TRANSLATE_KEY.update : TRANSLATE_KEY.create}
          </ButtonCustom>
        </Space>
      </Form>
    </Drawer>
  );
};

export default UserForm;
