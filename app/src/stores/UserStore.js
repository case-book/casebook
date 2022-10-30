import { action, computed, makeObservable, observable } from 'mobx';
import { getOption, setOption } from '@/utils/storageUtil';

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

  notification = {
    pageNo: 0,
    list: [],
    lastSeen: getOption('user', 'notification', 'lastSeen') || null,
    hasNext: false,
  };

  tried = null;

  constructor() {
    makeObservable(this, {
      user: observable,
      tried: observable,
      notification: observable,
      setUser: action,
      setTried: action,
      isLogin: computed,
      addSpace: action,
      setNotification: action,
      setNotificationLastSeen: action,
    });
  }

  setUser = user => {
    this.user = {
      ...user,
    };
  };

  setNotification = (pageNo, list) => {
    this.notification = {
      ...this.notification,
      pageNo,
      list,
      hasNext: list?.length >= 10,
    };
  };

  setNotificationLastSeen = () => {
    const lastSeen = Date.now();
    const nextNotification = {
      ...this.notification,
      lastSeen,
    };

    setOption('user', 'notification', 'lastSeen', lastSeen);
    this.notification = nextNotification;
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
