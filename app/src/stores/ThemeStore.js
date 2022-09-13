import { action, makeObservable, observable } from 'mobx';

export default class ControlStore {
  theme = 'white';

  constructor() {
    makeObservable(this, {
      theme: observable,
      setTheme: action,
    });
  }

  setTheme = theme => {
    this.theme = theme;
  };
}
