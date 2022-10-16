import {
  RDGetConfigBackendById,
  RDGetListConfigBackend,
  RDQGetListConfigBackend,
  RDUpdateConfigBackend,
} from 'src/@types/apis/RequestData';
import { RECommon } from 'src/@types/apis/RequestError';
import { RRCommonArray, RRCommonObject } from 'src/@types/apis/RequestResponse';
import {
  IConfigBackend,
  TConfigBackendForm,
} from 'src/@types/entities/ConfigBackend';
import ENDPOINT from 'src/constants/endpoint';
import { commonRequest } from './api';

export const getListConfigBackend = async (
  query?: RDQGetListConfigBackend,
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDGetListConfigBackend,
    RRCommonArray<IConfigBackend>,
    RECommon
  >(
    {
      url: ENDPOINT.GET_LIST_CONFIG_BACKEND,
      data: { query },
    },
    config,
  );
  return result;
};

export const getConfigBackendById = async (
  param: { configId: string },
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDGetConfigBackendById,
    RRCommonObject<IConfigBackend>,
    RECommon
  >(
    {
      url: ENDPOINT.GET_CONFIG_BACKEND_BY_ID,
      data: { param },
    },
    config,
  );
  return result;
};
export const updateConfigBackend = async (
  body: TConfigBackendForm,
  // param: { configId: string },
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDUpdateConfigBackend,
    RRCommonObject<IConfigBackend>,
    RECommon
  >(
    {
      url: ENDPOINT.UPDATE_CONFIG_BACKEND,
      method: 'PUT',
      data: { body },
    },
    config,
  );
  return result;
};
