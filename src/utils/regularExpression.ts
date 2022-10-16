/* eslint-disable prefer-regex-literals */
/* eslint-disable no-useless-escape */
// eslint-disable-next-line no-useless-escape, prefer-regex-literals
export const regexEmail = new RegExp(
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
);

export const regexPassword = new RegExp(
  /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{6,18}$/,
);
export const regexWhitespace = new RegExp(/^\S+$/);

export const regexWhitespaceFirst = new RegExp(/^\S.*$/);

export const regexDescription = new RegExp(/^(.|\s)*[a-zA-Z]+(.|\s)*$/);

export const regexNumber = new RegExp(/^\d+$/);

export const regexName = new RegExp(/^\w+$/);

export const regexDomainName = new RegExp(
  /^((?!-)[a-z0-9-]{1,62}[a-z0-9]\.)+[a-z]{2,6}$/,
);
export const regexRecordName = new RegExp(
  /^((?![-.])[a-z0-9-.]{1,50}[a-z0-9])/,
);
export const regexIpv4 = new RegExp(
  /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/,
);
