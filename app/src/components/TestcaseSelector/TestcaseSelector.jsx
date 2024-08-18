import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import { ProjectReleasePropTypes, TestcaseGroupPropTypes, TestcaseSelectorFilterPropTypes } from '@/proptypes';
import testcaseUtil from '@/utils/testcaseUtil';
import TestcaseSelectorGroup from './TestcaseSelectorGroup';
import './TestcaseSelector.scss';

function TestcaseSelector({ className, testcaseGroups, currentSelectedTestcaseGroups, filterCondition, onChange, releases }) {
  const [projectTestcaseGroupTree, setProjectTestcaseGroupTree] = useState([]);

  useEffect(() => {
    const nextGroups = testcaseUtil.getTestcaseTreeData(cloneDeep(testcaseGroups), 'id');
    setProjectTestcaseGroupTree(nextGroups);
  }, [testcaseGroups]);

  const removeParentId = (list, parentId) => {
    const targetGroupIds = testcaseGroups.filter(d => d.parentId === parentId).map(d => d.id);

    for (let i = list.length - 1; i >= 0; i -= 1) {
      if (targetGroupIds.includes(list[i].testcaseGroupId)) {
        list.splice(i, 1);
      }
    }

    for (let i = 0; i < targetGroupIds.length; i += 1) {
      removeParentId(list, targetGroupIds[i]);
    }
  };

  const addChildGroup = (list, parentId) => {
    const targetGroupIds = testcaseGroups.filter(d => d.parentId === parentId).map(d => d.id);
    for (let i = 0; i < targetGroupIds.length; i += 1) {
      if (!list.find(d => d.testcaseGroupId === targetGroupIds[i])) {
        const testcaseGroupInfo = testcaseGroups.find(d => d.id === targetGroupIds[i]);
        list.push({
          testcaseGroupId: targetGroupIds[i],
          testcases:
            testcaseGroupInfo.testcases?.map(d => {
              return {
                testcaseId: d.id,
              };
            }) || [],
        });
      }
    }

    for (let i = 0; i < targetGroupIds.length; i += 1) {
      addChildGroup(list, targetGroupIds[i]);
    }
  };

  const addParentGroup = (list, groupId) => {
    const groupInfo = testcaseGroups.find(d => d.id === groupId);
    if (groupInfo.parentId) {
      const parentGroupId = testcaseGroups.find(d => d.id === groupInfo.parentId).id;

      if (!list.find(d => d.testcaseGroupId === parentGroupId)) {
        list.push({
          testcaseGroupId: parentGroupId,
          testcases: [],
        });
      }

      addParentGroup(list, parentGroupId);
    }
  };

  const onClick = (testcaseGroupId, testcaseId) => {
    const isGroup = !testcaseId;

    const nextCurrentSelectedTestcaseGroups = (currentSelectedTestcaseGroups || []).slice(0);

    const selectedGroupIndex = nextCurrentSelectedTestcaseGroups.findIndex(d => d.testcaseGroupId === testcaseGroupId);

    if (isGroup) {
      if (selectedGroupIndex > -1) {
        const testcaseGroupInfo = testcaseGroups.find(d => d.id === testcaseGroupId);
        nextCurrentSelectedTestcaseGroups.splice(selectedGroupIndex, 1);
        removeParentId(nextCurrentSelectedTestcaseGroups, testcaseGroupInfo.id);
      } else {
        const testcaseGroupInfo = testcaseGroups.find(d => d.id === testcaseGroupId);

        let parentGroupId = testcaseGroupInfo.parentId;
        while (parentGroupId) {
          if (!nextCurrentSelectedTestcaseGroups.find(d => d.testcaseGroupId === parentGroupId)) {
            nextCurrentSelectedTestcaseGroups.push({
              testcaseGroupId: parentGroupId,
              testcases: [],
            });
          }

          const parentGroup = testcaseGroups.find(d => d.id === parentGroupId);
          parentGroupId = parentGroup?.parentId;
        }

        nextCurrentSelectedTestcaseGroups.push({
          testcaseGroupId,
          testcases:
            testcaseGroupInfo.testcases?.map(d => {
              return {
                testcaseId: d.id,
              };
            }) || [],
        });

        addChildGroup(nextCurrentSelectedTestcaseGroups, testcaseGroupId);
      }
    } else if (selectedGroupIndex > -1) {
      const currentSelectedInfo = nextCurrentSelectedTestcaseGroups[selectedGroupIndex];
      const selectedTestcaseIndex = currentSelectedInfo.testcases?.findIndex(d => d.testcaseId === testcaseId);
      if (!currentSelectedInfo.testcases) {
        currentSelectedInfo.testcases = [];
      }

      if (selectedTestcaseIndex > -1) {
        currentSelectedInfo.testcases.splice(selectedTestcaseIndex, 1);
      } else {
        currentSelectedInfo.testcases.push({
          testcaseId,
        });
      }
    } else {
      nextCurrentSelectedTestcaseGroups.push({
        testcaseGroupId,
        testcases: [
          {
            testcaseId,
          },
        ],
      });

      addParentGroup(nextCurrentSelectedTestcaseGroups, testcaseGroupId);
    }

    onChange(nextCurrentSelectedTestcaseGroups);
  };

  const filteredProjectTestcaseGroupTree = useMemo(() => {
    return projectTestcaseGroupTree
      ?.filter(testcaseGroup => testcaseUtil.isGroupFilteredByName(testcaseGroup, filterCondition.name))
      ?.filter(testcaseGroup => testcaseUtil.isGroupFilteredByRange(testcaseGroup, filterCondition.minDate, filterCondition.maxDate))
      .map(testcaseGroup => {
        return {
          ...testcaseGroup,
          testcases: testcaseGroup.testcases
            .filter(testcase => testcaseUtil.isFilteredTestcaseByName(testcase, filterCondition.name))
            .filter(testcase => testcaseUtil.isFilteredTestcaseByRange(testcase, filterCondition.minDate, filterCondition.maxDate))
            .filter(testcase => testcaseUtil.isFilteredTestcaseByRelease(testcase, filterCondition.releases)),
        };
      });
  }, [projectTestcaseGroupTree, filterCondition]);

  const releaseNameMap = useMemo(() => {
    const nextReleaseNameMap = {};
    releases.forEach(projectRelease => {
      nextReleaseNameMap[projectRelease.id] = projectRelease.name;
    });
    return nextReleaseNameMap;
  }, [releases]);

  return (
    <div className={`testcase-selector-wrapper g-no-select ${className}`}>
      <div>
        <ul>
          {filteredProjectTestcaseGroupTree.map(testcaseGroup => {
            const selected = (currentSelectedTestcaseGroups || []).findIndex(d => d.testcaseGroupId === testcaseGroup.id) > -1;

            return (
              <TestcaseSelectorGroup
                key={testcaseGroup.id}
                testcaseGroup={testcaseGroup}
                selected={selected}
                selectedTestcaseGroups={currentSelectedTestcaseGroups || []}
                onClick={onClick}
                testcaseName={filterCondition.name}
                minDate={filterCondition.minDate}
                maxDate={filterCondition.maxDate}
                filteredReleases={filterCondition.releases}
                releaseNameMap={releaseNameMap}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}

TestcaseSelector.defaultProps = {
  className: '',
  filterCondition: {},
  releases: [],
};

TestcaseSelector.propTypes = {
  className: PropTypes.string,
  currentSelectedTestcaseGroups: PropTypes.arrayOf(
    PropTypes.shape({
      testcaseGroupId: PropTypes.number,
      testcases: PropTypes.arrayOf(
        PropTypes.shape({
          testcaseId: PropTypes.number,
        }),
      ),
    }),
  ).isRequired,
  testcaseGroups: PropTypes.arrayOf(TestcaseGroupPropTypes).isRequired,
  filterCondition: TestcaseSelectorFilterPropTypes,
  onChange: PropTypes.func.isRequired,
  releases: PropTypes.arrayOf(ProjectReleasePropTypes),
};

export default TestcaseSelector;
