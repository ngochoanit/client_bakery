import { useEffect, useState } from 'react';
import useWindowSize from './useWindowSize';

const useMaxHeight = (
  ids = ['app-header', 'app-footer', 'app-filter'],
  offsetHeight = 170,
) => {
  const windowSize = useWindowSize();
  const [maxHeight, setMaxHeight] = useState(0);
  useEffect(() => {
    let heightTotal = 0;
    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        heightTotal += element.offsetHeight;
      }
    });
    setMaxHeight(windowSize.height - heightTotal - offsetHeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids, windowSize]);
  return maxHeight;
};
export default useMaxHeight;
