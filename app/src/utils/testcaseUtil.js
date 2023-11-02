import { cloneDeep } from 'lodash';
import dateUtil from '@/utils/dateUtil';

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

function getSummary(parentName, target, list) {
  target.forEach(d => {
    const currentName = parentName ? `${parentName} > ${d.name}` : d.name;
    list.push({
      name: currentName,
      testcaseGroupId: d.testcaseGroupId,
      parentId: d.parentId,
      count: d.testcases?.length,
    });

    if (d.children?.length > 0) {
      getSummary(currentName, d.children, list);
    }
  });
}

function getSelectedTestcaseGroupSummary(selectedTestcaseGroups, testcaseGroups) {
  const nextSelectedTestcaseGroups = cloneDeep(selectedTestcaseGroups);
  nextSelectedTestcaseGroups.forEach(testcaseGroup => {
    const targetTestcaseGroups = testcaseGroup;
    const originalTestcaseGroup = testcaseGroups.find(e => e.id === testcaseGroup.testcaseGroupId);
    targetTestcaseGroups.depth = originalTestcaseGroup.depth;
    targetTestcaseGroups.itemOrder = originalTestcaseGroup.itemOrder;
    targetTestcaseGroups.parentId = originalTestcaseGroup.parentId;
    targetTestcaseGroups.name = originalTestcaseGroup.name;
  });

  const list = getTestcaseTreeData(nextSelectedTestcaseGroups, 'testcaseGroupId');
  const result = [];
  getSummary('', list, result);
  return result;
}

function getFilteredTestcaseGroupList(list, status, userId, hasComment = false) {
  return list.filter(testcaseGroup => {
    if (!(testcaseGroup.testcases?.length > 0) && !(testcaseGroup.children?.length > 0)) {
      return false;
    }

    if (!status && !userId && !hasComment) {
      return true;
    }

    let hasFilteredTestcase = false;

    if (status && userId) {
      hasFilteredTestcase = testcaseGroup.testcases?.some(testcase => {
        if (hasComment) {
          return testcase.testerId === userId && testcase.testResult === status && testcase.comments?.length > 0;
        }

        return testcase.testerId === userId && testcase.testResult === status;
      });
    } else if (!status && !userId) {
      hasFilteredTestcase = testcaseGroup.testcases?.some(testcase => {
        if (hasComment) {
          return testcase.comments?.length > 0;
        }
        return false;
      });
    } else {
      hasFilteredTestcase = testcaseGroup.testcases?.some(testcase => {
        if (hasComment) {
          return (testcase.testerId === userId || testcase.testResult === status) && testcase.comments?.length > 0;
        }
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

function getFilteredTestcaseList(list, status, userId, hasComment = false) {
  return list?.filter(testcase => {
    if (!status && !userId && !hasComment) {
      return true;
    }

    if (status && userId) {
      if (hasComment) {
        return testcase.testerId === userId && testcase.testResult === status && testcase.comments?.length > 0;
      }

      return testcase.testerId === userId && testcase.testResult === status;
    }

    if (!status && !userId) {
      if (hasComment) {
        return testcase.comments?.length > 0;
      }

      return true;
    }

    if (hasComment) {
      return (testcase.testerId === userId || testcase.testResult === status) && testcase.comments?.length > 0;
    }

    return testcase.testerId === userId || testcase.testResult === status;
  });
}

function isGroupFilteredByRange(targetGroup, minDate, maxDate) {
  if (!minDate && !maxDate) {
    return true;
  }

  const testcaseFiltered = targetGroup.testcases?.some(testcase => {
    if (!testcase || !testcase.creationDate) {
      return false;
    }
    const creationDate = dateUtil.getLocalDate(testcase.creationDate);
    if (minDate && maxDate) {
      return creationDate.isSameOrAfter(minDate) && creationDate.isSameOrBefore(maxDate);
    }

    if (minDate) {
      return creationDate.isSameOrAfter(minDate);
    }

    if (maxDate) {
      return creationDate.isSameOrBefore(maxDate);
    }

    return false;
  });

  if (testcaseFiltered) {
    return true;
  }

  if (targetGroup.children?.length > 0) {
    return targetGroup.children.some(group => {
      return isGroupFilteredByRange(group, minDate, maxDate);
    });
  }

  return false;
}

function isFilteredTestcaseByRange(testcase, minDate, maxDate) {
  if (!testcase || !testcase.creationDate) {
    return false;
  }

  if (!minDate && !maxDate) {
    return true;
  }

  const creationDate = dateUtil.getLocalDate(testcase.creationDate);
  if (minDate && maxDate) {
    return creationDate.isSameOrAfter(minDate) && creationDate.isSameOrBefore(maxDate);
  }

  if (minDate) {
    return creationDate.isSameOrAfter(minDate);
  }

  if (maxDate) {
    return creationDate.isSameOrBefore(maxDate);
  }

  return false;
}

function isGroupFilteredByName(targetGroup, name) {
  if (!name) {
    return true;
  }

  if (targetGroup.name.indexOf(name) > -1) {
    return true;
  }

  const testcaseFiltered = targetGroup.testcases?.some(testcase => {
    return testcase.name.indexOf(name) > -1;
  });

  if (testcaseFiltered) {
    return true;
  }

  if (targetGroup.children?.length > 0) {
    return targetGroup.children.some(group => {
      return isGroupFilteredByName(group, name);
    });
  }

  return false;
}

function isFilteredTestcaseByName(testcase, name) {
  if (testcase.name.indexOf(name) > -1) {
    return true;
  }

  return false;
}

function getSelectionFromTestcaseGroups(testcaseGroups) {
  const parentIds = {};
  testcaseGroups?.forEach(d => {
    if (d.parentId) {
      parentIds[d.parentId] = true;
    }
  });

  return testcaseGroups
    ?.map(d => {
      return {
        testcaseGroupId: d.id,
        ...d,
        testcases: d.testcases?.map(item => {
          return {
            ...item,
            testcaseId: item.id,
          };
        }),
      };
    })
    .filter(d => d.testcases?.length > 0 || parentIds[d.id]);
}

function isFilteredTestcaseByRelease(testcase, releases) {
  if (!releases || releases.length === 0) return true;
  return releases.some(release => testcase.projectReleaseIds.includes(release.key)) || (testcase.projectReleaseIds?.length < 1 && releases.filter(d => d.key === null).length > 0);
}

const testcaseUtil = {
  getTestcaseTreeData,
  getFilteredTestcaseGroupList,
  getFilteredTestcaseList,
  getSummary,
  getSelectedTestcaseGroupSummary,
  isGroupFilteredByRange,
  isFilteredTestcaseByRange,
  isGroupFilteredByName,
  isFilteredTestcaseByName,
  getSelectionFromTestcaseGroups,
  isFilteredTestcaseByRelease,
};

export default testcaseUtil;
