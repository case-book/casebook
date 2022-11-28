import * as request from '@/utils/request';

const TestrunService = {};

TestrunService.selectProjectTestrunList = (spaceCode, projectId, successHandler, failHandler, loading = true) => {
  return request.get(
    `/api/${spaceCode}/projects/${projectId}/testruns`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    loading,
  );
};

export default TestrunService;
