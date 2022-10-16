import {
  RDRequestForgotPassword,
  // RDrecoverPassword,
  // RDVerifyForgotPassword,
} from 'src/@types/apis/RequestData';
import { RECommon } from 'src/@types/apis/RequestError';
import {
  RRRequestForgotPassword,
  // RRrecoverPassword,
  // RRVerifyForgotPassword,
} from 'src/@types/apis/RequestResponse';
import ENDPOINT from 'src/constants/endpoint';
import { commonRequest } from './api';

export const requestForgotPassword = async (
  body: { email: string },
  config?: {
    errorHandler?: (error: RECommon) => void;
  },
) => {
  const result = await commonRequest<
    RDRequestForgotPassword,
    RRRequestForgotPassword,
    RECommon
  >(
    {
      method: 'POST',
      url: ENDPOINT.FORGOT_PASSWORD,
      data: {
        body,
      },
    },
    config,
  );
  return result;
};

// export const verifyForgotPassword = async (
//   uid: string,
//   token: string,
//   config?: {
//     errorHandler?: (error: RECommon) => void;
//   },
// ) => {
//   const result = await commonRequest<
//     RDVerifyForgotPassword,
//     RRVerifyForgotPassword,
//     RECommon
//   >(
//     {
//       method: 'POST',
//       url: ENDPOINT.VERIFY_RECOVER_PASSWORD,
//       data: {
//         param: { uid, token },
//       },
//     },
//     config,
//   );
//   return result;
// };
// export const recoverPassword = async (
//   uid: string,
//   token: string,
//   password: string,
//   config?: {
//     errorHandler?: (error: RECommon) => void;
//   },
// ) => {
//   const result = await commonRequest<
//     RDrecoverPassword,
//     RRrecoverPassword,
//     RECommon
//   >(
//     {
//       method: 'POST',
//       url: ENDPOINT.RECOVER_PASSWORD,
//       data: {
//         body: { newPassword: password },
//         param: { uid, token },
//       },
//     },
//     config,
//   );
//   return result;
// };
