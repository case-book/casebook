import React from 'react';
import { SeqId, Table, Tbody, Td, Th, THead, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { ITEM_TYPE } from '@/constants/constants';
import PropTypes from 'prop-types';
import { TestcaseGroupPropTypes } from '@/proptypes';

function TestrunReservationTestcaseGroupTable({ testcaseGroups }) {
  const { t } = useTranslation();

  return (
    <Table cols={['1px', '100%']} border>
      <THead>
        <Tr>
          <Th align="left">{t('테스트케이스 그룹')}</Th>
          <Th align="left">{t('테스트케이스')}</Th>
        </Tr>
      </THead>
      <Tbody>
        {testcaseGroups?.map(d => {
          if (d.testcases?.length > 0) {
            return (
              <React.Fragment key={d.seqId}>
                {d.testcases?.map((testcase, inx) => {
                  return (
                    <Tr key={inx}>
                      {inx === 0 && (
                        <Td rowSpan={d.testcases.length} className="group-info">
                          <div className="seq-name">
                            <div>
                              <SeqId className="seq-id" size="sm" type={ITEM_TYPE.TESTCASE_GROUP} copy={false}>
                                {d.seqId}
                              </SeqId>
                            </div>
                            <div>{d.name}</div>
                          </div>
                        </Td>
                      )}
                      <Td>
                        <div className="seq-name">
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
              </React.Fragment>
            );
          }

          return (
            <Tr key={d.seqId}>
              <Td className="group-info">
                <div className="seq-name">
                  <div>
                    <SeqId size="sm" type={ITEM_TYPE.TESTCASE_GROUP} copy={false}>
                      {d.seqId}
                    </SeqId>
                  </div>
                  <div>{d.name}</div>
                </div>
              </Td>
              <Td />
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}

TestrunReservationTestcaseGroupTable.defaultProps = {
  testcaseGroups: [],
};

TestrunReservationTestcaseGroupTable.propTypes = {
  testcaseGroups: PropTypes.arrayOf(TestcaseGroupPropTypes),
};

export default TestrunReservationTestcaseGroupTable;
