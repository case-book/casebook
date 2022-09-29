import { action, computed, makeObservable, observable } from 'mobx';

export default class ContextStore {
  spaceCode = null;

  projectId = null;

  constructor() {
    makeObservable(this, {
      spaceCode: observable,
      projectId: observable,
      setSpaceCode: action,
      setProjectId: action,
      isProjectSelected: computed,
      isSpaceSelected: computed,
    });
  }

  setSpaceCode = spaceCode => {
    this.spaceCode = spaceCode;
  };

  setProjectId = projectId => {
    this.projectId = Number(projectId);
  };

  get isProjectSelected() {
    return !!this.spaceCode && !!this.projectId && Number.isInteger(this.projectId);
  }

  get isSpaceSelected() {
    return !!this.spaceCode;
  }
}
