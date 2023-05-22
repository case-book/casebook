import { action, makeObservable, observable } from 'mobx';

export default class ConfigStore {
  holidays = [];

  version = {};

  setUp = null;

  releasePopup = null;

  constructor() {
    makeObservable(this, {
      holidays: observable,
      version: observable,
      setUp: observable,
      releasePopup: observable,
      setHolidays: action,
      setVersion: action,
      openReleasePopup: action,
      closeReleasePopup: action,
    });
  }

  setHolidays = holidays => {
    this.holidays = holidays;
  };

  setVersion = version => {
    this.version = {
      name: version.name,
      version: version.version,
    };

    this.setUp = version.setUp;
  };

  openReleasePopup = () => {
    this.releasePopup = Date.now();
  };

  closeReleasePopup = () => {
    this.releasePopup = null;
  };
}
