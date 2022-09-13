import { action, computed, makeObservable, observable } from 'mobx';

export default class UserStore {
  user = {
    id: null,
    uuid: null,
    roleCode: null,
    token: null,
    email: null,
    name: null,
    spaces: null,
  };

  tried = null;

  constructor() {
    makeObservable(this, {
      user: observable,
      tried: observable,
      setUser: action,
      setTried: action,
      isLogin: computed,
      addSpace: action,
    });
  }

  setUser = user => {
    this.user = {
      ...user,
    };
  };

  addSpace = space => {
    const next = { ...this.user };
    if (!next.spaces) {
      next.spaces = [];
    }
    next.spaces.push(space);
    this.user = {
      ...next,
    };
  };

  setTried = tried => {
    this.tried = tried;
  };

  get isLogin() {
    return !!this.user?.id;
  }
}
