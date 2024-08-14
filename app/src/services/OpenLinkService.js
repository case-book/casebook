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
    i18n.t('프로젝트의 오픈 링크 목록을 불러오고 있습니다.'),
  );
};

OpenLinkService.selectOpenLinkInfo = (spaceCode, projectId, openLinkId, successHandler, failHandler, loading = true) => {
  return request.get(
    `/api/${spaceCode}/projects/${projectId}/links/${openLinkId}`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    loading,
    i18n.t('오픈 링크 상세 정보를 불러오고 있습니다.'),
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

OpenLinkService.selectOpenLinkInfoByToken = (token, successHandler, failHandler, loading = true) => {
  return request.get(
    `/api/links/${token}`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    loading,
    i18n.t('오픈 링크 상세 정보를 불러오고 있습니다.'),
  );
};

OpenLinkService.deleteOpenLink = (spaceCode, projectId, openLinkId, successHandler, failHandler, loading = true) => {
  return request.del(
    `/api/${spaceCode}/projects/${projectId}/links/${openLinkId}`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    loading,
    i18n.t('오픈 링크를 삭제하고 있습니다.'),
  );
};

export default OpenLinkService;
