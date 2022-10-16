export type ArrayToObjectConfig<T> = {
  keyField: keyof T;
  valueField?: (keyof T)[] | keyof T;
};

function arrayToObject<T>(arr: T[], config: ArrayToObjectConfig<T>) {
  const result: { [key: string | number]: any } = {};
  arr.forEach((item) => {
    if (
      typeof item[config.keyField] !== 'string' ||
      typeof item[config.keyField] !== 'number'
    ) {
      throw new Error(
        `The keyField must be a string or number. The value is ${
          item[config.keyField]
        }`,
      );
    }
    if (config.valueField) {
      const val: { [key: string]: any } = {};
      if (Array.isArray(config.valueField)) {
        config.valueField.forEach((field) => {
          val[field.toString()] = item[field];
        });
        // @ts-ignore
        result[item[config.keyField]] = val;
      } else {
        // @ts-ignore
        result[item[config.keyField]] = {
          [config.valueField.toString()]: item[config.valueField],
        };
      }
    }
  });
}

export default arrayToObject;
