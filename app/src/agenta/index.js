import NavigationTimingAgent from './NavigationTimingAgent';
import ResourceTimingAgent from './ResourceTimingAgent';

class AgentA {
  static instance = null;

  constructor() {
    this.agents = [];
    this.options = {
      dsn: '',
      debug: false,
      sampleRate: 1,
    };
  }

  static getInstance() {
    if (!AgentA.instance) {
      AgentA.instance = new AgentA();
    }
    return AgentA.instance;
  }

  static init(options = {}) {
    const currentInstance = AgentA.getInstance();

    // 전달된 옵션에서 메인 옵션에 정의된 것은 덮어씌움
    Object.keys(currentInstance.options).forEach(key => {
      if (options[key]) {
        currentInstance.options[key] = options[key];
      }
    });

    if (currentInstance.options.debug) {
      // 디버그 모드일 경우 전역 객체에 인스턴스를 할당
      // eslint-disable-next-line no-underscore-dangle
      window._AGENTA = currentInstance;
      console.log('INIT WITH OPTIONS', currentInstance.options);
    }

    // 에이전트 등록
    const agent = new AgentA();
    agent.addAgent(new NavigationTimingAgent(options[NavigationTimingAgent.getAgentName()], currentInstance.options.debug));
    agent.addAgent(new ResourceTimingAgent(options[ResourceTimingAgent.getAgentName()], currentInstance.options.debug));
    return agent;
  }

  addAgent(agent) {
    if (agent.support()) {
      this.agents.push(agent);
    } else if (this.options.debug) {
      console.warn(`${agent.constructor.name} is not supported in this browser.`);
    }
  }

  static getAllMetrics() {
    return AgentA.instance.metrics.reduce((result, metric) => {
      const next = result;
      const metricData = metric.getMetrics();
      if (metricData) {
        next[metric.constructor.name] = metricData;
      }
      return next;
    }, {});
  }

  static setMetricOptions(metricClass, options) {
    const metric = AgentA.instance.metrics.find(m => m instanceof metricClass);
    if (metric) {
      metric.setOptions(options);
    }
  }
}

// 라이브러리 내보내기
export default AgentA;
