import { createContext } from 'react';
import UserStore from '@/stores/UserStore';
import ControlStore from '@/stores/ControlStore';
import ConfigStore from '@/stores/ConfigStore';
import ThemeStore from '@/stores/ThemeStore';

class RootStore {
  constructor() {
    this.userStore = new UserStore();
    this.controlStore = new ControlStore();
    this.configStore = new ConfigStore();
    this.themeStore = new ThemeStore();
  }
}

const rootStore = new RootStore();

const rootStoreContext = createContext(rootStore);

export { rootStoreContext, rootStore };
