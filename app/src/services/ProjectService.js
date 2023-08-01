import * as request from '@/utils/request';
import i18n from 'i18next';

const ProjectService = {};

ProjectService.selectProjectList = (spaceCode, successHandler, failHandler, loading = true) => {
  return request.get(
    `/api/${spaceCode}/projects`,
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

ProjectService.selectMyProjectList = (spaceCode, successHandler, failHandler, loading = true) => {
  return request.get(
    `/api/${spaceCode}/projects/my`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    loading,
    i18n.t('사용자가 참여중인 프로젝트 목록을 가져오고 있습니다.'),
  );
};

ProjectService.selectProjectInfo = (spaceCode, projectId, successHandler, failHandler) => {
  return request.get(
    `/api/${spaceCode}/projects/${projectId}`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

ProjectService.selectProjectName = (spaceCode, projectId, successHandler, failHandler) => {
  return request.get(
    `/api/${spaceCode}/projects/${projectId}/name`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

ProjectService.createProject = (spaceCode, project, successHandler, failHandler) => {
  return request.post(
    `/api/${spaceCode}/projects`,
    project,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

ProjectService.updateProject = (spaceCode, project, successHandler, failHandler) => {
  return request.put(
    `/api/${spaceCode}/projects/${project.id}`,
    project,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

ProjectService.deleteProject = (spaceCode, project, successHandler, failHandler) => {
  return request.del(
    `/api/${spaceCode}/projects/${project.id}`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

ProjectService.withdrawProject = (spaceCode, project, successHandler, failHandler) => {
  return request.del(
    `/api/${spaceCode}/projects/${project.id}/users/my`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

ProjectService.createImage = (spaceCode, projectId, name, size, type, file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', name);
  formData.append('size', size);
  formData.append('type', type);

  return request.post(`/api/${spaceCode}/projects/${projectId}/images`, formData, null, null, null, null, null, true);
};

ProjectService.getProjectTokenList = (spaceCode, projectId, successHandler, failHandler) => {
  return request.get(
    `/api/${spaceCode}/projects/${projectId}/tokens`,
    {},
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

ProjectService.createProjectToken = (spaceCode, projectId, projectToken, successHandler, failHandler) => {
  return request.post(
    `/api/${spaceCode}/projects/${projectId}/tokens`,
    projectToken,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

ProjectService.updateProjectToken = (spaceCode, projectId, projectTokenId, projectToken, successHandler, failHandler) => {
  return request.put(
    `/api/${spaceCode}/projects/${projectId}/tokens/${projectTokenId}`,
    projectToken,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

ProjectService.deleteProjectToken = (spaceCode, projectId, projectTokenId, successHandler, failHandler) => {
  return request.del(
    `/api/${spaceCode}/projects/${projectId}/tokens/${projectTokenId}`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

ProjectService.getIntegrationInfo = (spaceCode, projectId, successHandler, failHandler) => {
  return request.get(
    `/api/${spaceCode}/projects/${projectId}/integrations`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

ProjectService.updateJiraProjectIntegration = (spaceCode, projectId, data, successHandler, failHandler) => {
  return request.put(
    `/api/${spaceCode}/projects/${projectId}/integrations/jira`,
    { ...data },
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

export default ProjectService;
