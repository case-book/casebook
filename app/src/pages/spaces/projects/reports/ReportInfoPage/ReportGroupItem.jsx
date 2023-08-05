import React from 'react';
import { TestcaseGroupPropTypes } from '@/proptypes';
import PropTypes from 'prop-types';
import { SeqId, Td, Tr } from '@/components';
import { ITEM_TYPE, TESTRUN_RESULT_CODE } from '@/constants/constants';
import './ReportGroupItem.scss';

function ReportGroupItem({ users, testcaseGroup, parentGroupName, status, userId, onNameClick }) {
  const list =
    testcaseGroup.testcases?.filter(testcase => {
      if (!status && !userId) {
        return true;
      }

      if (status && userId) {
        return testcase.testerId === userId && testcase.testResult === status;
      }

      return testcase.testerId === userId || testcase.testResult === status;
    }) || [];

  return (
    <>
      {(!list || list.length < 1) && (
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
  status: null,
  userId: null,
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
};

export default ReportGroupItem;
