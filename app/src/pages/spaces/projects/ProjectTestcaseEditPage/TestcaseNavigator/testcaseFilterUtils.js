import { cloneDeep, intersection } from 'lodash';

const matchWords = (testcase, words) => {
  return (
    words.find(word => testcase.name.indexOf(word) > -1) || words.find(word => testcase.seqId.toUpperCase() === word.toUpperCase()) || words.find(word => testcase.seqId.toUpperCase() === `TC${word}`)
  );
};

const getMatchedTestcaseMap = (groups, testcaseFilter, testcaseById) => {
  const map = testcaseById || {};

  groups.forEach(group => {
    group.testcases.forEach(d => {
      if (matchWords(d, testcaseFilter.words)) {
        map[d.id] = true;
      } else if (intersection(testcaseFilter.releaseIds, d.projectReleaseIds).length > 0) {
        map[d.id] = true;
      }
    });

    if (group.children) {
      getMatchedTestcaseMap(group.children, testcaseFilter, map);
    }
  });

  return map;
};

const getFilteredGroupList = (groups, testcaseById) => {
  return groups.filter(group => {
    const nextGroup = group;
    if (nextGroup.children) {
      nextGroup.children = getFilteredGroupList(nextGroup.children, testcaseById);
    }

    if (nextGroup.testcases) {
      nextGroup.testcases = nextGroup.testcases.filter(testcase => testcaseById[testcase.id]);
    }
    return nextGroup.children?.length > 0 || nextGroup.testcases?.length > 0;
  });
};

const filteringTestcaseGroupList = (groups, testcaseFilter) => {
  const target = cloneDeep(groups);
  return getFilteredGroupList(target, getMatchedTestcaseMap(target, testcaseFilter));
};

export default filteringTestcaseGroupList;
