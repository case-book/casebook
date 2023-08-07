import { cloneDeep } from 'lodash';

function sort(list) {
  list.sort((a, b) => {
    return a.itemOrder - b.itemOrder;
  });

  list.forEach(item => {
    if (item?.children?.length > 0) {
      sort(item.children);
    }

    if (item?.testcases?.length > 0) {
      sort(item.testcases);
    }
  });
}

function getTestcaseTreeData(targetGroups, groupIdFieldName = 'id') {
  let nextGroups = [];
  if (targetGroups?.length > 0) {
    const groups = cloneDeep(targetGroups);
    const depths = groups.map(d => d.depth) || [];
    const maxDepth = Math.max(...depths);

    for (let i = maxDepth; i >= 0; i -= 1) {
      const targetDepthGroups = groups.filter(d => d.depth === i);
      if (i === 0) {
        nextGroups = nextGroups.concat(targetDepthGroups);
      } else {
        targetDepthGroups.forEach(d => {
          const parentGroup = groups.find(group => group[groupIdFieldName] === d.parentId);
          if (parentGroup) {
            if (!parentGroup?.children) {
              parentGroup.children = [];
            }

            parentGroup.children.push(d);
          } else {
            console.error(`NO PARENT - ${d.parentId}`);
          }
        });
      }
    }
  }

  sort(nextGroups);
  return nextGroups;
}

function getFilteredTestcaseGroupList(list, status, userId) {
  return list.filter(testcaseGroup => {
    if (!(testcaseGroup.testcases?.length > 0) && !(testcaseGroup.children?.length > 0)) {
      return false;
    }

    if (!status && !userId) {
      return true;
    }

    let hasFilteredTestcase = false;

    if (status && userId) {
      hasFilteredTestcase = testcaseGroup.testcases?.some(testcase => {
        return testcase.testerId === userId && testcase.testResult === status;
      });
    } else {
      hasFilteredTestcase = testcaseGroup.testcases?.some(testcase => {
        return testcase.testerId === userId || testcase.testResult === status;
      });
    }

    if (hasFilteredTestcase) {
      return true;
    }

    if (testcaseGroup.children?.length > 0) {
      const chidrenList = getFilteredTestcaseGroupList(testcaseGroup.children, status, userId);
      if (chidrenList?.length > 0) {
        return true;
      }
    }

    return false;
  });
}

function getFilteredTestcaseList(list, status, userId) {
  return list?.filter(testcase => {
    if (!status && !userId) {
      return true;
    }

    if (status && userId) {
      return testcase.testerId === userId && testcase.testResult === status;
    }

    return testcase.testerId === userId || testcase.testResult === status;
  });
}

function searchTestcaseGroups(targetGroups, { groupName = '', testcaseName = '' } = {}) {
  return targetGroups
    .map(group => ({ ...group, testcases: group.testcases && group.testcases.filter(testcase => (!testcaseName ? true : testcase.name.includes(testcaseName))) }))
    .filter(group => group.name.includes(groupName));
}

const testcaseUtil = {
  getTestcaseTreeData,
  getFilteredTestcaseGroupList,
  getFilteredTestcaseList,
  searchTestcaseGroups,
};

export default testcaseUtil;
