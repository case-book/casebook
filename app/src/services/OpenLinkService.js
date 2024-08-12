import * as request from '@/utils/request';
import i18n from 'i18next';

const OpenLinkService = {};

OpenLinkService.selectOpenLinkList = (spaceCode, projectId, successHandler, failHandler, loading = true) => {
  return request.get(
    `/api/${spaceCode}/projects/${projectId}/links`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    loading,
    i18n.t('프로젝트의 테스트런 목록을 불러오고 있습니다.'),
  );
};

OpenLinkService.createOpenLinkInfo = (spaceCode, projectId, openLink, successHandler, failHandler) => {
  return request.post(
    `/api/${spaceCode}/projects/${projectId}/links`,
    openLink,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

export default OpenLinkService;
