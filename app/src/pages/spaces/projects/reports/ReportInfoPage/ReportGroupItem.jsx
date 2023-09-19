import React from 'react';
import { TestcaseGroupPropTypes } from '@/proptypes';
import PropTypes from 'prop-types';
import { SeqId, Td, Tr } from '@/components';
import { ITEM_TYPE, TESTRUN_RESULT_CODE } from '@/constants/constants';
import './ReportGroupItem.scss';
import testcaseUtil from '@/utils/testcaseUtil';

function ReportGroupItem({ users, testcaseGroup, parentGroupName, status, userId, onNameClick, hasComment }) {
  const list = testcaseUtil.getFilteredTestcaseList(testcaseGroup.testcases, status, userId, hasComment) || [];

  return (
    <>
      {list.length > 0 &&
        list?.map((testcase, inx) => {
          const tester = users.find(user => {
            return user.userId === testcase.testerId;
          });

          return (
            <Tr className="report-group-item-wrapper" key={testcase.id}>
              {inx === 0 && (
                <Td rowSpan={list.length} className="group-info">
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
              <>
                <Td align="left">{tester?.name}</Td>
                <Td align="center" className={testcase.testResult}>
                  {TESTRUN_RESULT_CODE[testcase.testResult]}
                </Td>
              </>
            </Tr>
          );
        })}

      {testcaseGroup.children?.map(child => {
        return (
          <ReportGroupItem
            key={child.id}
            users={users}
            testcaseGroup={child}
            status={status}
            userId={userId}
            parentGroupName={parentGroupName ? `${parentGroupName} > ${testcaseGroup.name}` : testcaseGroup.name}
            onNameClick={onNameClick}
            hasComment={hasComment}
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
  status: null,
  userId: null,
  hasComment: false,
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
  status: PropTypes.string,
  userId: PropTypes.number,
  hasComment: PropTypes.bool,
};

export default ReportGroupItem;
