import CollectCycle from './CollectCycle';
// eslint-disable-next-line no-unused-vars
import { PerformanceAgent, PerformanceAgentConstructor } from './PerformanceAgent';

class NavigationTimingAgent implements PerformanceAgent {
  options = {};

  debug = false;

  constructor(options: { [x: string]: {} }, debug: boolean = false) {
    this.debug = debug;
    this.options = {
      ...this.options,
      ...options,
    };
    if (this.debug) {
      console.log('NavigationTimingAgent is created', this.options);
    }
  }

  ['constructor']?: PerformanceAgentConstructor;

  // eslint-disable-next-line class-methods-use-this
  static getAgentName() {
    return 'navigationTiming';
  }

  static getCollectCycle() {
    return CollectCycle.ONLOAD;
  }

  // eslint-disable-next-line class-methods-use-this
  support() {
    const support = 'performance' in window && 'getEntriesByType' in performance;
    if (this.debug && !support) {
      console.log('Navigation Timing API is not supported in this browser.');
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

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      return {
        entryType: navigation.entryType,
        startTime: navigation.startTime,
        duration: navigation.duration,
        initiatorType: navigation.initiatorType,
        type: navigation.type,
        unloadEventStart: navigation.unloadEventStart,
        unloadEventEnd: navigation.unloadEventEnd,
        redirectStart: navigation.redirectStart,
        redirectEnd: navigation.redirectEnd,
        fetchStart: navigation.fetchStart,
        domainLookupStart: navigation.domainLookupStart,
        domainLookupEnd: navigation.domainLookupEnd,
        connectStart: navigation.connectStart,
        connectEnd: navigation.connectEnd,
        secureConnectionStart: navigation.secureConnectionStart,
        requestStart: navigation.requestStart,
        responseStart: navigation.responseStart,
        responseEnd: navigation.responseEnd,
        domInteractive: navigation.domInteractive,
        domContentLoadedEventStart: navigation.domContentLoadedEventStart,
        domContentLoadedEventEnd: navigation.domContentLoadedEventEnd,
        domComplete: navigation.domComplete,
        loadEventStart: navigation.loadEventStart,
        loadEventEnd: navigation.loadEventEnd,
      };
    }
    return null;
  }
}

export default NavigationTimingAgent;
