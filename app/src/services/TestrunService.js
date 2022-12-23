import * as request from '@/utils/request';

const TestrunService = {};

TestrunService.selectProjectTestrunList = (spaceCode, projectId, option, successHandler, failHandler, loading = true) => {
  return request.get(
    `/api/${spaceCode}/projects/${projectId}/testruns?status=${option}`,
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

TestrunService.selectUserAssignedTestrunList = (spaceCode, projectId, successHandler, failHandler, loading = true) => {
  return request.get(
    `/api/${spaceCode}/projects/${projectId}/testruns/assigned`,
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

TestrunService.createProjectTestrunInfo = (spaceCode, projectId, testrun, successHandler, failHandler) => {
  return request.post(
    `/api/${spaceCode}/projects/${projectId}/testruns`,
    testrun,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

TestrunService.selectTestrunInfo = (spaceCode, projectId, testrunId, successHandler, failHandler, loading = true) => {
  return request.get(
    `/api/${spaceCode}/projects/${projectId}/testruns/${testrunId}`,
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

TestrunService.selectTestrunTestcaseGroupTestcase = (spaceCode, projectId, testrunId, testrunTestcaseGroupId, testrunTestcaseGroupTestcaseId, successHandler, failHandler) => {
  return request.get(
    `/api/${spaceCode}/projects/${projectId}/testruns/${testrunId}/groups/${testrunTestcaseGroupId}/testcases/${testrunTestcaseGroupTestcaseId}`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    false,
  );
};

TestrunService.deleteTestrunInfo = (spaceCode, projectId, testrunId, successHandler, failHandler, loading = true) => {
  return request.del(
    `/api/${spaceCode}/projects/${projectId}/testruns/${testrunId}`,
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

TestrunService.updateTestrunStatusClosed = (spaceCode, projectId, testrunId, successHandler, failHandler, loading = true) => {
  return request.put(
    `/api/${spaceCode}/projects/${projectId}/testruns/${testrunId}/status/closed`,
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

TestrunService.updateTestrunResultItems = (spaceCode, projectId, testrunId, testrunTestcaseGroupId, testrunTestcaseGroupTestcaseId, testrunResult, successHandler, failHandler, loading = true) => {
  return request.put(
    `/api/${spaceCode}/projects/${projectId}/testruns/${testrunId}/groups/${testrunTestcaseGroupId}/testcases/${testrunTestcaseGroupTestcaseId}`,
    testrunResult,
    res => {
      if (successHandler) {
        successHandler(res);
      }
    },
    failHandler,
    null,
    null,
    loading,
  );
};

TestrunService.updateTestrunResult = (spaceCode, projectId, testrunId, testrunTestcaseGroupId, testrunTestcaseGroupTestcaseId, testResult, successHandler, failHandler, loading = true) => {
  return request.put(
    `/api/${spaceCode}/projects/${projectId}/testruns/${testrunId}/groups/${testrunTestcaseGroupId}/testcases/${testrunTestcaseGroupTestcaseId}/result`,
    { testResult },
    res => {
      if (successHandler) {
        successHandler(res);
      }
    },
    failHandler,
    null,
    null,
    loading,
  );
};

TestrunService.updateTestrunTester = (spaceCode, projectId, testrunId, testrunTestcaseGroupId, testrunTestcaseGroupTestcaseId, testerId, successHandler, failHandler, loading = true) => {
  return request.put(
    `/api/${spaceCode}/projects/${projectId}/testruns/${testrunId}/groups/${testrunTestcaseGroupId}/testcases/${testrunTestcaseGroupTestcaseId}/tester`,
    { testerId },
    res => {
      if (successHandler) {
        successHandler(res);
      }
    },
    failHandler,
    null,
    null,
    loading,
  );
};

TestrunService.updateTestrunComment = (spaceCode, projectId, testrunId, testrunTestcaseGroupId, testrunTestcaseGroupTestcaseId, comment, successHandler, failHandler, loading = true) => {
  return request.put(
    `/api/${spaceCode}/projects/${projectId}/testruns/${testrunId}/groups/${testrunTestcaseGroupId}/testcases/${testrunTestcaseGroupTestcaseId}/comments`,
    comment,
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    loading,
  );
};

TestrunService.deleteTestrunComment = (
  spaceCode,
  projectId,
  testrunId,
  testrunTestcaseGroupId,
  testrunTestcaseGroupTestcaseId,
  testrunTestcaseGroupTestcaseCommentId,
  successHandler,
  failHandler,
  loading = true,
) => {
  return request.del(
    `/api/${spaceCode}/projects/${projectId}/testruns/${testrunId}/groups/${testrunTestcaseGroupId}/testcases/${testrunTestcaseGroupTestcaseId}/comments/${testrunTestcaseGroupTestcaseCommentId}`,
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
