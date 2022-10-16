import {
  RDGetListTrafficFlow,
  RDQGetListTrafficFlow,
  RDUpdateTrafficFlow,
} from 'src/@types/apis/RequestData';
import { RECommon } from 'src/@types/apis/RequestError';
import { RRCommonArray, RRCommonObject } from 'src/@types/apis/RequestResponse';
import {
  ITrafficFlow,
  TTrafficFlowForm,
} from 'src/@types/entities/TrafficFlow';
import ENDPOINT from 'src/constants/endpoint';
import { commonRequest } from './api';

export const getListTrafficFlowByDomain = async (
  param: { domainName: string },
  query?: RDQGetListTrafficFlow,
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDGetListTrafficFlow,
    RRCommonArray<ITrafficFlow>,
    RECommon
  >(
    {
      url: ENDPOINT.GET_LIST_TRAFFIC_FLOW,
      data: { param, query },
    },
    config,
  );

  return result;
};

export const updateTrafficFlow = async (
  body: TTrafficFlowForm,
  param: { domainName: string; trafficFlowId: string },
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDUpdateTrafficFlow,
    RRCommonObject<ITrafficFlow>,
    RECommon
  >(
    {
      url: ENDPOINT.UPDATE_TRAFFIC_FLOW,
      method: 'PUT',
      data: { body, param },
    },
    config,
  );
  return result;
};
