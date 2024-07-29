import { action, computed, makeObservable, observable } from 'mobx';

export default class ContextStore {
  space = null;

  projectId = null;

  refreshProjectTime = null;

  collapsed = null;

  hoverMenu = null;

  constructor() {
    makeObservable(this, {
      space: observable,
      projectId: observable,
      setSpace: action,
      setProjectId: action,
      isProjectSelected: computed,
      isSpaceSelected: computed,
      refreshProjectTime: observable,
      setRefreshProjectList: action,
      collapsed: observable,
      setCollapsed: action,
      hoverMenu: observable,
      setHoverMenu: action,
    });
  }

  setSpace = space => {
    this.space = space;
  };

  setProjectId = projectId => {
    this.projectId = Number(projectId);
  };

  setRefreshProjectList = () => {
    this.refreshProjectTime = Date.now();
  };

  setCollapsed = collapsed => {
    this.collapsed = collapsed;
  };

  setHoverMenu = hoverMenu => {
    this.hoverMenu = hoverMenu;
  };

  get isProjectSelected() {
    return !!this.space?.code && !!this.projectId && Number.isInteger(this.projectId);
  }

  get isSpaceSelected() {
    return !!this.space?.code;
  }

  get spaceCode() {
    return this.space?.code;
  }
}
