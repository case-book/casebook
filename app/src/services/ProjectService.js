import * as request from '@/utils/request';

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

ProjectService.createImage = (spaceCode, projectId, name, size, type, file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', name);
  formData.append('size', size);
  formData.append('type', type);

  return request.post(`/api/${spaceCode}/projects/${projectId}/images`, formData, null, null, null, null, null, true);
};

export default ProjectService;
