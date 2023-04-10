import { action, makeObservable, observable } from 'mobx';

export default class SocketStore {
  messageHandlers = [];

  topics = [];

  socketClient = null;

  constructor() {
    makeObservable(this, {
      messageHandlers: observable,
      socketClient: observable,
      addMessageHandler: action,
      removeMessageHandler: action,
      topics: observable,
      addTopic: action,
      removeTopic: action,
      setSocketClient: action,
    });
  }

  addMessageHandler = (id, handler) => {
    const nextMessageHandlers = this.messageHandlers.slice(0);
    const inx = nextMessageHandlers.findIndex(d => d.id === id);
    if (inx > -1) {
      nextMessageHandlers.splice(inx, 1, handler);
    } else {
      nextMessageHandlers.push({
        id,
        handler,
      });
    }
    this.messageHandlers = nextMessageHandlers;
  };

  removeMessageHandler = id => {
    const nextMessageHandlers = this.messageHandlers.slice(0);
    const inx = nextMessageHandlers.findIndex(d => d.id === id);
    if (inx > -1) {
      nextMessageHandlers.splice(inx, 1);
    }

    this.messageHandlers = nextMessageHandlers;
  };

  addTopic = topic => {
    if (!this.topics.includes(topic)) {
      const nextTopics = this.topics.slice(0);
      nextTopics.push(topic);
      this.topics = nextTopics;
    }
  };

  removeTopic = topic => {
    const nextTopics = this.topics.slice(0);
    const inx = nextTopics.findIndex(d => d === topic);
    if (inx > -1) {
      nextTopics.splice(inx, 1);
    }
    this.topics = nextTopics;
  };

  setSocketClient = socketClient => {
    this.socketClient = socketClient;
  };
}
