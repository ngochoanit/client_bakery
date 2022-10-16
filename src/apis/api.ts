/* eslint-disable no-useless-return */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
import axios, { CancelTokenSource, Method } from 'axios';
import { RDCommon } from 'src/@types/apis/RequestData';
import { RECommon } from 'src/@types/apis/RequestError';
import { RRRefreshToken } from 'src/@types/apis/RequestResponse';
import { LFUserInfo } from 'src/@types/localForage/userInfo';
import { API_URL, PATH_CONFIGS, REQUEST_TIMEOUT } from 'src/configs';
import ENDPOINT from 'src/constants/endpoint';
import LOCAL_FORAGE_KEY from 'src/constants/localForageKey';
import apiUrlCreator from 'src/utils/apiUrlCreator';
import { getLocalForageItem, setLocalForageItem } from 'src/utils/localForage';
import errorHandler from './errorHandler';

type CancelTokenSourceObject = {
  source: CancelTokenSource;
  id: number;
};

let cancelTokenSources: CancelTokenSourceObject[] = [];

let isGettingAccessToken = false;

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function callApi<
  TData extends RDCommon,
  TResponse,
  TError extends RECommon,
>({
  method = 'GET',
  baseUrl = API_URL,
  path = PATH_CONFIGS,
  url,
  data,
  timeLeft = 2,
  isAuth = true,
  requestTimeout = REQUEST_TIMEOUT,
  isRefreshingToken = false,
}: {
  method?: Method;
  baseUrl?: string;
  path?: string;
  url: ENDPOINT;
  data: TData;
  timeLeft?: number;
  isAuth?: boolean;
  requestTimeout?: number;
  isRefreshingToken?: boolean;
}): Promise<{
  data?: TResponse;
  error?: TError | 'TIMEOUT' | 'TOKEN_EXPIRED';
}> {
  if (timeLeft > 2) {
    timeLeft = 2;
  }
  const cancelToken = axios.CancelToken.source();
  const id = Math.round(Math.random() * 1000000);
  if (isAuth && !isRefreshingToken) {
    cancelTokenSources.push({ source: cancelToken, id });
    while (isGettingAccessToken) {
      // eslint-disable-next-line no-await-in-loop
      await sleep(500);
    }
  }
  try {
    const timeout = setTimeout(() => {
      cancelToken.cancel('TIMEOUT');
    }, requestTimeout * (3 - timeLeft));
    const response = await axios({
      method,
      data: data.body,
      url: apiUrlCreator(`${baseUrl}/${path}`, url, data.query, data.param),
      headers: {
        'Content-Type': 'application/json',
        ...(isAuth
          ? {
              Authorization: `Bearer ${
                (
                  await getLocalForageItem<LFUserInfo>(
                    LOCAL_FORAGE_KEY.USER_INFO,
                  )
                )?.accessToken ?? ''
              }`,
            }
          : {}),
      },
      cancelToken: cancelToken.token,
    });

    clearTimeout(timeout);
    cancelTokenSources = cancelTokenSources.filter((item) => item.id !== id);
    if (response.data.ec && response.data.ec !== 0) {
      return { error: response.data };
    }
    return { data: response.data };
  } catch (error: any) {
    if (axios.isCancel(error)) {
      if (error.message === 'TIMEOUT') {
        if (timeLeft === 0) {
          return { error: 'TIMEOUT' };
        }
        const res = await callApi<TData, TResponse, TError>({
          method,
          url,
          data,
          timeLeft: timeLeft - 1,
        });
        return res;
      }
      while (isAuth && isGettingAccessToken) {
        // eslint-disable-next-line no-await-in-loop
        await sleep(500);
      }
      const res = await callApi<TData, TResponse, TError>({
        method,
        url,
        data,
      });
      return res;
    }
    if (error && error.response) {
      if (error.response.status === 419) {
        isGettingAccessToken = false; // change to true if backend have refresh token API
        cancelTokenSources
          .filter((ct) => ct.id !== id)
          .forEach((ct) => ct.source.cancel('Code 419'));
        const tokenResult = await callApi<RDCommon, RRRefreshToken, RECommon>({
          method: 'POST',
          url: ENDPOINT.REFRESH_TOKEN,
          data: {},
          isRefreshingToken: true,
        });

        if (tokenResult.data) {
          cancelTokenSources = [];
          await setLocalForageItem(
            LOCAL_FORAGE_KEY.USER_INFO,
            tokenResult.data.data,
          );
          isGettingAccessToken = false;
          const res = await callApi<TData, TResponse, TError>({
            method,
            url,
            data,
          });
          return res;
        }
        return { error: 'TOKEN_EXPIRED' };
      }
      cancelTokenSources = cancelTokenSources.filter((item) => item.id !== id);
      if (error.response.status) {
        return {
          error: {
            errorCode: error.response.status,
            ...JSON.parse(error.response.request.response),
          },
        };
      }
    }
    return { error };
  }
}

export async function commonRequest<
  TData extends RDCommon,
  TResponse,
  TError extends RECommon,
>(
  request: {
    method?: Method;
    baseUrl?: string;
    path?: string;
    url: ENDPOINT;
    data: TData;
    timeLeft?: number;
    isAuth?: boolean;
    requestTimeout?: number;
  },
  config?: {
    errorHandler?: (error: TError) => void;
  },
): Promise<TResponse | undefined> {
  const result = await callApi<TData, TResponse, TError>(request);
  if (result.data) {
    return result.data;
  }
  if (result.error) {
    if (config?.errorHandler) {
      if (result.error !== 'TOKEN_EXPIRED' && result.error !== 'TIMEOUT') {
        config.errorHandler(result.error);
        return;
      }
    }
    errorHandler(result.error);
    return;
  }
  return;
}
