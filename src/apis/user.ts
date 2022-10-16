import {
  RDCreateUser,
  RDDeleteUser,
  RDGetListUser,
  RDQGetListUser,
  RDUpdateUser,
} from 'src/@types/apis/RequestData';
import { RECommon } from 'src/@types/apis/RequestError';
import { RRCommonArray, RRCommonObject } from 'src/@types/apis/RequestResponse';
import { IFormUser, TUserInfo } from 'src/@types/entities/User';
import ENDPOINT from 'src/constants/endpoint';
import { commonRequest } from './api';

export const getListUser = async (
  query?: RDQGetListUser,
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDGetListUser,
    RRCommonArray<TUserInfo>,
    RECommon
  >(
    {
      url: ENDPOINT.GET_LIST_USERS,
      data: { query },
    },
    config,
  );
  return result;
};
export const updateUser = async (
  body: IFormUser,
  param: { userId: string },
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDUpdateUser,
    RRCommonObject<TUserInfo>,
    RECommon
  >(
    {
      url: ENDPOINT.UPDATE_USER,
      method: 'PUT',
      data: { body, param },
    },
    config,
  );
  return result;
};

export const createUser = async (
  body: IFormUser,
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDCreateUser,
    RRCommonObject<TUserInfo>,
    RECommon
  >(
    {
      url: ENDPOINT.UPDATE_USER,
      method: 'POST',
      data: { body },
    },
    config,
  );
  return result;
};

export const deleteUser = async (
  param: { userId: string },
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDDeleteUser,
    RRCommonObject<TUserInfo>,
    RECommon
  >(
    {
      url: ENDPOINT.DELETE_USER,
      method: 'DELETE',
      data: { param },
    },
    config,
  );
  return result;
};
