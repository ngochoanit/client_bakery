import DOMAIN_SOA_EDIT_API from 'src/constants/domainSoaEditApi';
import DOMAIN_TYPE from 'src/constants/domainType';
import ROLE from 'src/constants/role';
import { TConfigBackendForm } from '../entities/ConfigBackend';
import {
  IConfigRemoteForMaster,
  IConfigRemoteForSlave,
} from '../entities/ConfigRemoteBackend';
import { IFormDomain } from '../entities/Domain';
import { IFormMerchant } from '../entities/Merchant';
import { IFormRecord } from '../entities/Record';
import { IFormServer } from '../entities/Server';
import { TTrafficFlowForm } from '../entities/TrafficFlow';
import { IFormUser } from '../entities/User';

/* Example Request body type */
export interface RDCommon {
  body?: {
    [key: string]: any;
  };
  query?:
    | {
        [key: string]: string | number | boolean | null | undefined;
      }
    | FormData;
  param?: {
    [key: string]: string | number | boolean | null | undefined;
  };
}
export interface RDLogin extends RDCommon {
  body: {
    email: string;
    password: string;
  };
}
export interface RDGetUserInfo extends RDCommon {
  param: {
    userId: number;
  };
}

export interface RDRequestForgotPassword {
  body: {
    email: string;
  };
}

// string api domain
export type RDQGetListDomain = {
  domainName?: string;
  type?: DOMAIN_TYPE;
  soaEditAPI?: DOMAIN_SOA_EDIT_API;
  merchantId?: string;
  pages?: number;
  records?: number;
};
export interface RDGetListDomain extends RDCommon {
  query?: RDQGetListDomain;
}
export interface RDUpdateDomain extends RDCommon {
  body: IFormDomain;
  param: { domainName: string };
}
export interface RDCreateDomain extends RDCommon {
  body: IFormDomain;
}
export interface RDDeleteDomain extends RDCommon {
  param: { domainId: number };
}
// end api domain

// start api user
export type RDQGetListUser = {
  merchantId?: string;
  role?: ROLE;
  email?: string;
  firstName?: string;
  lastName?: string;
  pages?: number;
  records?: number;
};
export interface RDGetListUser extends RDCommon {
  query?: RDQGetListUser;
}
export interface RDUpdateUser extends RDCommon {
  body: IFormUser;
  param: { userId: string };
}
export interface RDCreateUser extends RDCommon {
  body: IFormUser;
}
export interface RDDeleteUser extends RDCommon {
  param: { userId: string };
}
// end api user

// string api record
export type RDQGetListRecord = {
  pages?: number;
  records?: number;
  name?: string;
  type?: string;
  status: 0 | 1;
  ttl?: number;
  soaEditAPI?: string;
};
export interface RDGetListRecord extends RDCommon {
  query?: RDQGetListRecord;
}
export type RDQGetListRecordsByDomain = {
  pages?: number;
  records?: number;
};
export interface RDGetListRecordsByDomain extends RDCommon {
  param: { domainId: string };
  query?: RDQGetListRecordsByDomain;
}
export interface RDUpdateRecord extends RDCommon {
  body: IFormRecord;
  param: { domainId: string; recordId: string };
}
export interface RDCreateRecord extends RDCommon {
  body: IFormRecord;
  param: { domainId: string };
}
export interface RDDeleteRecord extends RDCommon {
  param: { domainId: string; recordId: string };
}
// end api record

// start api config backend
export type RDQGetListConfigBackend = {
  pages?: number;
  records?: number;
  merchantId?: string;
};
export interface RDGetListConfigBackend extends RDCommon {
  query?: RDQGetListConfigBackend;
}

export interface RDGetConfigBackendById extends RDCommon {
  param: { configId: string };
}
export interface RDUpdateConfigBackend extends RDCommon {
  body: TConfigBackendForm;
}
// end api config backend

// start api config remote backend

export type RDGetConfigRemoteForMaster = RDCommon;
export type RDGetConfigRemoteForSlave = RDCommon;
export interface RDUpdateConfigRemoteForMaster extends RDCommon {
  body: IConfigRemoteForMaster;
}
export interface RDUpdateConfigRemoteForSlave extends RDCommon {
  body: IConfigRemoteForSlave;
}
// end api config remote backend

// start api config server
export type RDQGetListServersByDomain = {
  ipPublic?: string;
  isPrivate?: string;
  region?: string;
  pages?: number;
  records?: number;
};
export interface RDGetListServersByDomain extends RDCommon {
  param: { domainId: string };
  query?: RDQGetListServersByDomain;
}
export interface RDDeleteServer extends RDCommon {
  param: { domainId: string; serverId: string };
}
export interface RDUpdateServer extends RDCommon {
  body: IFormServer;
  param: { domainId: string; serverId: string };
}
export interface RDCreateServer extends RDCommon {
  body: IFormServer;
  param: { domainId: string };
}
// end api config server

// start api merchant
export type RDQGetListMerchant = {
  pages?: number;
  records?: number;
  email?: string;
  name?: string;
};
export interface RDGetListMerchant extends RDCommon {
  query?: RDQGetListMerchant;
}
export interface RDUpdateMerchant extends RDCommon {
  body: IFormMerchant;
  param: { merchantId: string };
}
export interface RDCreateMerchant extends RDCommon {
  body: IFormMerchant;
}
export interface RDDeleteMerchant extends RDCommon {
  param: { merchantId: string };
}
// end api merchant

// start api traffic flow
export type RDQGetListTrafficFlow = {
  records?: number;
  pages?: number;
};
export interface RDGetListTrafficFlow extends RDCommon {
  param: { domainName: string };
  query?: RDQGetListTrafficFlow;
}
export interface RDUpdateTrafficFlow extends RDCommon {
  body: TTrafficFlowForm;
  param: { domainName: string; trafficFlowId: string };
}
// end api traffic flow

// start api merchant
export interface RDGetMetricsCurrent extends RDCommon {
  param: { merchantId: string };
  query: { serverIp: string };
}
export interface RDGetMetricsDetail extends RDCommon {
  param: { merchantId: string };
  query: { serverIp: string; startTime: string; endTime: string };
}
