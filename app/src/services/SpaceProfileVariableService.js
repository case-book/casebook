import * as request from '@/utils/request';
import i18n from 'i18next';

const SpaceProfileVariableService = {};

SpaceProfileVariableService.selectSpaceProfileVariableList = (spaceCode, successHandler, failHandler) => {
  return request.get(
    `/api/spaces/${spaceCode}/profiles-variables`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    true,
    i18n.t('스페이스 프로파일 변수를 검색합니다.'),
  );
};

export default SpaceProfileVariableService;
