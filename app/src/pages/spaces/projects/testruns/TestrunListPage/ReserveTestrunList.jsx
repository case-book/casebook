import React from 'react';
import { Table, Tag, Tbody, Td, Th, THead, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import dateUtil from '@/utils/dateUtil';
import PropTypes from 'prop-types';
import { TestrunPropTypes } from '@/proptypes';
import './ReserveTestrunList.scss';

function ReserveTestrunList({ spaceCode, projectId, testruns }) {
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
            <Th align="center">{t('테스트케이스 개수')}</Th>
            <Th align="center">{t('처리 상태')}</Th>
          </Tr>
        </THead>
        <Tbody>
          {testruns?.map(testrun => {
            return (
              <Tr key={testrun.id}>
                <Td>
                  <Tag uppercase>{t(testrun.creationType)}</Tag>
                </Td>
                <Td className="name">
                  <Link to={`/spaces/${spaceCode}/projects/${projectId}/testruns/${testrun.id}/edit`}>{testrun.name}</Link>
                </Td>
                <Td align="center">
                  <Tag className="tag" uppercase>
                    {dateUtil.getDateString(testrun.startDateTime)}
                  </Tag>
                </Td>
                <Td align="center">
                  <Tag className="tag" uppercase>
                    {dateUtil.getDateString(testrun.endDateTime)}
                  </Tag>
                </Td>
                <Td className="testcase-count" align="right">
                  {t('@ 테스트케이스', { count: testrun.totalTestcaseCount })}
                </Td>
                <Td align="center">
                  {testrun.creationType === 'RESERVE' && (
                    <Tag className="tag" uppercase>
                      {testrun.reserveExpired ? t('생성 완료') : t('미처리')}
                    </Tag>
                  )}
                  {testrun.creationType === 'ITERATION' && (
                    <Tag className="tag" uppercase>
                      {testrun.reserveExpired ? t('만료') : t('반복중')}
                    </Tag>
                  )}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </div>
  );
}

ReserveTestrunList.defaultProps = {
  testruns: [],
};

ReserveTestrunList.propTypes = {
  spaceCode: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  testruns: PropTypes.arrayOf(TestrunPropTypes),
};

export default ReserveTestrunList;
