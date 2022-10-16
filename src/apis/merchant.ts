import {
  RDCreateMerchant,
  RDDeleteMerchant,
  RDGetListMerchant,
  RDQGetListMerchant,
  RDUpdateMerchant,
} from 'src/@types/apis/RequestData';
import { RECommon } from 'src/@types/apis/RequestError';
import { RRCommonArray, RRCommonObject } from 'src/@types/apis/RequestResponse';
import { IFormMerchant, IMerchant } from 'src/@types/entities/Merchant';
import ENDPOINT from 'src/constants/endpoint';
import { commonRequest } from './api';

export const getListMerchant = async (
  query?: RDQGetListMerchant,
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDGetListMerchant,
    RRCommonArray<IMerchant>,
    RECommon
  >(
    {
      url: ENDPOINT.GET_LIST_MERCHANTS,
      data: { query },
    },
    config,
  );
  return result;
};
export const updateMerchant = async (
  body: IFormMerchant,
  param: { merchantId: string },
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDUpdateMerchant,
    RRCommonObject<IMerchant>,
    RECommon
  >(
    {
      url: ENDPOINT.UPDATE_MERCHANT,
      method: 'PUT',
      data: { body, param },
    },
    config,
  );
  return result;
};

export const createMerchant = async (
  body: IFormMerchant,
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDCreateMerchant,
    RRCommonObject<IMerchant>,
    RECommon
  >(
    {
      url: ENDPOINT.CREATE_MERCHANT,
      method: 'POST',
      data: { body },
    },
    config,
  );
  return result;
};

export const deleteMerchant = async (
  param: { merchantId: string },
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDDeleteMerchant,
    RRCommonObject<IMerchant>,
    RECommon
  >(
    {
      url: ENDPOINT.DELETE_MERCHANT,
      method: 'DELETE',
      data: { param },
    },
    config,
  );
  return result;
};
