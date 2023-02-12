import { action, makeObservable, observable } from 'mobx';

export default class ConfigStore {
  holidays = [];

  version = {};

  setUp = null;

  constructor() {
    makeObservable(this, {
      holidays: observable,
      version: observable,
      setUp: observable,
      setHolidays: action,
      setVersion: action,
    });
  }

  setHolidays = holidays => {
    this.holidays = holidays;
  };

  setVersion = version => {
    this.version = {
      name: version.name,
      version: version.name,
    };

    this.setUp = version.setUp;
  };
}
