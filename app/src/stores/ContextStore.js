import { action, computed, makeObservable, observable } from 'mobx';

export default class ContextStore {
  spaceCode = null;

  projectId = null;

  refreshProjectTime = null;

  constructor() {
    makeObservable(this, {
      spaceCode: observable,
      projectId: observable,
      setSpaceCode: action,
      setProjectId: action,
      isProjectSelected: computed,
      isSpaceSelected: computed,
      refreshProjectTime: observable,
      setRefreshProjectList: action,
    });
  }

  setSpaceCode = spaceCode => {
    this.spaceCode = spaceCode;
  };

  setProjectId = projectId => {
    this.projectId = Number(projectId);
  };

  setRefreshProjectList = () => {
    this.refreshProjectTime = Date.now();
  };

  get isProjectSelected() {
    return !!this.spaceCode && !!this.projectId && Number.isInteger(this.projectId);
  }

  get isSpaceSelected() {
    return !!this.spaceCode;
  }
}
