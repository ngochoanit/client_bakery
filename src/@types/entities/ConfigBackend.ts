export interface IConfigBackend {
  id?: string;
  refreshSecond: number;
  merchantId: string;
  rules: {
    cpu: number;
    ram: number;
    networkReceived?: number;
    networkTransmitted?: number;
    diskSpaceUsage: number;
    healthCheck?: {
      code: number;
      timeout: number;
      url: string;
    };
  };
  prometheus: [
    {
      host: string;
      port: number;
      user: string;
      password: string;
    },
  ];
}
export interface IConfigBackendFormSearch {
  merchantId: string;
}
export type TConfigBackendForm = IConfigBackend;
