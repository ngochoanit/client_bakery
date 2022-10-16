import {
  RDCreateDomain,
  RDDeleteDomain,
  RDGetListDomain,
  RDQGetListDomain,
  RDUpdateDomain,
} from 'src/@types/apis/RequestData';
import { RECommon } from 'src/@types/apis/RequestError';
import { RRCommonArray, RRCommonObject } from 'src/@types/apis/RequestResponse';
import { IDomain, IFormDomain } from 'src/@types/entities/Domain';
import ENDPOINT from 'src/constants/endpoint';
import { commonRequest } from './api';

export const getListDomain = async (
  query?: RDQGetListDomain,
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDGetListDomain,
    RRCommonArray<IDomain>,
    RECommon
  >(
    {
      url: ENDPOINT.GET_LIST_DOMAINS,
      data: { query },
    },
    config,
  );
  return result;
};

export const updateDomain = async (
  body: IFormDomain,
  param: { domainName: string },
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDUpdateDomain,
    RRCommonObject<IDomain>,
    RECommon
  >(
    {
      url: ENDPOINT.UPDATE_DOMAIN,
      method: 'PUT',
      data: { body, param },
    },
    config,
  );
  return result;
};

export const createDomain = async (
  body: IFormDomain,
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDCreateDomain,
    RRCommonObject<IDomain>,
    RECommon
  >(
    {
      url: ENDPOINT.CREATE_DOMAIN,
      method: 'POST',
      data: { body },
    },
    config,
  );
  return result;
};

export const deleteDomain = async (
  param: { domainId: number },
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDDeleteDomain,
    RRCommonObject<IDomain>,
    RECommon
  >(
    {
      url: ENDPOINT.DELETE_DOMAIN,
      method: 'DELETE',
      data: { param },
    },
    config,
  );
  return result;
};
