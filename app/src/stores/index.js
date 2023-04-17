import { createContext } from 'react';
import UserStore from '@/stores/UserStore';
import ControlStore from '@/stores/ControlStore';
import ConfigStore from '@/stores/ConfigStore';
import ThemeStore from '@/stores/ThemeStore';
import ContextStore from '@/stores/ContextStore';
import SocketStore from '@/stores/SocketStore';

class RootStore {
  constructor() {
    this.userStore = new UserStore();
    this.controlStore = new ControlStore();
    this.configStore = new ConfigStore();
    this.themeStore = new ThemeStore();
    this.contextStore = new ContextStore();
    this.socketStore = new SocketStore();
  }
}

const rootStore = new RootStore();

const rootStoreContext = createContext(rootStore);

export { rootStoreContext, rootStore };
