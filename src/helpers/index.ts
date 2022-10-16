import ROLE from 'src/constants/role';
import STATE from 'src/constants/state';

export const isUser = (role: ROLE | undefined) => {
  return role === ROLE.USER;
};
export const isAdmin = (role: ROLE | undefined) => {
  return role === ROLE.ADMIN;
};
export const isMerchant = (role: ROLE | undefined) => {
  return role === ROLE.MERCHANT;
};

export const checkStatePending = (state: STATE | undefined) => {
  if (state === STATE.AVAILABLE) {
    return false;
  }
  return true;
};
