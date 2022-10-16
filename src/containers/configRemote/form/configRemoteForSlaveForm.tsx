import React, { useEffect, useState } from 'react';
import {
  Card,
  Form,
  InputNumber,
  Space,
  Spin,
  Tooltip,
  Typography,
} from 'antd';
import { InfoCircleTwoTone, PushpinTwoTone } from '@ant-design/icons';
import TRANSLATE_KEY from 'src/languages/locales/translateKey';

import {
  getConfigRemoteForSlave,
  updateConfigRemoteForSlave,
} from 'src/apis/configRemoteBackend';
import { difference } from 'src/utils/differenceBetweenTwoObjects';
import isEmpty from 'lodash/isEmpty';
import { openNotificationWithIcon } from 'src/components/AppNotification';
import capitalizeFirstLetter from 'src/utils/capitalizeFirstLetter';
import Button from 'antd-button-color';
import { omitIsNil } from 'src/utils/omit';
import { IConfigRemoteForSlave } from 'src/@types/entities/ConfigRemoteBackend';
import './index.less';

const prefixCls = 'app-config-backend-form';

const ConfigRemoteForSlaveForm = function ConfigRemoteForSlaveForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formConfigRemoteForSlave] = Form.useForm<IConfigRemoteForSlave>();
  const [configSlaveInit, setConfigSlaveInit] =
    useState<IConfigRemoteForSlave>();
  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const response = await getConfigRemoteForSlave();
      if (response && response.data) {
        formConfigRemoteForSlave.setFieldsValue(response.data);
        setConfigSlaveInit(response.data);
      }
      setIsLoading(false);
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onFinish = async (values: IConfigRemoteForSlave) => {
    const dataChange = difference(values, configSlaveInit);
    if (isEmpty(dataChange)) {
      openNotificationWithIcon(
        'warning',
        'Config for slave',
        `Please perform edits in form 'Config remote backend for slave'`,
      );
    } else {
      setIsLoading(true);
      const response = await updateConfigRemoteForSlave(
        omitIsNil(dataChange, { deep: false }),
      );
      if (response && response.data) {
        openNotificationWithIcon(
          'success',
          'Notification',
          `${TRANSLATE_KEY.updated_successfully}`,
        );
      }
      setIsLoading(false);
    }
  };
  const onFinishFailed = () => {
    openNotificationWithIcon(
      'warning',
      'Config rules',
      `${TRANSLATE_KEY.checkFieldsForm} 'Config remote backend for slave'`,
    );
  };
  return (
    <Card title="Config remote backend for slave">
      <Spin size="large" spinning={isLoading}>
        <Space align="start">
          <PushpinTwoTone />
          <Typography.Text italic>
            {/* {TRANSLATE_KEY.config_backend_refresh_des} */}
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Necessitatibus delectus iusto numquam rem repellat atque amet
            consectetur illo harum libero repellendus architecto praesentium
            molestias, quaerat facilis, itaque nesciunt magni ea!
          </Typography.Text>
        </Space>
        <Form
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className={prefixCls}
          layout="vertical"
          form={formConfigRemoteForSlave}
          initialValues={{ refreshSync: 0, ttl: 0, refreshApi: 0 }}
        >
          <Form.Item
            name="recordsSync"
            // label="Refresh 'second' sync  for record and domain"
            label={
              <Typography.Text>
                Refresh &apos;second&apos; sync for record and domain
                <Tooltip
                  placement="right"
                  title="Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Necessitatibus delectus iusto numquam rem repellat atque amet
                  consectetur illo harum libero repellendus architecto praesentium
                  molestias, quaerat facilis, itaque nesciunt magni ea!"
                  overlayClassName="bg-primary"
                >
                  <InfoCircleTwoTone className="app-icon-info" />
                </Tooltip>
              </Typography.Text>
            }
            rules={[
              {
                required: true,
                message: capitalizeFirstLetter(`${TRANSLATE_KEY.please_input}`),
              },
            ]}
          >
            <InputNumber min={0} style={{ width: '100%' }} addonAfter="sec" />
          </Form.Item>
          <Form.Item
            name="serverAvailableSync"
            label={
              <Typography.Text>
                Refresh &apos;second&apos; sync for server available
                <Tooltip
                  placement="right"
                  title="Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Necessitatibus delectus iusto numquam rem repellat atque amet
                  consectetur illo harum libero repellendus architecto praesentium
                  molestias, quaerat facilis, itaque nesciunt magni ea!"
                  overlayClassName="bg-primary"
                >
                  <InfoCircleTwoTone className="app-icon-info" />
                </Tooltip>
              </Typography.Text>
            }
            rules={[
              {
                required: true,
                message: capitalizeFirstLetter(`${TRANSLATE_KEY.please_input}`),
              },
            ]}
          >
            <InputNumber min={0} style={{ width: '100%' }} addonAfter="sec" />
          </Form.Item>
          <Form.Item
            name="settingsSync"
            label={
              <Typography.Text>
                Refresh &apos;second&apos; sync for settings
                <Tooltip
                  placement="right"
                  title="Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Necessitatibus delectus iusto numquam rem repellat atque amet
                  consectetur illo harum libero repellendus architecto praesentium
                  molestias, quaerat facilis, itaque nesciunt magni ea!"
                  overlayClassName="bg-primary"
                >
                  <InfoCircleTwoTone className="app-icon-info" />
                </Tooltip>
              </Typography.Text>
            }
            rules={[
              {
                required: true,
                message: capitalizeFirstLetter(`${TRANSLATE_KEY.please_input}`),
              },
            ]}
          >
            <InputNumber min={0} style={{ width: '100%' }} addonAfter="sec" />
          </Form.Item>
          <Form.Item
            name="configSync"
            label={
              <Typography.Text>
                Refresh &apos;second&apos; sync for config
                <Tooltip
                  placement="right"
                  title="Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Necessitatibus delectus iusto numquam rem repellat atque amet
                  consectetur illo harum libero repellendus architecto praesentium
                  molestias, quaerat facilis, itaque nesciunt magni ea!"
                  overlayClassName="bg-primary"
                >
                  <InfoCircleTwoTone className="app-icon-info" />
                </Tooltip>
              </Typography.Text>
            }
            rules={[
              {
                required: true,
                message: capitalizeFirstLetter(`${TRANSLATE_KEY.please_input}`),
              },
            ]}
          >
            <InputNumber min={0} style={{ width: '100%' }} addonAfter="sec" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button type="success" htmlType="submit">
              {TRANSLATE_KEY.update}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
};
export default ConfigRemoteForSlaveForm;
