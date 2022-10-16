const sleep = (waitTime = 500) => {
  return new Promise((resolve) => setTimeout(resolve, waitTime));
};

export default sleep;
