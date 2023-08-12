/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import TestcaseSelectorGroup from './TestcaseSelectorGroup';

function TestcaseSelector({ filteredProjectTestcaseGroupTree, currentSelectedTestcaseGroups, filterCondition, onClick }) {
  return (
    <div className="testcase-select-list g-no-select">
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
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}

TestcaseSelector.propTypes = {
  filteredProjectTestcaseGroupTree: PropTypes.array.isRequired,
  currentSelectedTestcaseGroups: PropTypes.array.isRequired,
  filterCondition: PropTypes.object,
  onClick: PropTypes.func.isRequired,
};

TestcaseSelector.defaultProps = {
  filterCondition: {},
};

export default TestcaseSelector;
