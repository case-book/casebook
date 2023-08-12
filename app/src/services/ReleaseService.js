import * as request from '@/utils/request';
import i18n from 'i18next';

const ReleaseService = {};

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

export default ReleaseService;
