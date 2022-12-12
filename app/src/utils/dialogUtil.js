import { rootStore } from '@/stores';

function setMessage(category, title, message, okHandler, okText) {
  rootStore.controlStore.setMessage(category, title, message, okHandler, okText);
}

function clearMessage(okHandler) {
  if (typeof okHandler === 'function') {
    okHandler();
  }
  rootStore.controlStore.setMessage(null, null, null, null);
}

function setConfirm(category, title, message, okHandler, noHandler, okText, noText, okColor) {
  rootStore.controlStore.setConfirm(category, title, message, okHandler, noHandler, okText, noText, okColor);
}

function clearConfirm() {
  rootStore.controlStore.setConfirm(null, null, null, null, null);
}

const dialogUtil = {
  setMessage,
  clearMessage,
  setConfirm,
  clearConfirm,
};

export default dialogUtil;
