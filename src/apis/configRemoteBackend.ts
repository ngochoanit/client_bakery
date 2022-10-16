import {
  RDGetConfigRemoteForMaster,
  RDGetConfigRemoteForSlave,
  RDUpdateConfigRemoteForMaster,
  RDUpdateConfigRemoteForSlave,
} from 'src/@types/apis/RequestData';
import { RECommon } from 'src/@types/apis/RequestError';
import { RRCommonObject } from 'src/@types/apis/RequestResponse';
import {
  IConfigRemoteForMaster,
  IConfigRemoteForSlave,
} from 'src/@types/entities/ConfigRemoteBackend';
import ENDPOINT from 'src/constants/endpoint';
import { commonRequest } from './api';

export const getConfigRemoteForMaster = async (config?: {
  errorHandler?: (error: RECommon) => void;
}) => {
  const result = await commonRequest<
    RDGetConfigRemoteForMaster,
    RRCommonObject<IConfigRemoteForMaster>,
    RECommon
  >(
    {
      url: ENDPOINT.GET_CONFIG_REMOTE_FOR_MASTER,
      data: {},
    },
    config,
  );
  // return result;
  const resultTest: RRCommonObject<IConfigRemoteForMaster> = {
    ec: 0,
    data: {
      refreshSync: 1,
      ttl: 500,
      refreshApi: 10,
    },
    msg: 'ok',
  };
  return resultTest;
};
export const updateConfigRemoteForMaster = async (
  body: IConfigRemoteForMaster,
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDUpdateConfigRemoteForMaster,
    RRCommonObject<IConfigRemoteForMaster>,
    RECommon
  >(
    {
      url: ENDPOINT.UPDATE_CONFIG_REMOTE_FOR_MASTER,
      method: 'PUT',
      data: { body },
    },
    config,
  );
  //   return result;
  const resultTest: RRCommonObject<IConfigRemoteForMaster> = {
    ec: 0,
    data: {
      refreshSync: 1,
      ttl: 500,
      refreshApi: 10,
    },
    msg: 'ok',
  };
  return resultTest;
};

export const getConfigRemoteForSlave = async (config?: {
  errorHandler?: (error: RECommon) => void;
}) => {
  const result = await commonRequest<
    RDGetConfigRemoteForSlave,
    RRCommonObject<IConfigRemoteForSlave>,
    RECommon
  >(
    {
      url: ENDPOINT.GET_CONFIG_REMOTE_FOR_SLAVE,
      data: {},
    },
    config,
  );
  // return result;
  const resultTest: RRCommonObject<IConfigRemoteForSlave> = {
    ec: 0,
    data: {
      recordsSync: 100,
      serverAvailableSync: 100,
      settingsSync: 100,
      configSync: 100,
    },
    msg: 'ok',
  };
  return resultTest;
};

export const updateConfigRemoteForSlave = async (
  body: IConfigRemoteForSlave,
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDUpdateConfigRemoteForSlave,
    RRCommonObject<IConfigRemoteForSlave>,
    RECommon
  >(
    {
      url: ENDPOINT.UPDATE_CONFIG_REMOTE_FOR_SLAVE,
      method: 'PUT',
      data: { body },
    },
    config,
  );
  //   return result;
  const resultTest: RRCommonObject<IConfigRemoteForSlave> = {
    ec: 0,
    data: {
      recordsSync: 100,
      serverAvailableSync: 100,
      settingsSync: 100,
      configSync: 100,
    },
    msg: 'ok',
  };
  return resultTest;
};
