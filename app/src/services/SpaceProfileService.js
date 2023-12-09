import * as request from '@/utils/request';
import i18n from 'i18next';

const SpaceProfileService = {};

SpaceProfileService.selectSpaceProfileList = (spaceCode, successHandler, failHandler) => {
  return request.get(
    `/api/spaces/${spaceCode}/profiles`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    true,
    i18n.t('스페이스 변수를 검색합니다.'),
  );
};

SpaceProfileService.createSpaceProfileInfo = (spaceCode, spaceProfile, successHandler, failHandler) => {
  return request.post(
    `/api/spaces/${spaceCode}/profiles`,
    spaceProfile,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

export default SpaceProfileService;
