import React, { useEffect, useState } from 'react';
import { Col, Form, Grid, Input, Row, Spin, Typography } from 'antd';
import SwipeableViews from 'react-swipeable-views';
import TRANSLATE_KEY from 'src/languages/locales/translateKey';
import IMAGES from 'src/constants/images';
import { EyeOutlined, KeyOutlined, MailOutlined } from '@ant-design/icons';
import { openNotificationWithIcon } from 'src/components/AppNotification';
import { apiLogin, getUserInfo } from 'src/apis/auth';
import { useAppDispatch, useAppSelector } from 'src/redux';
import {
  saveAccessToken,
  saveUserId,
  saveUserInfo,
} from 'src/redux/slices/authSlice';
import { createMemoryHistory } from 'history';
import { useNavigate } from 'react-router-dom';
import ROUTE from 'src/constants/route';
import { getLocalForageItem } from 'src/utils/localForage';
import LOCAL_FORAGE_KEY from 'src/constants/localForageKey';
import { LFUserInfo } from 'src/@types/localForage/userInfo';
import { requestForgotPassword } from 'src/apis/forgotPassword';
import clsx from 'clsx';
import Button from 'antd-button-color';
import validateMessages from 'src/helpers/validateMessages';
import { regexEmail } from 'src/utils/regularExpression';
import './index.less';

interface TFormLogin {
  email: string;
  password: string;
}

interface TFormForgotPassword {
  email: string;
}

const prefixCls = 'app-auth';
const { useBreakpoint } = Grid;

const Login = function Login() {
  const screens = useBreakpoint();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [formLogin] = Form.useForm<TFormLogin>();
  const [formForgotPassword] = Form.useForm<TFormForgotPassword>();
  const user = useAppSelector((s) => s.auth.user);
  const history = createMemoryHistory();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (user) {
      if (history.index === 0) {
        navigate(ROUTE.HOME);
      } else {
        history.back();
      }
    }
  }, [history, navigate, user]);

  useEffect(() => {
    const getUser = async () => {
      const uInfo = await getLocalForageItem<LFUserInfo>(
        LOCAL_FORAGE_KEY.USER_INFO,
      );
      if (uInfo) {
        dispatch(saveUserId(uInfo.userId));
        dispatch(saveAccessToken(uInfo.accessToken));
        const result = await getUserInfo({ userId: uInfo.userId });
        if (result) {
          dispatch(saveUserInfo(result.data));
        }
      }
    };
    getUser();
  }, [dispatch]);

  const onFinishLogin = async (values: any) => {
    setIsLoading(true);
    const result = await apiLogin({
      ...values,
    });
    if (result && result.data) {
      // setLocalForageItem(LOCAL_FORAGE_KEY.USER_INFO, result.data);
      dispatch(saveAccessToken(result.data.accessToken));
      // dispatch(saveUrl(result.data.url));
      const u = await getUserInfo({ userId: result.data.userId });
      if (u && u.data) {
        dispatch(saveUserInfo(u.data));
      }
    }
    setIsLoading(false);
  };

  const onFinishLoginFailed = () => {
    openNotificationWithIcon(
      'warning',
      'Warning',
      TRANSLATE_KEY.checkFieldsForm,
    );
  };

  const onFinishForgotPassword = async (values: TFormForgotPassword) => {
    setIsLoading(true);
    const result = await requestForgotPassword({ ...values });
    if (result) {
      openNotificationWithIcon(
        'success',
        TRANSLATE_KEY.forgot_password,
        `We have sent a link to your email. Please check your email and follow the instructions.`,
      );
      setTab(0);
    }
    setIsLoading(false);
  };

  const onFinishForgotPasswordFailed = () => {
    openNotificationWithIcon(
      'warning',
      'Warning',
      TRANSLATE_KEY.checkFieldsForm,
    );
  };

  const handleChangeIndex = (index: number) => {
    setTab(index);
  };

  return (
    <Row className={prefixCls} justify="space-around" align="middle">
      <Col xxl={12} xl={14} lg={18} md={20} xs={20}>
        <Spin size="large" spinning={isLoading} delay={500} tip="Loading...">
          <section
            className={`${prefixCls}-body`}
            style={{ flexDirection: screens.md ? 'row' : 'column' }}
          >
            <div
              className={`${prefixCls}-intro`} //  padding: screens.md ? 32 : 16,
              style={{
                padding: screens.md ? 32 : 16,
                backgroundImage: `url("${IMAGES.auth_bg}")`,
              }}
            >
              <Typography.Title
                level={1}
                className={`${prefixCls}-intro-header`}
                style={{ fontWeight: '400', margin: 0 }}
              >
                {TRANSLATE_KEY.login_welcome}
              </Typography.Title>
            </div>
            <div
              className={`${prefixCls}-form`}
              style={{ padding: screens.md ? 32 : 16 }}
            >
              <div className={`${prefixCls}-form-title`}>
                <Typography.Title
                  level={2}
                  className={`${prefixCls}-form-header`}
                  style={{ fontWeight: '300', margin: 0 }}
                >
                  {tab === 0 ? TRANSLATE_KEY.login : TRANSLATE_KEY.recovery}
                </Typography.Title>
                <img
                  alt="PowerDNS"
                  src={IMAGES.logo}
                  className={`${prefixCls}-form-logo`}
                />
              </div>
              <div className={`${prefixCls}-form-wrap`}>
                <SwipeableViews
                  axis="x"
                  index={tab}
                  onChangeIndex={handleChangeIndex}
                  style={{ margin: screens.md ? '0px -32px' : '0px -16px' }}
                >
                  <Form
                    form={formLogin}
                    name="login"
                    layout="vertical"
                    autoComplete="on"
                    validateTrigger="onChange"
                    onFinish={onFinishLogin}
                    onFinishFailed={onFinishLoginFailed}
                    className={`${prefixCls}-form-content`}
                    style={{
                      padding: screens.md ? '0px 32px 32px' : '0px 16px 16px',
                    }}
                  >
                    <Form.Item
                      label={
                        <Typography.Text
                          style={{ fontWeight: '600', margin: 0 }}
                        >
                          {TRANSLATE_KEY.email}
                        </Typography.Text>
                      }
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: validateMessages.required(
                            TRANSLATE_KEY.email,
                          ),
                        },
                        {
                          min: 3,
                          message: validateMessages.stringMinLength(
                            TRANSLATE_KEY.email,
                            3,
                          ),
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
                      <Input
                        prefix={<MailOutlined />}
                        placeholder="example@domain.com"
                      />
                    </Form.Item>
                    <Form.Item
                      label={
                        <Typography.Text
                          style={{ fontWeight: '600', margin: 0 }}
                        >
                          {TRANSLATE_KEY.password}
                        </Typography.Text>
                      }
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: validateMessages.required(
                            TRANSLATE_KEY.password,
                          ),
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
                      ]}
                    >
                      <Input
                        type={isVisible ? 'text' : 'password'}
                        prefix={<KeyOutlined />}
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
                    <Form.Item>
                      <Button
                        type="primary"
                        block
                        shape="round"
                        size="large"
                        htmlType="submit"
                      >
                        {TRANSLATE_KEY.login}
                      </Button>
                    </Form.Item>
                    {/* <div className={`${prefixCls}-form-forgot-password`}>
                      <Button type="link" onClick={() => setTab(1)}>
                        Forgot Password
                      </Button>
                    </div> */}
                  </Form>
                  {/* <Form
                    form={formForgotPassword}
                    name="login"
                    layout="vertical"
                    autoComplete="on"
                    validateTrigger="onBlur"
                    onFinish={onFinishForgotPassword}
                    onFinishFailed={onFinishForgotPasswordFailed}
                    className={`${prefixCls}-form-content`}
                    style={{
                      padding: screens.md ? '0px 32px 32px' : '0px 16px 16px',
                    }}
                  >
                    <Typography.Text
                      italic
                      style={{ marginBottom: 24, display: 'inline-block' }}
                    >
                      Enter the email address you used when you joined and
                      we&#39;ll send you a link to reset your password
                    </Typography.Text>
                    <Form.Item
                      label={
                        <Typography.Text
                          style={{ fontWeight: '600', margin: 0 }}
                        >
                          Email
                        </Typography.Text>
                      }
                      name="email"
                      rules={[
                        { required: true, message: TRANSLATE_KEY.input_email },
                        {
                          pattern:
                            // eslint-disable-next-line no-useless-escape
                            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                          message: TRANSLATE_KEY.invalid_email,
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        prefix={<MailOutlined />}
                        placeholder="abc@xyz.com"
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        block
                        shape="round"
                        size="large"
                        htmlType="submit"
                      >
                        Send
                      </Button>
                    </Form.Item>
                    <div className={`${prefixCls}-form-forgot-password`}>
                      <Button type="link" onClick={() => setTab(0)}>
                        Go to login
                      </Button>
                    </div>
                  </Form> */}
                </SwipeableViews>
              </div>
            </div>
            {/* </SwipeableViews> */}
          </section>
        </Spin>
      </Col>
    </Row>
  );
};

export default Login;
