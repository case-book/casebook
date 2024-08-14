import React from 'react';
import { TestcaseGroupPropTypes } from '@/proptypes';
import PropTypes from 'prop-types';
import { SeqId, Td, Tr } from '@/components';
import { ITEM_TYPE, TESTRUN_RESULT_CODE } from '@/constants/constants';
import './OpenLinkTestcaseGroupItem.scss';
import classNames from 'classnames';

function OpenLinkTestcaseGroupItem({ testcaseGroup, parentGroupName, onNameClick, userById }) {
  const testcases = testcaseGroup.testcases || [];

  return (
    <>
      {testcases.length > 0 &&
        testcases?.map((testcase, inx) => {
          return (
            <Tr className="open-link-testcase-group-item-wrapper" key={testcase.id}>
              {inx === 0 && (
                <Td rowSpan={testcases.length} className="testcase-group">
                  {parentGroupName}
                  {parentGroupName ? ' > ' : ''}
                  {testcaseGroup.name}
                </Td>
              )}
              <Td>
                <div
                  className="seq-name"
                  onClick={() => {
                    onNameClick(testcase.testrunId || 0, testcaseGroup.testcaseGroupId, testcase.testcaseId);
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
              <Td>{userById[testcase.testerId]?.name || testcase.testerId}</Td>
              <Td align="center">
                <span className={classNames('test-result', testcase.testResult)}>{TESTRUN_RESULT_CODE[testcase.testResult]}</span>
              </Td>
              {testcase.testResults.length > 0 &&
                testcase.testResults.map((testResult, jnx) => {
                  return (
                    <Td key={jnx} align="center">
                      {testResult !== 'UNTESTED' && <span className={classNames('test-result', testResult)}>{TESTRUN_RESULT_CODE[testResult] || ''}</span>}
                    </Td>
                  );
                })}
            </Tr>
          );
        })}

      {testcaseGroup.children?.map(child => {
        return (
          <OpenLinkTestcaseGroupItem
            key={child.id}
            testcaseGroup={child}
            parentGroupName={parentGroupName ? `${parentGroupName} > ${testcaseGroup.name}` : testcaseGroup.name}
            onNameClick={onNameClick}
            userById={userById}
          />
        );
      })}
    </>
  );
}

OpenLinkTestcaseGroupItem.defaultProps = {
  testcaseGroup: {},
  parentGroupName: '',
  userById: {},
};

OpenLinkTestcaseGroupItem.propTypes = {
  testcaseGroup: TestcaseGroupPropTypes,
  parentGroupName: PropTypes.string,
  onNameClick: PropTypes.func.isRequired,
  userById: PropTypes.shape({
    [PropTypes.number]: PropTypes.shape({
      userId: PropTypes.number,
      email: PropTypes.string,
      name: PropTypes.string,
    }),
  }),
};

export default OpenLinkTestcaseGroupItem;
