import * as request from '@/utils/request';
import i18n from 'i18next';

const SpaceVariableService = {};

SpaceVariableService.selectSpaceVariableList = (spaceCode, successHandler, failHandler) => {
  return request.get(
    `/api/spaces/${spaceCode}/variables`,
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

SpaceVariableService.createSpaceVariableInfo = (spaceCode, spaceVariable, successHandler, failHandler) => {
  return request.post(
    `/api/spaces/${spaceCode}/variables`,
    spaceVariable,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

SpaceVariableService.createSpaceProfileVariableInfo = (spaceCode, spaceVariableId, spaceProfileId, spaceProfileVariable, successHandler, failHandler) => {
  return request.put(
    `/api/spaces/${spaceCode}/variables/${spaceVariableId}/profiles/${spaceProfileId}`,
    spaceProfileVariable,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

SpaceVariableService.deleteSpaceProfileVariableInfo = (spaceCode, spaceVariableId, spaceProfileId, successHandler, failHandler) => {
  return request.del(
    `/api/spaces/${spaceCode}/variables/${spaceVariableId}/profiles/${spaceProfileId}`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

export default SpaceVariableService;
