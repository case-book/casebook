import { action, makeObservable, observable } from 'mobx';

export default class ConfigStore {
  holidays = [];

  version = {};

  constructor() {
    makeObservable(this, {
      holidays: observable,
      version: observable,
      setHolidays: action,
      setVersion: action,
    });
  }

  setHolidays = holidays => {
    this.holidays = holidays;
  };

  setVersion = version => {
    this.version = version;
  };
}
