import { Col, Form, Input, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { IDomain } from 'src/@types/entities/Domain';
import { IMetricsCurrentForm } from 'src/@types/entities/Metrics';
import { IServer } from 'src/@types/entities/Server';
import { getListDomain } from 'src/apis/domain';
import { getListServersByDomain } from 'src/apis/server';
import AppSelect from 'src/components/AppSelect';
import { isAdmin } from 'src/helpers';
import useGetMerchants from 'src/hooks/useGetMerchants';
import useSearchParams from 'src/hooks/useSearchParams';
import TRANSLATE_KEY from 'src/languages/locales/translateKey';
import { useAppSelector } from 'src/redux';

const Filter = function Filter() {
  const [formCurrent] = Form.useForm<IMetricsCurrentForm>();
  const userInfo = useAppSelector((s) => s.auth.user);
  const merchants = useGetMerchants();
  const [servers, setServers] = useState<IServer[]>();
  const [domains, setDomains] = useState<IDomain[]>();
  const watchMerchantId = Form.useWatch('merchantId', formCurrent);
  const { getAllParams, addParams, removeAllParams } = useSearchParams();
  const params = getAllParams<IMetricsCurrentForm>({
    merchantId: undefined,
    domainId: undefined,
    serverIp: undefined,
  });
  useEffect(() => {
    if (userInfo && !isAdmin(userInfo?.role)) {
      formCurrent.setFieldsValue({
        ...params,
        merchantId: userInfo.merchantId,
      });
    } else {
      formCurrent.setFieldsValue({
        ...params,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo, params]);
  useEffect(() => {
    const getDataDomain = async () => {
      if (userInfo) {
        let merchantId = '';
        if (isAdmin(userInfo?.role)) {
          if (params.merchantId) {
            merchantId = params.merchantId;
          }
        } else {
          merchantId = userInfo.merchantId ?? '';
        }
        if (merchantId) {
          const response = await getListDomain({
            merchantId,
            records: Number.MAX_SAFE_INTEGER,
          });
          if (response && response.data) {
            setDomains([...response.data]);
          }
        } else {
          setDomains([]);
        }
        formCurrent.setFieldsValue({
          domainId: undefined,
          serverIp: undefined,
        });
      }
    };
    getDataDomain();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo, params.merchantId]);
  useEffect(() => {
    const getDataServer = async () => {
      if (params.domainId) {
        const response = await getListServersByDomain(
          { domainId: params.domainId.toString() },
          {
            records: Number.MAX_SAFE_INTEGER,
          },
        );
        if (response && response.data) {
          setServers([...response.data]);
        }
      } else {
        setServers([]);
      }
      formCurrent.setFieldsValue({
        serverIp: undefined,
      });
    };
    getDataServer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.domainId]);

  return (
    <Form
      className="app-filter-form"
      layout="vertical"
      form={formCurrent}
      labelAlign="left"
    >
      <Row gutter={12} align="bottom">
        {userInfo && isAdmin(userInfo.role) ? (
          <Col xs={24} md={12} lg={4} xl={4}>
            <Form.Item name="merchantId" label={TRANSLATE_KEY.merchant}>
              <AppSelect
                showSearch
                placeholder={TRANSLATE_KEY.merchant}
                onSelect={(value: string) => {
                  if (value !== params.merchantId) {
                    removeAllParams();
                    addParams({ merchantId: value });
                  }
                }}
              >
                {merchants &&
                  merchants.length > 0 &&
                  merchants.map((item) => {
                    return (
                      <Select.Option key={item.id} value={item.id}>
                        {item.id}
                      </Select.Option>
                    );
                  })}
              </AppSelect>
            </Form.Item>
          </Col>
        ) : (
          <Form.Item name="merchantId" label={TRANSLATE_KEY.merchant} hidden>
            <Input placeholder={TRANSLATE_KEY.merchant} />
          </Form.Item>
        )}

        <Col xs={24} md={12} lg={4} xl={4}>
          <Form.Item name="domainId" label={TRANSLATE_KEY.domain}>
            <AppSelect
              showSearch
              placeholder={TRANSLATE_KEY.domain}
              disabled={!watchMerchantId}
              onSelect={(value: string) => {
                if (value !== params.domainId) {
                  removeAllParams();
                  addParams({
                    domainId: value,
                    merchantId: params.merchantId ?? '',
                  });
                }
              }}
            >
              {domains &&
                domains.length > 0 &&
                domains.map((item) => {
                  return (
                    <Select.Option key={item.id} value={item.id.toString()}>
                      {item.domainName}
                    </Select.Option>
                  );
                })}
            </AppSelect>
          </Form.Item>
        </Col>
        <Col xs={24} md={12} lg={4} xl={4}>
          <Form.Item name="serverIp" label={TRANSLATE_KEY.server}>
            <AppSelect
              showSearch
              placeholder={TRANSLATE_KEY.server}
              disabled={!params.domainId}
              onSelect={(value: string) => {
                addParams({ serverIp: value });
              }}
            >
              {servers &&
                servers.length > 0 &&
                servers.map((item) => {
                  return (
                    <Select.Option key={item.privateIp} value={item.privateIp}>
                      {item.privateIp}
                    </Select.Option>
                  );
                })}
            </AppSelect>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
