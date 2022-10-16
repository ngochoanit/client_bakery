// eslint-disable-next-line import/no-cycle
import RESPONSE_CODES from 'src/constants/responseCodes';

const getErrorMessage = (code: RESPONSE_CODES) => {
  switch (code) {
    case RESPONSE_CODES.BAD_REQUEST:
      return 'badRequest';
    case RESPONSE_CODES.UNAUTHORIZED:
      return 'unauthorized';
    case RESPONSE_CODES.FORBIDDEN:
      return 'forbidden';
    case RESPONSE_CODES.NOT_FOUND:
      return 'notFound';
    case RESPONSE_CODES.SERVER_ERROR:
      return 'serverError';
    case RESPONSE_CODES.USER_NOT_FOUND:
      return 'userNotFound';
    case RESPONSE_CODES.WRONG_PASSWORD:
      return 'wrongPassword';
    case RESPONSE_CODES.COUNTER_EXISTED:
      return 'counterExisted';
    case RESPONSE_CODES.USER_EXISTS:
      return 'userExists';
    case RESPONSE_CODES.PORTAL_EXISTS:
      return 'portalExists';
    case RESPONSE_CODES.PREFIX_EXISTS:
      return 'prefixExists';
    case RESPONSE_CODES.HOTLINE_IS_EXISTED:
      return 'hotlineIsExisted';
    case RESPONSE_CODES.HOTLINE_IS_USED:
      return 'hotlineIsUsed';
    case RESPONSE_CODES.WORKFLOW_DOES_NOT_EXIST:
      return 'workflowDoesNotExist';
    case RESPONSE_CODES.USER_JOINED_PORTAL:
      return 'userJoinedPortal';
    case RESPONSE_CODES.OPTION_GROUP_CANNOT_DELETE:
      return 'optionGroupCannotDelete';
    case RESPONSE_CODES.GROUP_DOES_NOT_EXIST:
      return 'groupDoesNotExist';
    case RESPONSE_CODES.OPTION_SCHEDULE_CANNOT_DELETE:
      return 'optionScheduleCannotDelete';
    case RESPONSE_CODES.PORTAL_NOT_FOUND:
      return 'portalNotFound';
    case RESPONSE_CODES.MEMBER_NOT_FOUND:
      return 'memberNotFound';
    case RESPONSE_CODES.INVALID_WORKFLOW_NODES:
      return 'invalidWorkflowNodes';
    case RESPONSE_CODES.INVALID_CONTACT_FILE:
      return 'invalidContactFile';
    case RESPONSE_CODES.REQUIRED_PHONE_NUMBER_IN_CONTACT_FILE_UPLOAD:
      return 'requiredPhoneNumberInContactFile';
    case RESPONSE_CODES.CONTACT_PHONE_NUMBER_EXISTED:
      return 'contactPhoneNumberExisted';
    case RESPONSE_CODES.TTS_ERROR:
      return 'ttsError';
    case RESPONSE_CODES.UPLOAD_URL_ERROR:
      return 'uploadUrlError';
    case RESPONSE_CODES.UPLOAD_FILE_ERROR:
      return 'uploadFileError';
    default:
      return 'serverError';
  }
};

export default getErrorMessage;
