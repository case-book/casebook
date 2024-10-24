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
    i18n.t('케이스시퀀스 정보를 가져오고 있습니다.'),
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
    i18n.t('케이스시퀀스 목록을 가져오고 있습니다.'),
  );
};

SequenceService.createSequence = (spaceCode, projectId, sequence, successHandler, failHandler) => {
  return request.post(
    `/api/${spaceCode}/projects/${projectId}/sequences`,
    sequence,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

SequenceService.deleteSequence = (spaceCode, projectId, sequenceId, successHandler, failHandler) => {
  return request.del(
    `/api/${spaceCode}/projects/${projectId}/sequences/${sequenceId}`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

SequenceService.updateSequence = (spaceCode, projectId, sequenceId, sequence, successHandler, failHandler) => {
  return request.put(
    `/api/${spaceCode}/projects/${projectId}/sequences/${sequenceId}`,
    sequence,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

export default SequenceService;
