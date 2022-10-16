enum ENDPOINT {
  LOGIN = '/users/login',
  REFRESH_TOKEN = '/user/refresh-token',
  USER_AUTH = '/users/:userId',
  FORGOT_PASSWORD = '/user/forgot-password',
  // domain
  GET_LIST_DOMAINS = '/domains',
  UPDATE_DOMAIN = '/domains/:domainId',
  CREATE_DOMAIN = '/domains',
  DELETE_DOMAIN = '/domains/:domainId',
  // user
  GET_LIST_USERS = '/users',
  UPDATE_USER = '/users/:userId',
  CREATE_USER = '/users',
  DELETE_USER = '/users/:userId',
  // record
  GET_LIST_RECORDS_BY_DOMAIN = '/records/:domainId',
  DELETE_RECORD = '/records/:domainId/:recordId',
  UPDATE_RECORD = '/records/:domainId/:recordId',
  CREATE_RECORD = '/records/:domainId',
  // config backend
  GET_LIST_CONFIG_BACKEND = '/backends',
  GET_CONFIG_BACKEND_BY_ID = '/backends/:configId',
  UPDATE_CONFIG_BACKEND = '/backends',
  // config remote backend
  GET_CONFIG_REMOTE_FOR_MASTER = '/config-remote-for-master',
  UPDATE_CONFIG_REMOTE_FOR_MASTER = '/config-remote-for-master',
  GET_CONFIG_REMOTE_FOR_SLAVE = '/config-remote-for-slave',
  UPDATE_CONFIG_REMOTE_FOR_SLAVE = '/config-remote-for-slave',

  // config server
  GET_LIST_SERVERS_BY_DOMAIN = '/servers/:domainId',
  DELETE_SERVER = '/servers/:domainId/:serverId',
  CREATE_SERVER = '/servers/:domainId',
  UPDATE_SERVER = '/servers/:domainId/:serverId',

  // merchant
  GET_LIST_MERCHANTS = '/merchants',
  UPDATE_MERCHANT = '/merchants/:merchantId',
  DELETE_MERCHANT = '/merchants/:merchantId',
  CREATE_MERCHANT = '/merchants',

  // traffic flow
  GET_LIST_TRAFFIC_FLOW = '/traffic-flows/:domainName',
  UPDATE_TRAFFIC_FLOW = '/traffic-flows/:domainName/:trafficFlowId',

  // metrics
  GET_METRICS_CURRENT = '/metrics/:merchantId/current',
  GET_METRICS_DETAIL = '/metrics/:merchantId',
}

export default ENDPOINT;
