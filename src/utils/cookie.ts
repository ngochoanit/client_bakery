import COOKIE_NAME from 'src/constants/cookieName';

/**
 * @param  {COOKIE_NAME} cookieName
 * @param  {string} cookieValue
 * @param  {number} expiredTime
 * @returns void
 */
export const setCookie = (
  cookieName: COOKIE_NAME,
  cookieValue: string,
  expiredTime: number,
): void => {
  const d = new Date();
  d.setTime(d.getTime() + expiredTime);
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${cookieName.toString()}=${cookieValue};${expires};path=/`;
};
/**
 * @param  {COOKIE_NAME} cookieName
 * @returns string
 */
export const getCookie = (cookieName: COOKIE_NAME): string => {
  const ca = document.cookie.split(';');
  const value = ca.find((c) => c.trim().indexOf(cookieName.toString()) === 0);
  return value ? value.split('=')[1] : '';
};
