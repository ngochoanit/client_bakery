/* eslint-disable no-console */
/* eslint-disable no-useless-return */
import { RECommon } from 'src/@types/apis/RequestError';
import { openNotificationWithIcon } from 'src/components/AppNotification';
import LOCAL_FORAGE_KEY from 'src/constants/localForageKey';
import TRANSLATE_KEY from 'src/languages/locales/translateKey';
import { removeLocalForageItem } from 'src/utils/localForage';

function errorHandler<T extends RECommon>(
  error: T | 'TIMEOUT' | 'TOKEN_EXPIRED',
) {
  if (error === 'TIMEOUT') {
    openNotificationWithIcon('error', 'TIMEOUT', `${TRANSLATE_KEY.timeout}`);
    return;
  }
  if (error === 'TOKEN_EXPIRED') {
    openNotificationWithIcon(
      'warning',
      'TOKEN EXPIRED',
      `${TRANSLATE_KEY.token_expired}`,
    );
    removeLocalForageItem(LOCAL_FORAGE_KEY.USER_INFO);
    return;
  }
  // if (error.errorCode === 401) {
  //   removeLocalForageItem(LOCAL_FORAGE_KEY.USER_INFO);
  //   return;
  // }

  const { msg = '', message = '' } = error;
  if (msg) {
    openNotificationWithIcon('error', 'Request Error', msg);
  } else {
    openNotificationWithIcon('error', 'Request Error', message);
  }
}

export default errorHandler;
