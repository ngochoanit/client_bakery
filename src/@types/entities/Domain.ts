import DOMAIN_SOA_EDIT_API from 'src/constants/domainSoaEditApi';
import DOMAIN_TYPE from 'src/constants/domainType';
import STATE from 'src/constants/state';
import STATUS from 'src/constants/status';

export interface IDomain {
  id: number;
  domainName: string;
  type: DOMAIN_TYPE;
  soaEditApi: DOMAIN_SOA_EDIT_API;
  merchantId: string;
  status: STATUS;
  state: STATE;
  records: string[];
  servers: string[];
}
export interface IFormDomain {
  domainName: string;
  type: DOMAIN_TYPE;
  soaEditApi: DOMAIN_SOA_EDIT_API;
  merchantId: string;
}
export interface IDomainFormSearch {
  domainName: string;
  type: DOMAIN_TYPE | '';
  merchantId: string;
  soaEditApi: DOMAIN_SOA_EDIT_API | '';
}
