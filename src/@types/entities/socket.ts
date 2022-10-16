import { IDomain } from './Domain';
import { IRecord } from './Record';

export enum RREventType {
  CreateOk = 'Create domain successfully',
  CreateFail = 'Create domain failed',
  DeleteOk = 'Delete domain successfully',
  DeleteFail = 'Delete domain failed',
  UpdateOk = 'Update record successfully',
  UpdateFail = 'Update record failed',
}
export interface IRRSocket {
  data: IDomain | IRecord;
  msg: string;
}
export type TSocketMessage = IRRSocket & {
  event: RREventType;
};
