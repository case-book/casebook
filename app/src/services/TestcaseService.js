import * as request from '@/utils/request';

const TestcaseService = {};

TestcaseService.updateConfig = (spaceCode, projectId, testcaseConfig, successHandler, failHandler) => {
  return request.put(
    `/api/${spaceCode}/projects/${projectId}/testcases/config`,
    testcaseConfig,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

TestcaseService.selectConfig = (spaceCode, projectId, successHandler, failHandler) => {
  return request.get(
    `/api/${spaceCode}/projects/${projectId}/testcases/templates`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

TestcaseService.createTestcaseGroup = (spaceCode, projectId, testcaseGroup, successHandler, failHandler) => {
  return request.post(
    `/api/${spaceCode}/projects/${projectId}/testcases/groups`,
    testcaseGroup,
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    false,
  );
};

export default TestcaseService;
