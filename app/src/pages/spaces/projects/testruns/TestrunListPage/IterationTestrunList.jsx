import React from 'react';
import { Table, Tag, Tbody, Td, Th, THead, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import dateUtil from '@/utils/dateUtil';
import PropTypes from 'prop-types';
import { TestrunPropTypes } from '@/proptypes';
import { DURATIONS } from '@/constants/constants';
import './IterationTestrunList.scss';

function IterationTestrunList({ spaceCode, projectId, testruns }) {
  const { t } = useTranslation();

  return (
    <div className="iteration-testrun-list-wrapper">
      <Table className="testrun-table" cols={['1px', '100%', '1px', '1px', '1px', '1px', '1px', '1px', '1px']}>
        <THead>
          <Tr>
            <Th align="center">{t('타입')}</Th>
            <Th align="left">{t('이름')}</Th>
            <Th align="center">{t('반복 시작 일시')}</Th>
            <Th align="center">{t('반복 종료 일시')}</Th>
            <Th align="left">{t('반복 정보')}</Th>
            <Th align="center">{t('시작 시간')}</Th>
            <Th align="center">{t('테스트 기간')}</Th>
            <Th align="center">{t('테스트케이스 개수')}</Th>
            <Th align="center">{t('처리 상태')}</Th>
          </Tr>
        </THead>
        <Tbody>
          {testruns?.map(testrun => {
            return (
              <Tr key={testrun.id}>
                <Td align="center">
                  <Tag uppercase>{t(testrun.creationType)}</Tag>
                </Td>
                <Td className="name">
                  <Link to={`/spaces/${spaceCode}/projects/${projectId}/testruns/${testrun.id}/info`}>{testrun.name}</Link>
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
                <Td>
                  {testrun.creationType === 'ITERATION' &&
                    [t('월'), t('화'), t('수'), t('목'), t('금'), t('토'), t('일')].map((day, jnx) => {
                      if (testrun.days[jnx] === '1') {
                        return (
                          <Tag key={jnx} className="day" uppercase border color="transparent">
                            {day}
                          </Tag>
                        );
                      }

                      return undefined;
                    })}
                  {testrun.creationType === 'ITERATION' && (
                    <Tag className={`day ${testrun.onHoliday ? 'selected' : ''}`} uppercase border color="transparent">
                      {testrun.onHoliday ? t('휴일 포함') : t('휴일 제외')}
                    </Tag>
                  )}
                </Td>
                <Td className="start-time" align="center">
                  {dateUtil.getHourMinute(testrun.startTime)}
                </Td>
                <Td className="duration" align="right">
                  {DURATIONS.find(d => d.key === testrun.durationHours)?.value || t('@ 시간', { hours: testrun.durationHours })}
                </Td>
                <Td className="testcase-count" align="right">
                  {t('@ 테스트케이스', { count: testrun.totalTestcaseCount })}
                </Td>
                <Td align="center">
                  {testrun.creationType === 'RESERVE' && (
                    <Tag className="tag" uppercase>
                      {testrun.reserveExpired ? '생성됨' : '미처리'}
                    </Tag>
                  )}
                  {testrun.creationType === 'ITERATION' && (
                    <Tag className="tag" uppercase>
                      {testrun.reserveExpired ? '만료' : '반복중'}
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

IterationTestrunList.defaultProps = {
  testruns: [],
};

IterationTestrunList.propTypes = {
  spaceCode: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  testruns: PropTypes.arrayOf(TestrunPropTypes),
};

export default IterationTestrunList;
