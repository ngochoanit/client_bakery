import {
  RDGetMetricsCurrent,
  RDGetMetricsDetail,
} from 'src/@types/apis/RequestData';
import { RECommon } from 'src/@types/apis/RequestError';
import { RRCommonObject } from 'src/@types/apis/RequestResponse';
import { IMetrics } from 'src/@types/entities/Metrics';
import { PATH_REPORTS } from 'src/configs';
import ENDPOINT from 'src/constants/endpoint';
import { commonRequest } from './api';

export const getMetricsCurrent = async (
  param: { merchantId: string },
  query: { serverIp: string },
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDGetMetricsCurrent,
    RRCommonObject<{ timestamp: number; data: IMetrics }>,
    RECommon
  >(
    {
      url: ENDPOINT.GET_METRICS_CURRENT,
      path: PATH_REPORTS,
      data: { param, query },
    },
    config,
  );
  return result;
};

export const getMetricsDetail = async (
  param: { merchantId: string },
  query: { serverIp: string; startTime: string; endTime: string },
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDGetMetricsDetail,
    RRCommonObject<{
      step: number;
      metrics: {
        timestamp: number;
        data: IMetrics;
      }[];
    }>,
    RECommon
  >(
    {
      url: ENDPOINT.GET_METRICS_DETAIL,
      path: PATH_REPORTS,
      data: { param, query },
    },
    config,
  );
  return result;
};
