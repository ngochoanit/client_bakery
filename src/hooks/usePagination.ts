/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { PAGE_SIZE } from 'src/configs';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import { RRCommonArray } from 'src/@types/apis/RequestResponse';
import { TUserInfo } from 'src/@types/entities/User';
import useSearchParams from './useSearchParams';

const usePagination = <T, V>(
  initData: T[],
  apiConfig: (param: V) => Promise<RRCommonArray<T> | undefined>,
  disabled?: boolean,
  user?: TUserInfo | null,
) => {
  const [data, setData] = useState(initData);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { addParams } = useSearchParams();

  const parseSearch = (searchString: string) => {
    const options = queryString.parse(searchString);
    const { page = '1', ...searchParams } = options;
    const pageNumber = parseInt(page as string, 10);
    const currentPage = pageNumber >= 1 ? pageNumber : 1;
    const offset = (currentPage - 1) * PAGE_SIZE;

    return { currentPage, offset, searchParams };
  };
  const getCurrentPage = () => {
    const { currentPage } = parseSearch(location.search);
    return currentPage;
  };
  const getOffset = () => {
    const { offset } = parseSearch(location.search);
    return offset;
  };
  const handleCallApi = async (params: V) => {
    if (disabled) {
      setData([]);
      return;
    }
    setLoading(true);
    const response = await apiConfig(params);
    if (response) {
      // setTotal(Math.ceil((response?.total ?? 0) / PAGE_SIZE));
      setTotal(response?.total ?? 0);
      setData(response.data);
    }
    setLoading(false);
  };

  const handleChangePagination = (p: number) => {
    if (p !== getCurrentPage()) {
      addParams({ page: p });
    }
  };

  useEffect(() => {
    const { searchParams } = parseSearch(location.search);
    handleCallApi({
      ...searchParams,
      records: PAGE_SIZE,
      page: getCurrentPage(),
    } as unknown as V);
  }, [location, user]);

  const reloadData = async () => {
    const { searchParams } = parseSearch(location.search);
    await handleCallApi({
      records: PAGE_SIZE,
      ...searchParams,
      page: getCurrentPage(),
    } as unknown as V);
  };
  const updateData = (dataNew: T[], totalNew = total) => {
    if (dataNew.length === 0) {
      handleChangePagination(getCurrentPage() - 1);
    } else {
      setData(dataNew);
      setTotal(totalNew);
    }
  };
  return {
    data,
    setData,
    updateData,
    offset: getOffset(),
    currentPage: getCurrentPage(),
    total,
    pageSize: PAGE_SIZE,
    onPaginationChange: handleChangePagination,
    handleCallApi,
    loading,
    reloadData,
  };
};
export default usePagination;
