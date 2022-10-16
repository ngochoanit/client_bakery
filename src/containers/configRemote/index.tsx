import { Col, Row } from 'antd';
import React from 'react';
import ConfigRemoteMasterForm from './form/configRemoteForMasterForm';
import ConfigRemoteForSlaveForm from './form/configRemoteForSlaveForm';

const prefixCls = 'app-config-remote-backend';
const ConfigRemote = function ConfigRemote() {
  return (
    <div className={prefixCls}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <ConfigRemoteMasterForm />
        </Col>
        <Col xs={24} md={12}>
          <ConfigRemoteForSlaveForm />
        </Col>
      </Row>
    </div>
  );
};

export default ConfigRemote;
