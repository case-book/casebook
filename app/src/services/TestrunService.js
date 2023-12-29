import * as request from '@/utils/request';
import { waitFor } from '@/utils/request';
import i18n from 'i18next';
import SpaceVariableService from '@/services/SpaceVariableService';
import SpaceProfileVariableService from '@/services/SpaceProfileVariableService';
import { convertTestrun } from '@/pages/spaces/projects/testruns/TestrunExecutePage/variableUtil';

const TestrunService = {};

function convert(responses) {
  const profileVariables = responses[0].data;
  const spaceProfileVariables = responses[1].data;
  const orgTestrunInfo = responses[2].data;
  const profileIds = orgTestrunInfo.profileIds || [];

  const variables = profileVariables.reduce((obj, next) => {
    const current = obj;
    current[next.name] = next.id;
    return current;
  }, {});

  Object.keys(variables).forEach(key => {
    const variableId = variables[key];
    let value = '';
    profileIds.forEach(profileId => {
      const varInfo = spaceProfileVariables.find(d => d.spaceVariable.id === variableId && d.spaceProfile.id === profileId);
      if (varInfo?.value) {
        value = varInfo?.value || null;
      }
    });

    variables[key] = value;
  });

  const info = convertTestrun(responses[2].data, variables);
  return {
    info,
    variables,
  };
}

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
    i18n.t('프로젝트의 테스트런 목록을 불러오고 있습니다.'),
  );
};

TestrunService.selectProjectTestrunReservationList = (spaceCode, projectId, option, successHandler, failHandler, loading = true) => {
  return request.get(
    `/api/${spaceCode}/projects/${projectId}/testruns/reservations?expired=${option}`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    loading,
    i18n.t('프로젝트의 예약 테스트런 목록을 불러오고 있습니다.'),
  );
};

TestrunService.selectProjectTestrunIterationList = (spaceCode, projectId, option, successHandler, failHandler, loading = true) => {
  return request.get(
    `/api/${spaceCode}/projects/${projectId}/testruns/iterations?expired=${option}`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    loading,
    i18n.t('프로젝트의 반복 테스트런 목록을 불러오고 있습니다.'),
  );
};

TestrunService.selectUserAssignedTestrunList = (spaceCode, projectId, successHandler, failHandler, loading = true) => {
  const promises = [];
  promises.push(SpaceVariableService.selectSpaceVariableList(spaceCode));
  promises.push(SpaceProfileVariableService.selectSpaceProfileVariableList(spaceCode));
  promises.push(
    request.get(
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
    ),
  );

  waitFor(promises).then(responses => {
    const profileVariables = responses[0].data;
    const spaceProfileVariables = responses[1].data;
    const testrunList = responses[2].data;

    const variables = profileVariables.reduce((obj, next) => {
      const current = obj;
      current[next.name] = next.id;
      return current;
    }, {});

    testrunList.forEach(testrun => {
      const profileIds = testrun.profileIds || [];

      Object.keys(variables).forEach(key => {
        const variableId = variables[key];
        let value = '';
        profileIds.forEach(profileId => {
          const varInfo = spaceProfileVariables.find(d => d.spaceVariable.id === variableId && d.spaceProfile.id === profileId);
          if (varInfo?.value) {
            value = varInfo?.value || null;
          }
        });

        variables[key] = value;
      });

      // eslint-disable-next-line no-param-reassign
      testrun = convertTestrun(testrun, variables);
    });

    successHandler(testrunList);
  });
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
    `/api/${spaceCode}/projects/${projectId}/testruns/reservations`,
    testrun,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

TestrunService.createProjectTestrunIterationInfo = (spaceCode, projectId, testrunIteration, successHandler, failHandler) => {
  return request.post(
    `/api/${spaceCode}/projects/${projectId}/testruns/iterations`,
    testrunIteration,
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

TestrunService.updateProjectTestrunIterationInfo = (spaceCode, projectId, testrunIteration, successHandler, failHandler) => {
  return request.put(
    `/api/${spaceCode}/projects/${projectId}/testruns/iterations/${testrunIteration.id}`,
    testrunIteration,
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
  const promises = [];
  promises.push(SpaceVariableService.selectSpaceVariableList(spaceCode));
  promises.push(SpaceProfileVariableService.selectSpaceProfileVariableList(spaceCode));
  promises.push(
    request.get(
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
    ),
  );

  waitFor(promises).then(responses => {
    const result = convert(responses);
    successHandler(result.info, result.variables);
  });
};

TestrunService.selectTestrunReservationInfo = (spaceCode, projectId, testrunReservationId, successHandler, failHandler, loading = true) => {
  const promises = [];
  promises.push(SpaceVariableService.selectSpaceVariableList(spaceCode));
  promises.push(SpaceProfileVariableService.selectSpaceProfileVariableList(spaceCode));
  promises.push(
    request.get(
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
    ),
  );

  waitFor(promises).then(responses => {
    const result = convert(responses);
    successHandler(result.info, result.variables);
  });
};

TestrunService.selectTestrunIterationInfo = (spaceCode, projectId, testrunIterationId, successHandler, failHandler, loading = true) => {
  const promises = [];
  promises.push(SpaceVariableService.selectSpaceVariableList(spaceCode));
  promises.push(SpaceProfileVariableService.selectSpaceProfileVariableList(spaceCode));
  promises.push(
    request.get(
      `/api/${spaceCode}/projects/${projectId}/testruns/iterations/${testrunIterationId}`,
      null,
      res => {
        successHandler(res);
      },
      failHandler,
      null,
      null,
      loading,
      i18n.t('반복 테스트런 상세 정보를 불러오고 있습니다.'),
    ),
  );

  waitFor(promises).then(responses => {
    const result = convert(responses);
    successHandler(result.info, result.variables);
  });
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

TestrunService.deleteTestrunIterationInfo = (spaceCode, projectId, testrunId, successHandler, failHandler, loading = true) => {
  return request.del(
    `/api/${spaceCode}/projects/${projectId}/testruns/iterations/${testrunId}`,
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

TestrunService.updateTestrunTesterRandom = (spaceCode, projectId, testrunId, testerId, targetId, target, reason, successHandler, failHandler, loading = true) => {
  return request.put(
    `/api/${spaceCode}/projects/${projectId}/testruns/${testrunId}/tester/random`,
    { testerId, targetId, target, reason },
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

TestrunService.updateTestrunTestcaseComment = (spaceCode, projectId, testrunId, testrunTestcaseGroupId, testrunTestcaseGroupTestcaseId, comment, successHandler, failHandler, loading = true) => {
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

TestrunService.deleteTestrunTestcaseComment = (
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

TestrunService.selectTestrunCommentList = (spaceCode, projectId, testrunId, successHandler, failHandler, loading = true) => {
  return request.get(
    `/api/${spaceCode}/projects/${projectId}/testruns/${testrunId}/comments`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    loading,
    i18n.t('테스트런 코멘트 목록을 불러오고 있습니다.'),
  );
};

TestrunService.createTestrunComment = (spaceCode, projectId, testrunId, comment, successHandler, failHandler, loading = true) => {
  return request.post(
    `/api/${spaceCode}/projects/${projectId}/testruns/${testrunId}/comments`,
    { comment },
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    loading,
  );
};

TestrunService.deleteTestrunComment = (spaceCode, projectId, testrunId, commentId, successHandler, failHandler, loading = true) => {
  return request.del(
    `/api/${spaceCode}/projects/${projectId}/testruns/${testrunId}/comments/${commentId}`,
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

TestrunService.executeTestrunHook = (spaceCode, projectId, testrunHook, successHandler, failHandler, loading = true) => {
  return request.post(
    `/api/${spaceCode}/projects/${projectId}/testruns/hooks/execute`,
    testrunHook,
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
