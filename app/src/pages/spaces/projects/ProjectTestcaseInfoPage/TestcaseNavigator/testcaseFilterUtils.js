import { useEffect, useState } from 'react';
import { intersection } from 'lodash';
import { action, makeObservable, observable } from 'mobx';

const MAX_ID_RANGE_END = 2000;

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
    if (ids.length === 0 && name === '' && releaseIds.length === 0) {
      this.setRenderedBySeqId(testcase.seqId, true);
      return true;
    }

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

    const { ids = [], name = '', releaseIds = [] } = testcaseFilter;
    if (ids.length === 0 && name === '' && releaseIds.length === 0) {
      this.setRenderedBySeqId(group.seqId, true);
      return true;
    }

    const isTestcaseRendered = group.testcases?.reduce?.((acc, testcase) => acc || this.checkRenderTestcase(testcase, testcaseFilter), false);
    const isChildrenRendered = group.children?.reduce?.((acc, child) => acc || this.checkRenderGroup(child, testcaseFilter), false);

    if (isTestcaseRendered || isChildrenRendered) {
      this.setRenderedBySeqId(group.seqId, true);
      return true;
    }
    if (name && group.name.includes(name)) {
      this.setRenderedBySeqId(group.seqId, true);
      return true;
    }

    if (!isTestcaseRendered) {
      this.setRenderedBySeqId(group.seqId, false);
      return false;
    }

    this.setRenderedBySeqId(group.seqId, true);
    return true;
  };
}

const testcaseRenderStore = new TestcaseRenderStore();

// TestcaseRenderStore를 초기화하고, testcaseFilter를 관리하는 훅
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

// TestcaseRenderStore를 사용해서, 각 테스트케이스를 렌더링 해야할지 판단하는 함수를 반환하는 훅
function useShouldRender(testcaseOrGroup, testcaseFilter) {
  const { checkRenderGroup, checkRenderTestcase } = testcaseRenderStore;

  const shouldRender = (() => {
    if (testcaseOrGroup.seqId.startsWith('TC')) return checkRenderTestcase(testcaseOrGroup, testcaseFilter);
    return checkRenderGroup(testcaseOrGroup, testcaseFilter);
  })();

  return shouldRender;
}

const getFilterIdsFromIdStrings = idStrings => {
  let isParsedRangeValid = true;
  const parsedIds = idStrings.map(idString => {
    const [[rangeStartString], [rangeEndString] = []] = idString.matchAll(/(\d+)/g);
    const rangeStart = Number(rangeStartString);
    const rangeEnd = rangeEndString ? Number(rangeEndString) : null;
    if (rangeStart > MAX_ID_RANGE_END || rangeStart < 1) {
      isParsedRangeValid = false;
    }
    if (rangeEnd && (rangeEnd > MAX_ID_RANGE_END || rangeStart >= rangeEnd || rangeEnd < 1)) {
      isParsedRangeValid = false;
    }
    return [rangeStart, rangeEnd];
  });

  if (!isParsedRangeValid) return null;

  const idSet = parsedIds.reduce((set, [rangeStart, rangeEnd]) => {
    if (!rangeEnd) {
      set.add(rangeStart);
      return set;
    }
    Array.from({ length: rangeEnd - rangeStart + 1 }, (_, i) => rangeStart + i).forEach(i => set.add(i));
    return set;
  }, new Set());

  return [...idSet];
};

export { useTestcaseFilter, useShouldRender, getFilterIdsFromIdStrings, MAX_ID_RANGE_END };
