export interface IMerchant {
  id: string;
  name: string;
  email: string;
  description: string;
  status: string;
}
export interface IFormMerchant {
  id?: string;
  name: string;
  email: string;
  description: string;
}
export interface IMerchantFormSearch {
  id: string;
  name: string;
  email: string;
}
