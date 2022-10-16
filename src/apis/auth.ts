import { RDGetUserInfo, RDLogin } from 'src/@types/apis/RequestData';
import { RECommon } from 'src/@types/apis/RequestError';
import { RRCommonObject } from 'src/@types/apis/RequestResponse';
import { TUserInfo } from 'src/@types/entities/User';
import { LFUserInfo } from 'src/@types/localForage/userInfo';
import ENDPOINT from 'src/constants/endpoint';
import LOCAL_FORAGE_KEY from 'src/constants/localForageKey';
import { setLocalForageItem } from 'src/utils/localForage';
import { commonRequest } from './api';

export const apiLogin = async (
  body: {
    email: string;
    password: string;
  },
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDLogin,
    RRCommonObject<{
      accessToken: string;
      expiresIn: number;
      tokenType: string;
      userId: number;
    }>,
    RECommon
  >(
    {
      method: 'POST',
      url: ENDPOINT.LOGIN,
      data: { body },
    },
    config,
  );
  if (result && result.data) {
    await setLocalForageItem<LFUserInfo>(
      LOCAL_FORAGE_KEY.USER_INFO,
      result.data,
    );
  }
  return result;
};

export const getUserInfo = async (
  param: { userId: number },
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDGetUserInfo,
    RRCommonObject<TUserInfo>,
    RECommon
  >(
    {
      url: ENDPOINT.USER_AUTH,
      data: { param },
    },
    config,
  );
  return result;
};
