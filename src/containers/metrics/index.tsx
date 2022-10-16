import React, { useEffect, useState } from 'react';
import { Card, Empty, Row } from 'antd';
import Col from 'antd/es/grid/col';
import useSearchParams from 'src/hooks/useSearchParams';
import { IMetricsCurrentForm } from 'src/@types/entities/Metrics';
import { isAdmin } from 'src/helpers';
import { useAppSelector } from 'src/redux';
import Filter from './filter';
import MetricsCurrent from './mertricCurrent';
import MetricsDetail from './metricsDetail';

const Metrics = function Metrics() {
  const { getAllParams } = useSearchParams();
  const userInfo = useAppSelector((s) => s.auth.user);
  const params = getAllParams<IMetricsCurrentForm>({
    merchantId: undefined,
    domainId: undefined,
    serverIp: undefined,
  });
  const [merchantId, setMerchant] = useState<string>();
  const [domainId, setDomainId] = useState<string>();
  const [serverIp, setServerIp] = useState<string>();

  useEffect(() => {
    if (userInfo) {
      const merId = isAdmin(userInfo.role)
        ? params.merchantId
        : userInfo?.merchantId;
      setMerchant(merId);
    }
    setDomainId(params?.domainId);
    setServerIp(params?.serverIp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo, JSON.stringify(params)]);
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24}>
        <Card bordered size="small">
          <Filter />
        </Card>
      </Col>
      {merchantId && serverIp ? (
        <>
          <Col xs={24}>
            <MetricsCurrent merchantId={merchantId} serverIp={serverIp} />
          </Col>
          <Col xs={24}>
            <MetricsDetail merchantId={merchantId} serverIp={serverIp} />
          </Col>
        </>
      ) : (
        <Col xs={24}>
          <Card bordered size="small">
            <Empty />
          </Card>
        </Col>
      )}
    </Row>
  );
};

export default Metrics;
