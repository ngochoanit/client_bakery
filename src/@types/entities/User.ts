import ROLE from 'src/constants/role';

export interface IBaseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  merchantId?: string;
  status: string;
  updatedAt: string;
  createdAt: string;
}

export interface IAdmin extends IBaseUser {
  role: ROLE.ADMIN;
}

export interface IUser extends IBaseUser {
  role: ROLE.USER;
}
export interface IMerchant extends IBaseUser {
  role: ROLE.MERCHANT;
}

export type TUserInfo = IUser | IAdmin | IMerchant;
// export type TUser = Admin | Audit;
export interface IUerFormSearch {
  email?: string;
  role?: ROLE | '';
  status?: number | '';
  merchantId?: string;
}

export interface IFormUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: ROLE;
  merchantId?: string;
}
