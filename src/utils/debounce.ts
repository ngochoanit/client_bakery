let timeout: NodeJS.Timeout;
function debounce<A extends any[], R>(
  func: (...args: A) => R,
  wait = 500,
): (...args: Parameters<typeof func>) => void {
  return (...args) => {
    const executeFunction = () => {
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(executeFunction, wait);
  };
}
export default debounce;
