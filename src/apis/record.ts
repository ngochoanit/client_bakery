import {
  RDCreateRecord,
  RDDeleteRecord,
  RDGetListRecordsByDomain,
  RDQGetListRecordsByDomain,
  RDUpdateRecord,
} from 'src/@types/apis/RequestData';
import { RECommon } from 'src/@types/apis/RequestError';
import { RRCommonArray, RRCommonObject } from 'src/@types/apis/RequestResponse';
import { IFormRecord, IRecord } from 'src/@types/entities/Record';
import ENDPOINT from 'src/constants/endpoint';
import { commonRequest } from './api';

export const getListRecordsByDomain = async (
  param: { domainId: string },
  query?: RDQGetListRecordsByDomain,
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDGetListRecordsByDomain,
    RRCommonArray<IRecord>,
    RECommon
  >(
    {
      url: ENDPOINT.GET_LIST_RECORDS_BY_DOMAIN,
      data: { param, query },
    },
    config,
  );

  return result;
};

export const deleteRecord = async (
  param: { domainId: string; recordId: string },
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDDeleteRecord,
    RRCommonObject<IRecord>,
    RECommon
  >(
    {
      url: ENDPOINT.DELETE_RECORD,
      method: 'DELETE',
      data: { param },
    },
    config,
  );
  return result;
};

export const updateRecord = async (
  body: IFormRecord,
  param: { domainId: string; recordId: string },
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDUpdateRecord,
    RRCommonObject<IRecord>,
    RECommon
  >(
    {
      url: ENDPOINT.UPDATE_RECORD,
      method: 'PUT',
      data: { body, param },
    },
    config,
  );
  return result;
};
export const createRecord = async (
  body: IFormRecord,
  param: { domainId: string },
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDCreateRecord,
    RRCommonObject<IRecord>,
    RECommon
  >(
    {
      url: ENDPOINT.CREATE_RECORD,
      method: 'POST',
      data: { body, param },
    },
    config,
  );
  return result;
};
