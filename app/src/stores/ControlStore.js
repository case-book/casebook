import { action, makeObservable, observable } from 'mobx';

export default class ControlStore {
  message = {
    category: null,
    title: null,
    message: null,
    okHandler: null,
    okText: null,
  };

  confirm = {
    category: null,
    title: null,
    message: null,
    okHandler: null,
    noHandler: null,
    okText: null,
    noText: null,
    okColor: null,
  };

  requestLoading = false;

  requestMessages = [];

  error = {
    code: null,
    message: null,
    okHandler: null,
  };

  hideHeader = false;

  constructor() {
    makeObservable(this, {
      message: observable,
      confirm: observable,
      requestLoading: observable,
      error: observable,
      hideHeader: observable,
      requestMessages: observable,
      setMessage: action,
      setConfirm: action,
      setRequestLoading: action,
      setError: action,
      setHideHeader: action,
      addRequestMessage: action,
      removeRequestMessage: action,
    });
  }

  addRequestMessage = (id, message) => {
    this.requestMessages.push({
      id,
      message,
    });
  };

  removeRequestMessage = id => {
    setTimeout(() => {
      const inx = this.requestMessages.findIndex(d => d.id === id);
      if (inx > -1) {
        this.requestMessages.splice(inx);
      }
    }, 500);
  };

  setMessage = (category, title, message, okHandler, okText) => {
    this.message = {
      category,
      title,
      message,
      okHandler,
      okText,
    };
  };

  setConfirm = (category, title, message, okHandler, noHandler, okText, noText, okColor) => {
    this.confirm = {
      category,
      title,
      message,
      okHandler,
      noHandler,
      okText,
      noText,
      okColor,
    };
  };

  setRequestLoading = loading => {
    this.requestLoading = loading;
  };

  setError = (code, message, okHandler) => {
    this.error = {
      code,
      message,
      okHandler,
    };
  };

  setHideHeader = hideHeader => {
    if (this.hideHeader !== hideHeader) {
      this.hideHeader = hideHeader;
    }
  };
}
