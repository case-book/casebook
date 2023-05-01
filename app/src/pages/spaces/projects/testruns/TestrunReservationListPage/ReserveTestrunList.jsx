import React from 'react';
import { Table, Tag, Tbody, Td, Th, THead, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import dateUtil from '@/utils/dateUtil';
import PropTypes from 'prop-types';
import { TestrunReservationPropTypes } from '@/proptypes';
import './ReserveTestrunList.scss';

function ReserveTestrunList({ spaceCode, projectId, testrunReservations, expired }) {
  const { t } = useTranslation();

  return (
    <div className="reserve-testrun-list-wrapper">
      <Table className="testrun-table" cols={['1px', '100%', '1px', '1px', '1px', '1px']}>
        <THead>
          <Tr>
            <Th align="left">{t('타입')}</Th>
            <Th align="left">{t('이름')}</Th>
            <Th align="center">{t('테스트 시작일시')}</Th>
            <Th align="center">{t('테스트 종료일시')}</Th>
            <Th align="center">{t('테스트케이스 그룹')}</Th>
            <Th align="center">{t('테스트케이스')}</Th>
            {expired && <Th align="center">{t('테스트런')}</Th>}
          </Tr>
        </THead>
        <Tbody>
          {testrunReservations?.map(testrunReservation => {
            return (
              <Tr key={testrunReservation.id}>
                <Td>
                  <Tag uppercase>{t(testrunReservation.expired ? '완료' : '예약')}</Tag>
                </Td>
                <Td className="name">
                  <Link to={`/spaces/${spaceCode}/projects/${projectId}/testruns/reservations/${testrunReservation.id}/info`}>{testrunReservation.name}</Link>
                </Td>
                <Td align="center">
                  <Tag className="tag" uppercase>
                    {dateUtil.getDateString(testrunReservation.startDateTime)}
                  </Tag>
                </Td>
                <Td align="center">
                  <Tag className="tag" uppercase>
                    {dateUtil.getDateString(testrunReservation.endDateTime)}
                  </Tag>
                </Td>
                <Td className="testcase-count" align="right">
                  {testrunReservation.testcaseGroupCount}
                </Td>
                <Td className="testcase-count" align="right">
                  {testrunReservation.testcaseCount}
                </Td>
                {expired && (
                  <Td className="testcase-count" align="center">
                    {testrunReservation.testrunId && <Link to={`/spaces/${spaceCode}/projects/${projectId}/reports//${testrunReservation.testrunId}`}>{t('리포트')}</Link>}
                  </Td>
                )}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </div>
  );
}

ReserveTestrunList.defaultProps = {
  testrunReservations: [],
};

ReserveTestrunList.propTypes = {
  spaceCode: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  expired: PropTypes.bool.isRequired,
  testrunReservations: PropTypes.arrayOf(TestrunReservationPropTypes),
};

export default ReserveTestrunList;
