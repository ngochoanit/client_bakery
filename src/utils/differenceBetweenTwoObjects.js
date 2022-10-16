// eslint-disable-next-line @typescript-eslint/no-unused-vars
import has from 'lodash/has';
import isEqual from 'lodash/isEqual';
import reduce from 'lodash/reduce';

export const difference = (object, base) => {
  return reduce(
    object,
    (result, value, key) => {
      if (has(base, key)) {
        if (!isEqual(value, base[key])) {
          result[key] = value;
        }
      } else {
        result[key] = value;
      }
      return result;
    },
    {},
  );
};
