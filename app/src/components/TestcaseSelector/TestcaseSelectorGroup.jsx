import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SelectedTestcaseGroupPropTypes, TestcaseGroupPropTypes } from '@/proptypes';
import './TestcaseSelectorGroup.scss';
import moment from 'moment/moment';
import testcaseUtil from '@/utils/testcaseUtil';
import { Tag } from '@/components';

function TestcaseSelectorGroup({ testcaseGroup, selected, onClick, selectedTestcaseGroups, testcaseName, minDate, maxDate, filteredReleases, releaseNameMap }) {
  const [opened, setOpened] = useState(true);
  const hasChild = testcaseGroup.testcases?.length > 0;
  const selectedTestcaseGroup = selectedTestcaseGroups.find(i => i.testcaseGroupId === testcaseGroup.id);

  return (
    <div
      className="testcase-selector-group-wrapper"
      style={{
        marginLeft: `${testcaseGroup.depth}rem`,
      }}
    >
      <div
        className={`group-info ${selected ? 'selected' : ''}`}
        onClick={() => {
          onClick(testcaseGroup.id, null);
        }}
      >
        <div>
          <div
            className="tree-control"
            onClick={e => {
              e.stopPropagation();
              setOpened(!opened);
            }}
          >
            {hasChild && !opened && <i className="fa-regular fa-square-plus" />}
            {hasChild && opened && <i className="fa-regular fa-square-minus" />}
            {!hasChild && <i className="fa-solid fa-minus" />}
          </div>
        </div>
        <div>
          {selected && <i className="fa-solid fa-circle-check" />}
          {!selected && <i className="fa-regular fa-circle-check" />}
        </div>
        <div>{testcaseGroup.name}</div>
      </div>
      {opened && (
        <div className="testcase-list">
          <ul>
            {testcaseGroup.testcases.map(testcase => {
              const testcaseSelected = selectedTestcaseGroup?.testcases?.findIndex(i => i.testcaseId === testcase.id) > -1;
              return (
                <li className={`${testcaseSelected ? 'selected' : ''}`} key={testcase.id}>
                  <div
                    className="testcase-info"
                    onClick={() => {
                      onClick(testcaseGroup.id, testcase.id);
                    }}
                  >
                    <div>
                      <div className="line-1" />
                      <div className="line-2" />
                    </div>
                    <div>
                      {testcaseSelected && <i className="fa-solid fa-circle-check" />}
                      {!testcaseSelected && <i className="fa-regular fa-circle-check" />}
                    </div>
                    <div>{testcase.name}</div>
                    <div>
                      {testcase.projectReleaseIds?.length > 0 &&
                        testcase.projectReleaseIds
                          ?.sort((a, b) => b - a)
                          .map(projectReleaseId => {
                            return (
                              <Tag key={projectReleaseId} border bold>
                                {releaseNameMap[projectReleaseId]}
                              </Tag>
                            );
                          })}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {opened &&
        testcaseGroup.children?.map(d => {
          const childrenSelected = selectedTestcaseGroups.findIndex(i => i.testcaseGroupId === d.id) > -1;

          const filteredTestcaseGroup = {
            ...d,
            testcases: d.testcases
              .filter(testcase => testcaseUtil.isFilteredTestcaseByName(testcase, testcaseName))
              .filter(testcase => testcaseUtil.isFilteredTestcaseByRange(testcase, minDate, maxDate))
              .filter(testcase => testcaseUtil.isFilteredTestcaseByRelease(testcase, filteredReleases)),
          };

          return (
            <TestcaseSelectorGroup
              key={d.id}
              testcaseGroup={filteredTestcaseGroup}
              selected={childrenSelected}
              onClick={onClick}
              selectedTestcaseGroups={selectedTestcaseGroups}
              testcaseName={testcaseName}
              minDate={minDate}
              maxDate={maxDate}
              filteredReleases={filteredReleases}
              releaseNameMap={releaseNameMap}
            />
          );
        })}
    </div>
  );
}

TestcaseSelectorGroup.defaultProps = {
  testcaseGroup: {},
  selected: false,
  selectedTestcaseGroups: [],
  testcaseName: '',
  minDate: null,
  maxDate: null,
  filteredReleases: [],
  releaseNameMap: {},
};

TestcaseSelectorGroup.propTypes = {
  testcaseGroup: TestcaseGroupPropTypes,
  selected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  selectedTestcaseGroups: SelectedTestcaseGroupPropTypes,
  testcaseName: PropTypes.string,
  minDate: PropTypes.instanceOf(moment),
  maxDate: PropTypes.instanceOf(moment),
  filteredReleases: PropTypes.arrayOf(PropTypes.shape({ key: PropTypes.number, value: PropTypes.string })),
  releaseNameMap: PropTypes.shape({
    [PropTypes.number]: PropTypes.string,
  }),
};

export default TestcaseSelectorGroup;
