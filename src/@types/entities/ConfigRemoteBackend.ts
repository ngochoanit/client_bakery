export interface IConfigRemoteForMaster {
  refreshSync: number;
  ttl: number;
  refreshApi: number;
}
export interface IConfigRemoteForSlave {
  recordsSync: number;
  serverAvailableSync: number;
  settingsSync: number;
  configSync: number;
}
