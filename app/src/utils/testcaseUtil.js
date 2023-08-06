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
      const targetDepthGroups = groups.filter(group => group.depth === i);

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

function getFilteredTestcaseGroups(targetGroups, { groupName = '', testcaseName = '' } = {}) {
  return targetGroups
    .map(group => ({ ...group, testcases: group.testcases && group.testcases.filter(testcase => (!testcaseName ? true : testcase.name.includes(testcaseName))) }))
    .filter(group => group.name.includes(groupName));
}

const testcaseUtil = {
  getTestcaseTreeData,
  getFilteredTestcaseGroups,
};

export default testcaseUtil;
