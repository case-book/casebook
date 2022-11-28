import { action, computed, makeObservable, observable } from 'mobx';
import { COUNTRIES, LANGUAGES } from '@/constants/constants';

const locales = (window.navigator.language || '').split('-');
const defaultLanguage = locales[0];
const defaultCountry = locales[1];

const language = Object.keys(LANGUAGES).includes(defaultLanguage) ? defaultLanguage : 'en';
const country = Object.keys(COUNTRIES).includes(defaultCountry) ? defaultCountry : 'US';

export default class UserStore {
  user = {
    id: null,
    uuid: null,
    roleCode: null,
    token: null,
    email: null,
    name: null,
    spaces: null,
    country,
    language,
  };

  notificationCount = 0;

  tried = null;

  constructor() {
    makeObservable(this, {
      user: observable,
      tried: observable,
      notificationCount: observable,
      setUser: action,
      setTried: action,
      isLogin: computed,
      addSpace: action,
      setNotificationCount: action,
    });
  }

  setUser = user => {
    this.user = {
      ...user,
    };
  };

  setNotificationCount = count => {
    this.notificationCount = count;
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
