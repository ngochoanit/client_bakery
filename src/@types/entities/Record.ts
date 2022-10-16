import RECORD_TYPE from 'src/constants/recordType';
import STATE from 'src/constants/state';
import STATUS from 'src/constants/status';

export interface IRecord {
  id: string;
  name: string;
  type: RECORD_TYPE;
  status: STATUS;
  state: STATE;
  ttl: number;
  defaultRecord: boolean;
  content: string[] | number[];
  merchantId: string;
}
export interface IFormRecord {
  merchantId?: string;
  name: string;
  type: RECORD_TYPE;
  status: STATUS;
  ttl: number;
  content: string[] | number[];
}

export interface IRecordFormSearch {
  name: string;
  type: RECORD_TYPE | '';
  status: RECORD_TYPE | '';
}
