import { useEffect, useState } from 'react';
import { intersection } from 'lodash';
import { action, makeObservable, observable } from 'mobx';

class TestcaseRenderStore {
  renderMap = {};

  constructor() {
    makeObservable(this, {
      renderMap: observable,
      initRenderMap: action,
      setRenderedBySeqId: action,
    });
  }

  initRenderMap = () => {
    this.renderMap = {};
  };

  setRenderedBySeqId = (seqId, value) => {
    this.renderMap[seqId] = value;
  };

  checkRenderTestcase = (testcase, testcaseFilter) => {
    if (this.renderMap[testcase.seqId] !== undefined) return this.renderMap[testcase.seqId];

    const { ids = [], name = '', releaseIds = [] } = testcaseFilter;

    // 각각의 조건은 AND로 묶여있음
    if (name && !testcase.name.includes(name)) {
      this.setRenderedBySeqId(testcase.seqId, false);
      return false;
    }
    if (ids.length > 0 && !ids.includes(testcase.id)) {
      this.setRenderedBySeqId(testcase.seqId, false);
      return false;
    }
    if (releaseIds.length > 0 && !intersection(releaseIds, testcase.projectReleaseIds).length > 0) {
      this.setRenderedBySeqId(testcase.seqId, false);
      return false;
    }

    this.setRenderedBySeqId(testcase.seqId, true);
    return true;
  };

  checkRenderGroup = (group, testcaseFilter) => {
    if (this.renderMap[group.seqId] !== undefined) return this.renderMap[group.seqId];

    const { name = '' } = testcaseFilter;

    const isTestcaseRendered = group.testcases?.reduce?.((acc, testcase) => acc || this.checkRenderTestcase(testcase, testcaseFilter), false);
    const isChildrenRendered = group.children?.reduce?.((acc, child) => acc || this.checkRenderGroup(child, testcaseFilter), false);

    if (isTestcaseRendered || isChildrenRendered) {
      this.setRenderedBySeqId(group.seqId, true);
      return true;
    }

    if (name && !group.name.includes(name)) {
      this.setRenderedBySeqId(group.seqId, false);
      return false;
    }

    this.setRenderedBySeqId(group.seqId, true);
    return true;
  };
}

const testcaseRenderStore = new TestcaseRenderStore();

function useTestcaseFilter(groups) {
  const [testcaseFilter, setTestcaseFilter] = useState({
    ids: [],
    name: '',
    releaseIds: [],
  });

  useEffect(() => {
    testcaseRenderStore.initRenderMap();
  }, [groups, testcaseFilter]);

  return { testcaseFilter, setTestcaseFilter };
}

function useShouldRender(testcaseOrGroup, testcaseFilter) {
  const { checkRenderGroup, checkRenderTestcase } = testcaseRenderStore;

  const shouldRender = (() => {
    if (testcaseOrGroup.seqId.startsWith('TC')) return checkRenderTestcase(testcaseOrGroup, testcaseFilter);
    return checkRenderGroup(testcaseOrGroup, testcaseFilter);
  })();

  return shouldRender;
}

export { useTestcaseFilter, useShouldRender };
