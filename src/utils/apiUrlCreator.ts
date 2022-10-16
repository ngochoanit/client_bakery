/* eslint-disable no-restricted-syntax */
import ENDPOINT from 'src/constants/endpoint';
import queryString from 'query-string';

const apiUrlCreator = (
  baseUrl: string,
  url: ENDPOINT,
  query?:
    | {
        [key: string]: string | number | boolean | null | undefined;
      }
    | FormData,
  param?: { [key: string]: string | number | boolean | null | undefined },
) => {
  let urlString = url.toString();
  if (query) {
    urlString += '?';
    if (query instanceof FormData) {
      const getQueryArr: string[] = [];
      // @ts-ignore
      for (const [key, value] of query.entries()) {
        getQueryArr.push(`${key}=${value}`);
      }
      const getQuery: string = getQueryArr.join('&');
      urlString += getQuery;
    } else {
      urlString += queryString.stringify(query);
    }
  }
  if (param) {
    urlString = urlString.replace(/:([a-zA-Z0-9_]+)/g, (match, p1) => {
      const found = param[p1];
      if (found) {
        return found.toString();
      }
      throw new Error(`${p1} is not found in param`);
    });
  }
  return `${baseUrl}${urlString}`;
};

export default apiUrlCreator;
