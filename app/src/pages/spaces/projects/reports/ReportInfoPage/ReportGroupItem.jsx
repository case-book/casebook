import React from 'react';
import { TestcaseGroupPropTypes } from '@/proptypes';
import PropTypes from 'prop-types';
import { SeqId, Tag, Td, Tr } from '@/components';
import { ITEM_TYPE, TESTRUN_RESULT_CODE } from '@/constants/constants';
import './ReportGroupItem.scss';

function ReportGroupItem({ users, testcaseGroup, parentGroupName, onNameClick }) {
  return (
    <>
      {(!testcaseGroup.testcases || testcaseGroup.testcases?.length < 1) && (
        <Tr className="report-group-item-wrapper">
          <Td className="group-info">
            {parentGroupName}
            {parentGroupName ? ' > ' : ''}
            {testcaseGroup.name}
          </Td>
          <Td />
          <Td />
          <Td />
        </Tr>
      )}

      {testcaseGroup.testcases?.length > 0 &&
        testcaseGroup.testcases?.map((testcase, inx) => {
          const tester = users.find(user => {
            return user.userId === testcase.testerId;
          });

          return (
            <Tr className="report-group-item-wrapper" key={testcase.id}>
              {inx === 0 && (
                <Td rowSpan={testcaseGroup.testcases.length} className="group-info">
                  {parentGroupName}
                  {parentGroupName ? ' > ' : ''}
                  {testcaseGroup.name}
                </Td>
              )}
              <Td>
                <div
                  className="seq-name"
                  onClick={() => {
                    onNameClick(testcase.id);
                  }}
                >
                  <div>
                    <SeqId size="sm" type={ITEM_TYPE.TESTCASE} copy={false}>
                      {testcase.seqId}
                    </SeqId>
                  </div>
                  <div>{testcase.name}</div>
                </div>
              </Td>
              <>
                <Td align="left">
                  <Tag>{tester?.name}</Tag>
                </Td>
                <Td align="center">
                  <Tag className={testcase.testResult}>{TESTRUN_RESULT_CODE[testcase.testResult]}</Tag>
                </Td>
              </>
            </Tr>
          );
        })}

      {testcaseGroup.children?.map(child => {
        return (
          <ReportGroupItem
            key={child.id}
            testcaseGroup={child}
            users={users}
            parentGroupName={parentGroupName ? `${parentGroupName} > ${testcaseGroup.name}` : testcaseGroup.name}
            onNameClick={onNameClick}
          />
        );
      })}
    </>
  );
}

ReportGroupItem.defaultProps = {
  testcaseGroup: {},
  parentGroupName: '',
  users: [],
};

ReportGroupItem.propTypes = {
  testcaseGroup: TestcaseGroupPropTypes,
  parentGroupName: PropTypes.string,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    }),
  ),
  onNameClick: PropTypes.func.isRequired,
};

export default ReportGroupItem;
