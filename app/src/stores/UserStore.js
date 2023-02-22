import { action, computed, makeObservable, observable } from 'mobx';
import { COUNTRIES, LANGUAGES } from '@/constants/constants';

const locales = (window.navigator.language || '').split('-');
const defaultLanguage = locales[0];
const defaultCountry = locales[1];

const initLanguage = Object.keys(LANGUAGES).includes(defaultLanguage) ? defaultLanguage : 'en';
const initCountry = Object.keys(COUNTRIES).includes(defaultCountry) ? defaultCountry : 'US';

export default class UserStore {
  user = {
    id: null,
    uuid: null,
    activeSystemRole: null,
    roleCode: null,
    token: null,
    email: null,
    name: null,
    spaces: null,
    country: initCountry,
    language: initLanguage,
  };

  notificationCount = 0;

  tried = null;

  constructor() {
    makeObservable(this, {
      user: observable,
      tried: observable,
      notificationCount: observable,
      setUser: action,
      clearUser: action,
      setTried: action,
      isLogin: computed,
      isAdmin: computed,
      addSpace: action,
      removeSpace: action,
      setNotificationCount: action,
      setLocale: action,
    });
  }

  setUser = user => {
    this.user = {
      ...user,
    };
  };

  setLocale = (language, country) => {
    this.user = {
      ...this.user,
      language,
      country,
    };
  };

  clearUser = () => {
    this.user = {
      id: null,
      uuid: null,
      roleCode: null,
      token: null,
      email: null,
      name: null,
      spaces: null,
      country: initCountry,
      language: initLanguage,
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

  removeSpace = spaceId => {
    const next = { ...this.user };
    if (!next.spaces) {
      next.spaces = [];
    }

    const index = next.spaces.findIndex(d => d.id === spaceId);
    next.spaces.splice(index, 1);
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

  get isAdmin() {
    console.log(this.user);
    return this.user?.activeSystemRole === 'ROLE_ADMIN';
  }
}
