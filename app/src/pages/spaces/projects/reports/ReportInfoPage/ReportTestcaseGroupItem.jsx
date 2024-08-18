import React from 'react';
import { TestcaseGroupPropTypes } from '@/proptypes';
import PropTypes from 'prop-types';
import { SeqId, Td, Tr } from '@/components';
import { ITEM_TYPE, TESTRUN_RESULT_CODE } from '@/constants/constants';
import './ReportTestcaseGroupItem.scss';
import classNames from 'classnames';

function ReportTestcaseGroupItem({ testcaseGroup, parentGroupName, onNameClick, userById }) {
  const testcases = testcaseGroup.testcases || [];

  return (
    <>
      {testcases.length > 0 &&
        testcases?.map((testcase, inx) => {
          return (
            <Tr className="report-testcase-group-item-wrapper" key={testcase.id}>
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
              <Td>{userById[testcase.testerId]?.name || testcase.testerId}</Td>
              <Td align="center">
                <span className={classNames('test-result', testcase.testResult)}>{TESTRUN_RESULT_CODE[testcase.testResult]}</span>
              </Td>
              <Td align="center">{testcase.comments?.length > 0 ? <i className="fa-solid fa-message" /> : ''}</Td>
            </Tr>
          );
        })}

      {testcaseGroup.children?.map(child => {
        return (
          <ReportTestcaseGroupItem
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

ReportTestcaseGroupItem.defaultProps = {
  testcaseGroup: {},
  parentGroupName: '',
  userById: {},
};

ReportTestcaseGroupItem.propTypes = {
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

export default ReportTestcaseGroupItem;
