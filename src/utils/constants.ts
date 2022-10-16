export default {
  DEVICE_TYPE: {
    MOBILE: 'mobile',
    TABLET: 'tablet',
    SMART_TV: 'smarttv',
    CONSOLE: 'console',
    WEARABLE: 'wearable',
    DESKTOP: 'desktop',
  },
  OS_TYPE: {
    IOS: 'iOS',
    ANDROID: 'Android',
    WINDOWS_PHONE: 'Windows Phone',
    MAC_OS: 'Mac OS',
  },
  ACTION_TYPE: {
    UPDATE_STATE: 'updateState',
    SHOW_MODAL: 'showModal',
    HIDE_MODAL: 'hideModal',
    SET_USERS: 'set_users',
    SET_MERCHANTS: 'set_merchants',
    SET_PROFILE: 'set_profile',
    SET_APPS: 'set_apps',
    GET_DATA_MENU: 'get_data_menu',
    SET_LICENSE_UNIQUE: 'set_license_unique',
    SET_LICENSE_DELIVERIES: 'set_license_deliveries',
  },
  AUTH_TYPE: {
    LOGIN: 'login',
    LOGOUT: 'logout',
    PERMISSION: 'permission',
  },
  AUTH_ACTION: {
    PASSWORD: 1,
    OTP_REGISTER: 2,
    NEW_PASSWORD: 3,
    OTP_LOGIN: 4,
  },
  METHOD_TYPE: {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
  },
  THEME_ACTION_TYPE: {
    CHANGE_THEME: 'changeTheme',
  },
  FORM_TYPE: {
    STRING: 'string',
    PASSWORD: 'password',
    BUTTON: 'button',
    TEXT: 'text',
    TEXT_AREA: 'textarea',
    NUMBER: 'number',
    DATE: 'date',
    DATE_TIME: 'datetime',
    TIME: 'time',
    SELECT: 'select',
    SEARCH_SELECT: 'search_select',
    SELECT_MULTI: 'select_multi',
    RADIO: 'radio',
    RADIO_GROUP: 'radio_group',
    CONTROL_GROUP: 'control_group',
    CHECKBOX: 'checkbox',
    CHECKBOX_MULTI: 'checkbox_multi',
    SWITCH: 'switch',
    TAG: 'tag',
    TAB: 'tab',
    RATE: 'rate',
    UPLOAD: 'upload',
    UPLOAD_IMAGE: 'upload_image',
    UPLOAD_LIST_IMAGE: 'upload_list_image',
    UPLOAD_FILE: 'upload_file',
    PLAYER: 'player',
    EDITOR: 'editor',
    JSON_EDITOR: 'json_editor',
    DYNAMIC_FORM: 'dynamic_form',
  },
  FILTER_TYPE: {
    STRING: 'string',
    SELECT: 'select',
    SEARCH_SELECT: 'search_select',
    CHECKBOX: 'checkbox',
    SWITCH: 'switch',
    DATE_RANGE: 'date_range',
    BUTTON_GROUP: 'button_group',
  },
  DATA_TYPE: {
    ARRAY: 'array',
    OBJECT: 'object',
  },
  MESSAGE_TEXT: {
    SUCCESS: 'Thực hiện thành công!',
    FAIL: 'Thực hiện thất bại!',
  },
  URL: {},
  STORAGE_KEY: {
    USER: 'user',
  },
  SUBMIT_TYPE: {
    CREATE: 'create',
    EDIT: 'edit',
    UPDATE: 'update',
  },
  ROLE: {
    ADMIN: 'admin',
    MERCHANT: 'merchant',
    REPORT: 'report',
    API: 'api',
    AUDITOR: 'auditor',
  },
  SCOPE_TYPE: {
    ADMIN: 'admin',
    MERCHANT: 'merchant',
    REPORT: 'report',
    API: 'api',
    AUDITOR: 'auditor',
  },
  AUTHORIZATION_TYPE: {
    ALLOW_ALL_REQUEST: 'allowAllRequest',
    DENY_ALL_REQUEST: 'denyAllRequest',
    CALLBACK: 'callback',
    JWT: 'jwt',
  },
  RESOURCE_NAME: {
    USER: 'user',
    AUTHORIZATION: 'authorization',
    MERCHANT: 'merchant',
    APP: 'app',
    ASSETS: 'assets',
    DELIVERIES: 'deliveries',
    REPORTS: 'reports',
    INGEST_KEY: 'ingest-key',
    DEVELOP: 'develop',
  },
  CHART_TYPE: {
    PIE: 'pie',
    LINE: 'line',
    BAR: 'bar',
    AREA: 'area',
    LIST: 'list',
  },
  WHITELIST_TYPES: {
    domain: {
      title: 'Domain (website)',
      tooltip: 'domainTooltip',
    },
    packageId: {
      title: 'Package identifier (android)',
      tooltip: 'packageIdTooltip',
    },
    signature: {
      title: 'Signature (android)',
      tooltip: 'signatureTooltip',
    },
    bundleId: {
      title: 'Bundle identifier (iOS)',
      tooltip: 'bundleIdTooltip',
    },
  },
};