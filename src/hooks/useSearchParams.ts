import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { omitIsNil } from 'src/utils/omit';

const useSearchParams = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [allParams, setAllParams] = useState({});

  const addParams = <T extends Record<string, string | number | boolean>>(
    params: T,
  ) => {
    const searchParams = queryString.parse(location.search);
    const newSearchParams = { ...searchParams, ...params };
    omitIsNil(newSearchParams, { deep: false });
    const searchString = queryString.stringify(newSearchParams);
    navigate(`${location.pathname}?${searchString}`);
  };

  const removeParam = (paramName: string) => {
    if (!paramName) return;
    const searchParams = queryString.parse(location.search);
    delete searchParams[paramName];
    const searchString = queryString.stringify(searchParams);
    navigate(`${location.pathname}?${searchString}`);
  };

  const removeAllParams = () => {
    if (!location.search) return;
    location.search = '';
  };
  const getAllParams = <T>(initData: T) => {
    const params = { ...initData, ...queryString.parse(location.search) };

    return params as unknown as T;
  };
  const getParam = (value: string) => {
    return value;
  };
  useEffect(() => {
    setAllParams(getAllParams({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return {
    allParams,
    addParams,
    removeParam,
    removeAllParams,
    getAllParams,
    getParam,
  };
};

export default useSearchParams;
