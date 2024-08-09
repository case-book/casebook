import React from 'react';
import { TestcaseGroupPropTypes } from '@/proptypes';
import PropTypes from 'prop-types';
import { SeqId, Td, Tr } from '@/components';
import { ITEM_TYPE } from '@/constants/constants';
import './SelectReleaseGroupItem.scss';

function SelectReleaseGroupItem({ testcaseGroup, parentGroupName, onNameClick, selectedTestcaseIdMap }) {
  const testcases = testcaseGroup.testcases.filter(testcase => selectedTestcaseIdMap[testcase.id]);

  return (
    <>
      {testcases.length > 0 &&
        testcases?.map((testcase, inx) => {
          return (
            <Tr className="release-group-item-wrapper" key={testcase.id}>
              {inx === 0 && (
                <Td rowSpan={testcases.length} className="group-info">
                  {parentGroupName}
                  {parentGroupName ? ' > ' : ''}
                  {testcaseGroup.name}
                </Td>
              )}
              <Td>
                <div
                  className="seq-name"
                  onClick={() => {
                    onNameClick(testcaseGroup.id, testcase.id);
                  }}
                >
                  <div>
                    <SeqId className="seq-id" size="sm" type={ITEM_TYPE.TESTCASE} copy={false}>
                      {testcase.seqId}
                    </SeqId>
                  </div>
                  <div>{testcase.name}</div>
                </div>
              </Td>
            </Tr>
          );
        })}

      {testcaseGroup.children?.map(child => {
        return (
          <SelectReleaseGroupItem
            key={child.id}
            testcaseGroup={child}
            parentGroupName={parentGroupName ? `${parentGroupName} > ${testcaseGroup.name}` : testcaseGroup.name}
            selectedTestcaseIdMap={selectedTestcaseIdMap}
            onNameClick={onNameClick}
          />
        );
      })}
    </>
  );
}

SelectReleaseGroupItem.defaultProps = {
  testcaseGroup: {},
  parentGroupName: '',
  selectedTestcaseIdMap: {},
};

SelectReleaseGroupItem.propTypes = {
  testcaseGroup: TestcaseGroupPropTypes,
  parentGroupName: PropTypes.string,
  onNameClick: PropTypes.func.isRequired,
  selectedTestcaseIdMap: PropTypes.shape({
    [PropTypes.number]: PropTypes.bool,
  }),
};

export default SelectReleaseGroupItem;
