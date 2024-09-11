import * as request from '@/utils/request';
import i18n from 'i18next';

const SequenceService = {};

SequenceService.selectSequence = (spaceCode, projectId, sequenceId, successHandler, failHandler, loading = true) => {
  return request.get(
    `/api/${spaceCode}/projects/${projectId}/sequences/${sequenceId}`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    loading,
    i18n.t('케이스 시퀀스 정보를 가져오고 있습니다.'),
  );
};

SequenceService.selectSequenceList = (spaceCode, projectId, successHandler, failHandler, loading = true) => {
  return request.get(
    `/api/${spaceCode}/projects/${projectId}/sequences`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    loading,
    i18n.t('프로젝트의 릴리스 목록을 가져오고 있습니다.'),
  );
};

/*
SequenceService.createRelease = (spaceCode, projectId, release, successHandler, failHandler) => {
  return request.post(
    `/api/${spaceCode}/projects/${projectId}/releases`,
    release,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

SequenceService.updateRelease = (spaceCode, projectId, releaseId, release, successHandler, failHandler) => {
  return request.put(
    `/api/${spaceCode}/projects/${projectId}/releases/${releaseId}`,
    release,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

SequenceService.deleteRelease = (spaceCode, projectId, releaseId, successHandler, failHandler) => {
  return request.del(
    `/api/${spaceCode}/projects/${projectId}/releases/${releaseId}`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};
*/

export default SequenceService;
