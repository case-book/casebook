import { action, makeObservable, observable } from 'mobx';

export default class ControlStore {
  toast = {
    message: null,
  };

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

  requestLoading = null;

  requestMessages = [];

  error = {
    code: null,
    message: null,
    okHandler: null,
  };

  constructor() {
    makeObservable(this, {
      message: observable,
      confirm: observable,
      requestLoading: observable,
      error: observable,
      requestMessages: observable,
      setMessage: action,
      setConfirm: action,
      setRequestLoading: action,
      setError: action,
      addRequestMessage: action,
      removeRequestMessage: action,
      toast: observable,
      setToast: action,
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

  setToast = message => {
    this.toast = {
      message,
    };

    setTimeout(() => {
      this.toast = {
        message: null,
      };
    }, 3000);
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
}
