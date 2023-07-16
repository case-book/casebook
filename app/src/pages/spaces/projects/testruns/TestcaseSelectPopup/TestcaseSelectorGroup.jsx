import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TestcaseGroupPropTypes } from '@/proptypes';
import './TestcaseSelectorGroup.scss';

function TestcaseSelectorGroup({ testcaseGroup, selected, onClick, selectedTestcaseGroups, highlighted, isHighlighted }) {
  const [opened, setOpened] = useState(true);
  const hasChild = testcaseGroup.testcases?.length > 0;
  const selectedTestcaseGroup = selectedTestcaseGroups.find(i => i.testcaseGroupId === testcaseGroup.id);
  const checkHighlightedTestCase = testcase => {
    return highlighted && isHighlighted && isHighlighted(testcase);
  };

  const hasHighlightedTestCase = highlighted && testcaseGroup.testcases?.some(tc => checkHighlightedTestCase(tc));
  return (
    <div
      className="testcase-selector-group-wrapper"
      style={{
        marginLeft: `${testcaseGroup.depth}rem`,
      }}
    >
      <div
        className={`group-info ${selected ? 'selected' : ''} ${hasHighlightedTestCase ? 'highlighted' : ''}`}
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
              const testcaseHighlighted = checkHighlightedTestCase(testcase);
              return (
                <li className={`${testcaseSelected ? 'selected' : ''} ${testcaseHighlighted ? 'highlighted' : ''}`} key={testcase.id}>
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
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {testcaseGroup.children?.map(d => {
        const childrenSelected = selectedTestcaseGroups.findIndex(i => i.testcaseGroupId === d.id) > -1;
        return (
          <TestcaseSelectorGroup
            key={d.id}
            testcaseGroup={d}
            selected={childrenSelected}
            onClick={onClick}
            selectedTestcaseGroups={selectedTestcaseGroups}
            highlighted={highlighted}
            isHighlighted={isHighlighted}
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
  highlighted: false,
  isHighlighted: null,
};

TestcaseSelectorGroup.propTypes = {
  testcaseGroup: TestcaseGroupPropTypes,
  selected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  selectedTestcaseGroups: PropTypes.arrayOf(
    PropTypes.shape({
      testcaseGroupId: PropTypes.number,
      testcases: PropTypes.arrayOf(
        PropTypes.shape({
          testcaseId: PropTypes.number,
        }),
      ),
    }),
  ),
  highlighted: PropTypes.bool,
  isHighlighted: PropTypes.func,
};

export default TestcaseSelectorGroup;
