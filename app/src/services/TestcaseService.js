import * as request from '@/utils/request';

const TestcaseService = {};

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

TestcaseService.createTestcase = (spaceCode, projectId, testcaseGroupId, testcase, successHandler, failHandler) => {
  return request.post(
    `/api/${spaceCode}/projects/${projectId}/testcases/groups/${testcaseGroupId}/cases`,
    testcase,
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    false,
  );
};

TestcaseService.updateTestcaseGroupOrders = (spaceCode, projectId, testcaseGroupOrderChangeRequest, successHandler, failHandler) => {
  return request.put(
    `/api/${spaceCode}/projects/${projectId}/testcases/orders`,
    testcaseGroupOrderChangeRequest,
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    false,
  );
};

TestcaseService.updateTestcaseTestcaseGroup = (spaceCode, projectId, testcaseId, testcaseGroupOrderChangeRequest, successHandler, failHandler) => {
  return request.put(
    `/api/${spaceCode}/projects/${projectId}/testcases/${testcaseId}/group`,
    testcaseGroupOrderChangeRequest,
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    false,
  );
};

TestcaseService.updateTestcaseOrder = (spaceCode, projectId, testcaseId, testcaseGroupOrderChangeRequest, successHandler, failHandler) => {
  return request.put(
    `/api/${spaceCode}/projects/${projectId}/testcases/${testcaseId}/order`,
    testcaseGroupOrderChangeRequest,
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    false,
  );
};

TestcaseService.deleteTestcaseGroup = (spaceCode, projectId, groupId, successHandler, failHandler) => {
  return request.del(
    `/api/${spaceCode}/projects/${projectId}/testcases/groups/${groupId}`,
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

TestcaseService.updateTestcaseGroupName = (spaceCode, projectId, groupId, name, successHandler, failHandler) => {
  return request.put(
    `/api/${spaceCode}/projects/${projectId}/testcases/groups/${groupId}/name`,
    { name },
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    false,
  );
};

TestcaseService.deleteTestcase = (spaceCode, projectId, testcaseId, successHandler, failHandler) => {
  return request.del(
    `/api/${spaceCode}/projects/${projectId}/testcases/${testcaseId}`,
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

TestcaseService.updateTestcaseName = (spaceCode, projectId, testcaseId, name, successHandler, failHandler) => {
  return request.put(
    `/api/${spaceCode}/projects/${projectId}/testcases/${testcaseId}/name`,
    { name },
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    false,
  );
};

TestcaseService.selectTestcase = (spaceCode, projectId, testcaseId, successHandler, failHandler) => {
  return request.get(
    `/api/${spaceCode}/projects/${projectId}/testcases/${testcaseId}`,
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

TestcaseService.updateTestcase = (spaceCode, projectId, testcaseId, testcase, successHandler, failHandler) => {
  return request.put(
    `/api/${spaceCode}/projects/${projectId}/testcases/${testcaseId}`,
    testcase,
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    false,
  );
};

TestcaseService.createImage = (spaceCode, projectId, testcaseId, name, size, type, file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', name);
  formData.append('size', size);
  formData.append('type', type);

  return request.post(`/api/${spaceCode}/projects/${projectId}/testcases/${testcaseId}/images`, formData, null, null, null, null, null, true);
};

export default TestcaseService;
