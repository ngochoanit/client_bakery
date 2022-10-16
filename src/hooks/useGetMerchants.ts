import { useEffect, useState } from 'react';
import { IMerchant } from 'src/@types/entities/Merchant';
import { getListMerchant } from 'src/apis/merchant';
import { isAdmin } from 'src/helpers';
import { useAppSelector } from 'src/redux';

const useGetMerchants = () => {
  const [merchants, setMerchants] = useState<IMerchant[] | undefined>();
  const userInfo = useAppSelector((s) => s.auth.user);
  useEffect(() => {
    const getMerchants = async () => {
      if (userInfo && isAdmin(userInfo.role)) {
        const response = await getListMerchant({
          records: Number.MAX_SAFE_INTEGER,
        });
        if (response && response.data) {
          setMerchants([...response.data]);
        }
      }
    };
    getMerchants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);
  return merchants;
};
export default useGetMerchants;
