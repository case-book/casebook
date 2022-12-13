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

  error = {
    code: null,
    message: null,
  };

  hideHeader = false;

  constructor() {
    makeObservable(this, {
      message: observable,
      confirm: observable,
      requestLoading: observable,
      error: observable,
      hideHeader: observable,
      setMessage: action,
      setConfirm: action,
      setRequestLoading: action,
      setError: action,
      setHideHeader: action,
    });
  }

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

  setError = (code, message) => {
    this.error = {
      code,
      message,
    };
  };

  setHideHeader = hideHeader => {
    if (this.hideHeader !== hideHeader) {
      this.hideHeader = hideHeader;
    }
  };
}
