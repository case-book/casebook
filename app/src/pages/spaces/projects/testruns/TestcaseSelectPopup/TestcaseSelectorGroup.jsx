import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TestcaseGroupPropTypes } from '@/proptypes';
import './TestcaseSelectorGroup.scss';

function TestcaseSelectorGroup({ testcaseGroup, selected, onClick }) {
  const [opened, setOpened] = useState(true);
  const hasChild = testcaseGroup.testcases?.length > 0;

  return (
    <div
      className="testcase-selector-group-wrapper"
      onClick={() => {}}
      style={{
        marginLeft: `${testcaseGroup.depth}rem`,
      }}
    >
      <div className="group-info">
        <div>
          <div
            onClick={() => {
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
              return (
                <li key={testcase.id}>
                  <div className="testcase-info">
                    <div>
                      <div className="line-1" />
                      <div className="line-2" />
                    </div>
                    <div>
                      {selected && <i className="fa-solid fa-circle-check" />}
                      {!selected && <i className="fa-regular fa-circle-check" />}
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
        return <TestcaseSelectorGroup key={d.id} testcaseGroup={d} selected={selected} onClick={onClick} />;
      })}
    </div>
  );
}

TestcaseSelectorGroup.defaultProps = {
  testcaseGroup: {},
  selected: false,
  onClick: null,
};

TestcaseSelectorGroup.propTypes = {
  testcaseGroup: TestcaseGroupPropTypes,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
};

export default TestcaseSelectorGroup;
