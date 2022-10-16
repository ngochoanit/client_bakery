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
import { IConfigRemoteForMaster } from 'src/@types/entities/ConfigRemoteBackend';
import {
  getConfigRemoteForMaster,
  updateConfigRemoteForMaster,
} from 'src/apis/configRemoteBackend';
import { difference } from 'src/utils/differenceBetweenTwoObjects';
import isEmpty from 'lodash/isEmpty';
import { openNotificationWithIcon } from 'src/components/AppNotification';
import capitalizeFirstLetter from 'src/utils/capitalizeFirstLetter';
import Button from 'antd-button-color';
import { omitIsNil } from 'src/utils/omit';
import './index.less';

const prefixCls = 'app-config-backend-form';

const ConfigRemoteMasterForm = function ConfigRemoteMasterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formConfigRemoteForMaster] = Form.useForm<IConfigRemoteForMaster>();
  const [configMasterInit, setConfigMasterInit] =
    useState<IConfigRemoteForMaster>();
  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const response = await getConfigRemoteForMaster();
      if (response && response.data) {
        formConfigRemoteForMaster.setFieldsValue(response.data);
        setConfigMasterInit(response.data);
      }
      setIsLoading(false);
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onFinish = async (values: IConfigRemoteForMaster) => {
    const dataChange = difference(values, configMasterInit);
    if (isEmpty(dataChange)) {
      openNotificationWithIcon(
        'warning',
        'Config for master',
        `Please perform edits in form 'Config remote backend for master'`,
      );
    } else {
      setIsLoading(true);
      const response = await updateConfigRemoteForMaster(
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
      `${TRANSLATE_KEY.checkFieldsForm} 'Config remote backend for master'`,
    );
  };
  return (
    <Card title="Config remote backend for master">
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
          form={formConfigRemoteForMaster}
          initialValues={{ refreshSync: 0, ttl: 0, refreshApi: 0 }}
        >
          <Form.Item
            name="refreshSync"
            label={
              <Typography.Text>
                Refresh &apos;second&apos; sync for redis-server
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
            name="ttl"
            label={
              <Typography.Text>
                TTL for query
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
            name="refreshApi"
            label={
              <Typography.Text>
                Refresh &apos;second&apos; sync for settings Api
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
export default ConfigRemoteMasterForm;
