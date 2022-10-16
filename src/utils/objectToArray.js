export default (obj) => {
  const result = [];

  if (obj) {
    Object.keys(obj).forEach((key) => {
      result.push({
        key,
        value: obj[key],
      });
    });
  }

  return result;
};
