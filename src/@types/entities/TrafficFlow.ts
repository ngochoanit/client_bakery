import RECORD_TYPE from 'src/constants/recordType';

export interface ITrafficFlow {
  id: string;
  recordType: RECORD_TYPE;
  value: string[];
}
export type TTrafficFlowForm = ITrafficFlow;

export interface ITrafficFlowFormSearch {
  recordType: string;
}
