import { UserType } from './user.type';
import { APPROVAL_STATUS } from 'src/core';

export interface UserSigninPayload {
  _no: number;
  _id: string;
  username: string;
  userType: UserType | string;
  adminRole?: string;
  userStatus?: APPROVAL_STATUS;
  companyStatus?: APPROVAL_STATUS;
}
