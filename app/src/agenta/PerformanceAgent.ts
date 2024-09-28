import CollectCycle from './CollectCycle';

interface PerformanceAgentInstance {
  support(): boolean; // 현재 브라우저에서 이 에이전트가 동작할 수 있는지 판단
  setOptions(options: object): void; // 에이전트의 옵션 값을 변경
  getMetrics(): object | null; // 성능 지표를 반환
}

interface PerformanceAgentConstructor {
  new (): PerformanceAgentInstance;
  getAgentName(): string; // init에서 전달되는 옵션 객체에서 전달할 옵션 키 값
  getCollectCycle(): CollectCycle;
}

interface PerformanceAgent extends PerformanceAgentInstance {
  constructor?: PerformanceAgentConstructor;
}

export type { PerformanceAgent, PerformanceAgentInstance, PerformanceAgentConstructor };
