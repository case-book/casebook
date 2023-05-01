import * as request from '@/utils/request';
import i18n from 'i18next';

const TestrunService = {};

TestrunService.selectProjectTestrunList = (spaceCode, projectId, option, testrunCreationType, successHandler, failHandler, loading = true) => {
  return request.get(
    `/api/${spaceCode}/projects/${projectId}/testruns?status=${option}&&testrunCreationType=${testrunCreationType}`,
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

TestrunService.selectProjectTestrunReservationList = (spaceCode, projectId, option, successHandler, failHandler, loading = true) => {
  return request.get(
    `/api/${spaceCode}/projects/${projectId}/testruns/reservation?expired=${option}`,
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
    i18n.t('사용자에게 할당된 테스트케이스 목록을 가져오고 있습니다.'),
  );
};
TestrunService.selectTestrunHistoryList = (spaceCode, projectId, start, end, successHandler, failHandler, loading = true) => {
  return request.get(
    `/api/${spaceCode}/projects/${projectId}/testruns/history?start=${start}&end=${end}`,
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

TestrunService.createProjectTestrunReservationInfo = (spaceCode, projectId, testrun, successHandler, failHandler) => {
  return request.post(
    `/api/${spaceCode}/projects/${projectId}/testruns/reservation`,
    testrun,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

TestrunService.updateProjectTestrunInfo = (spaceCode, projectId, testrun, successHandler, failHandler) => {
  return request.put(
    `/api/${spaceCode}/projects/${projectId}/testruns/${testrun.id}`,
    testrun,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

TestrunService.updateProjectTestrunReservationInfo = (spaceCode, projectId, testrunReservation, successHandler, failHandler) => {
  return request.put(
    `/api/${spaceCode}/projects/${projectId}/testruns/reservations/${testrunReservation.id}`,
    testrunReservation,
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
    i18n.t('테스트런 상세 정보를 불러오고 있습니다.'),
  );
};

TestrunService.selectTestrunReservationInfo = (spaceCode, projectId, testrunReservationId, successHandler, failHandler, loading = true) => {
  return request.get(
    `/api/${spaceCode}/projects/${projectId}/testruns/reservations/${testrunReservationId}`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    loading,
    i18n.t('테스트런 상세 정보를 불러오고 있습니다.'),
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

TestrunService.deleteTestrunReservationInfo = (spaceCode, projectId, testrunId, successHandler, failHandler, loading = true) => {
  return request.del(
    `/api/${spaceCode}/projects/${projectId}/testruns/reservations/${testrunId}`,
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

TestrunService.updateTestrunStatusOpened = (spaceCode, projectId, testrunId, successHandler, failHandler, loading = true) => {
  return request.put(
    `/api/${spaceCode}/projects/${projectId}/testruns/${testrunId}/status/opened`,
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

TestrunService.updateTestrunResultItem = (spaceCode, projectId, testrunId, testrunTestcaseGroupTestcaseId, testcaseTemplateItemId, testrunItem, successHandler, failHandler, loading = false) => {
  return request.put(
    `/api/${spaceCode}/projects/${projectId}/testruns/${testrunId}/testcases/${testrunTestcaseGroupTestcaseId}/items/${testcaseTemplateItemId}`,
    testrunItem,
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

TestrunService.createImage = (spaceCode, projectId, testrunId, name, size, type, file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', name);
  formData.append('size', size);
  formData.append('type', type);

  return request.post(`/api/${spaceCode}/projects/${projectId}/testruns/${testrunId}/images`, formData, null, null, null, null, null, true);
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
