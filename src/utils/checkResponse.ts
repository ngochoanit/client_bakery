export const checkResponseIsObject = (resp: any) => {
  if (!resp || !resp.result || typeof resp.result !== 'object') {
    throw new Error('serverError');
  }
};

export const checkResponseIsArray = (resp: any) => {
  if (!resp || !resp.result || !Array.isArray(resp.result)) {
    throw new Error('serverError');
  }
};
