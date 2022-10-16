export const generateArray = (start: number, end: number) => {
  const indexs: number[] = [];
  // eslint-disable-next-line no-plusplus
  for (let i = start; i < end; i++) {
    indexs.push(i);
  }
  return indexs;
};
