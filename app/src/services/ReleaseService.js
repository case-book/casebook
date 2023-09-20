import * as request from '@/utils/request';
import i18n from 'i18next';

const ReleaseService = {};

ReleaseService.selectRelease = (spaceCode, projectId, releaseId, successHandler, failHandler, loading = true) => {
  return request.get(
    `/api/${spaceCode}/projects/${projectId}/releases/${releaseId}`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    loading,
    i18n.t('릴리즈 정보를 가져오고 있습니다.'),
  );
};

ReleaseService.selectReleaseList = (spaceCode, projectId, successHandler, failHandler, loading = true) => {
  return request.get(
    `/api/${spaceCode}/projects/${projectId}/releases`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    loading,
    i18n.t('프로젝트의 릴리즈 목록을 가져오고 있습니다.'),
  );
};

ReleaseService.createRelease = (spaceCode, projectId, release, successHandler, failHandler) => {
  return request.post(
    `/api/${spaceCode}/projects/${projectId}/releases`,
    release,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

ReleaseService.updateRelease = (spaceCode, projectId, releaseId, release, successHandler, failHandler) => {
  return request.put(
    `/api/${spaceCode}/projects/${projectId}/releases/${releaseId}`,
    release,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

export default ReleaseService;
