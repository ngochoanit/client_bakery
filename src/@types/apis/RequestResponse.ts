export interface RRRefreshToken {
  ec: number;
  code: number;
  data: { userId: string; accessToken: string; url: string };
}
export interface RRCommonObject<T> {
  ec: number;
  total?: number;
  data: T;
  msg?: string;
}
export interface RRCommonArray<T> {
  ec: number;
  total?: number;
  data: T[];
  msg?: string;
}
export interface RRRequestForgotPassword {
  ok: boolean;
}
