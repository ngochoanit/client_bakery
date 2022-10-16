import {
  RDCreateServer,
  RDDeleteServer,
  RDGetListServersByDomain,
  RDQGetListServersByDomain,
  RDUpdateServer,
} from 'src/@types/apis/RequestData';
import { RECommon } from 'src/@types/apis/RequestError';
import { RRCommonArray, RRCommonObject } from 'src/@types/apis/RequestResponse';
import { IFormServer, IServer } from 'src/@types/entities/Server';
import ENDPOINT from 'src/constants/endpoint';
import { commonRequest } from './api';

export const getListServersByDomain = async (
  param: { domainId: string },
  query?: RDQGetListServersByDomain,
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDGetListServersByDomain,
    RRCommonArray<IServer>,
    RECommon
  >(
    {
      url: ENDPOINT.GET_LIST_SERVERS_BY_DOMAIN,
      data: { param, query },
    },
    config,
  );

  return result;
};

export const deleteServer = async (
  param: { domainId: string; serverId: string },
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDDeleteServer,
    RRCommonObject<IServer>,
    RECommon
  >(
    {
      url: ENDPOINT.DELETE_SERVER,
      method: 'DELETE',
      data: { param },
    },
    config,
  );
  return result;
};
export const updateServer = async (
  body: IFormServer,
  param: { domainId: string; serverId: string },
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDUpdateServer,
    RRCommonObject<IServer>,
    RECommon
  >(
    {
      url: ENDPOINT.UPDATE_SERVER,
      method: 'PUT',
      data: { body, param },
    },
    config,
  );
  return result;
};

export const createServer = async (
  body: IFormServer,
  param: { domainId: string },
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDCreateServer,
    RRCommonObject<IServer>,
    RECommon
  >(
    {
      url: ENDPOINT.CREATE_SERVER,
      method: 'POST',
      data: { body, param },
    },
    config,
  );
  return result;
  //
};
