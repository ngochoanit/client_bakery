import { citiesMap, countriesMap, ispMap } from 'src/utils/define';

export interface IServer {
  id: string;
  publicIp: string;
  privateIp: string;
  merchantId: string;
  country: keyof typeof countriesMap;
  region?: keyof typeof citiesMap;
  isp?: keyof typeof ispMap;
}
export interface IServerFormSearch {
  publicIp?: string;
  privateIp?: string;
  country?: string;
  region?: string;
  isp?: string;
  merchantId?: string;
}
export interface IFormServer {
  publicIp: string;
  privateIp: string;
  country?: keyof typeof countriesMap;
  region?: keyof typeof citiesMap;
  isp?: string;
  merchantId?: string;
}
