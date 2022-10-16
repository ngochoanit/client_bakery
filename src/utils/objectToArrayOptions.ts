const objectToArrayOptions = (
  objectConvert: { [key: string]: string },
  optionFirst?: { key: string; value: string },
) => {
  const arr = Object.entries(objectConvert).map(([k, v]) => {
    return { key: v, value: k };
  });
  if (optionFirst) {
    arr.unshift(optionFirst);
  }
  return arr;
};
export default objectToArrayOptions;
