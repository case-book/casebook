import CollectCycle from './CollectCycle';
// eslint-disable-next-line no-unused-vars
import { PerformanceAgent, PerformanceAgentConstructor } from './PerformanceAgent';

class ResourceTimingAgent implements PerformanceAgent {
  options = {};

  debug = false;

  constructor(options: { [x: string]: {} }, debug: boolean = false) {
    this.debug = debug;
    this.options = {
      ...this.options,
      ...options,
    };
    if (this.debug) {
      console.log('ResourceTimingAgent is created', this.options);
    }
  }

  ['constructor']?: PerformanceAgentConstructor;

  // eslint-disable-next-line class-methods-use-this
  static getAgentName() {
    return 'resourceTiming';
  }

  static getCollectCycle() {
    return CollectCycle.ONLOAD;
  }

  // eslint-disable-next-line class-methods-use-this
  support() {
    const support = 'performance' in window && 'getEntriesByType' in performance;
    if (this.debug && !support) {
      console.log('Resource Timing API is not supported in this browser.');
    }
    return support;
  }

  setOptions(options: {}) {
    this.options = options;
  }

  getMetrics() {
    if (!this.support()) {
      return null;
    }

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    return resources.map(resource => ({
      name: resource.name,
      startTime: resource.startTime,
      duration: resource.duration,
      connectEnd: resource.connectEnd,
      connectStart: resource.connectStart,
      decodedBodySize: resource.decodedBodySize,
      domainLookupEnd: resource.domainLookupEnd,
      domainLookupStart: resource.domainLookupStart,
      encodedBodySize: resource.encodedBodySize,
      fetchStart: resource.fetchStart,
      initiatorType: resource.initiatorType,
      nextHopProtocol: resource.nextHopProtocol,
      redirectEnd: resource.redirectEnd,
      redirectStart: resource.redirectStart,
      requestStart: resource.requestStart,
      responseEnd: resource.responseEnd,
      responseStart: resource.responseStart,
      secureConnectionStart: resource.secureConnectionStart,
      serverTiming: resource.serverTiming,
      transferSize: resource.transferSize,
      workerStart: resource.workerStart,
    }));
  }
}

export default ResourceTimingAgent;
