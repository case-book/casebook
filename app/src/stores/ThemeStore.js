import { action, makeObservable, observable } from 'mobx';
import { THEMES } from '@/constants/constants';
import { getOption, setOption } from '@/utils/storageUtil';

export default class ControlStore {
  theme = (() => {
    const theme = getOption('user', 'style', 'theme');
    if (theme) {
      return theme;
    }

    return THEMES.LIGHT;
  })();

  constructor() {
    makeObservable(this, {
      theme: observable,
      setTheme: action,
    });
  }

  setTheme = theme => {
    if (this.theme !== theme) {
      setOption('user', 'style', 'theme', theme);
      this.theme = theme;
    }
  };
}
