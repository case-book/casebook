import React, { useEffect, useState } from 'react';
import { Button, Page, PageContent, PageTitle, Radio, Table, Tag, Tbody, Td, Th, THead, Title, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import TestrunService from '@/services/TestrunService';
import './TestrunIterationListPage.scss';
import dateUtil from '@/utils/dateUtil';
import {
  DURATIONS,
  HOLIDAY_CONDITION_DAY_LIST,
  HOLIDAY_CONDITION_WEEK_LIST,
  TESTRUN_ITERATION_MONTHLY_DATES,
  TESTRUN_ITERATION_USER_FILTER_SELECT_RULE,
  TESTRUN_ITERATION_USER_FILTER_TYPE_CODE,
} from '@/constants/constants';

function TestrunIterationListPage() {
  const { t } = useTranslation();

  const { spaceCode, projectId } = useParams();
  const navigate = useNavigate();
  const [testrunIterations, setTestrunIterations] = useState([]);

  const [expired, setExpired] = useState(false);

  useEffect(() => {
    TestrunService.selectProjectTestrunIterationList(spaceCode, projectId, expired, list => {
      setTestrunIterations(list);
    });
  }, [expired, projectId, spaceCode]);

  return (
    <Page className="testrun-iteration-list-page-wrapper">
      <PageTitle
        className="page-title"
        links={[
          <Link to={`/spaces/${spaceCode}/projects/${projectId}/testruns/iterations/new`}>
            <i className="fa-solid fa-plus" /> {t('반복 테스트런')}
          </Link>,
        ]}
        control={
          <div>
            <Radio
              size="sm"
              value={false}
              checked={expired === false}
              onChange={() => {
                setExpired(!expired);
              }}
              label={t('유효')}
            />
            <Radio
              size="sm"
              value
              checked={expired}
              onChange={() => {
                setExpired(!expired);
              }}
              label={t('완료')}
            />
          </div>
        }
        onListClick={() => {
          navigate(`/spaces/${spaceCode}/projects`);
        }}
      >
        {t('반복 테스트런')}
      </PageTitle>
      <PageContent className="page-content">
        {testrunIterations?.length <= 0 && (
          <div className="empty">
            <div>
              <div>{t('반복 중인 테스트런이 없습니다.')}</div>
              <div>
                <Button
                  outline
                  onClick={() => {
                    navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns/iterations/new`);
                  }}
                >
                  <i className="fa-solid fa-plus" /> {t('반복 테스트런')}
                </Button>
              </div>
            </div>
          </div>
        )}
        {testrunIterations?.length > 0 && (
          <>
            <Title border={false}>{t('반복 테스트런 리스트')}</Title>
            <div className="testrun-iteration-list">
              <Table className="testrun-table" cols={['1px', '100%', '1px', '1px', '1px', '1px']}>
                <THead>
                  <Tr>
                    <Th align="left">{t('타입')}</Th>
                    <Th align="left">{t('이름')}</Th>
                    <Th align="center">{t('반복 시작 일시')}</Th>
                    <Th align="center">{t('반복 종료 일시')}</Th>
                    <Th align="left">{t('반복 정보')}</Th>
                    <Th align="center">{t('시작 시간')}</Th>
                    <Th align="center">{t('테스트 기간')}</Th>
                    <Th align="center">{t('테스트케이스 그룹')}</Th>
                    <Th align="center">{t('테스트케이스')}</Th>
                    <Th align="center">{t('테스터')}</Th>
                  </Tr>
                </THead>
                <Tbody>
                  {testrunIterations?.map(testrunIteration => {
                    return (
                      <Tr key={testrunIteration.id}>
                        <Td>
                          <Tag uppercase>{t(testrunIteration.expired ? '완료' : '반복')}</Tag>
                        </Td>
                        <Td className="name">
                          <Link to={`/spaces/${spaceCode}/projects/${projectId}/testruns/iterations/${testrunIteration.id}/info`}>{testrunIteration.name}</Link>
                        </Td>
                        <Td align="center">
                          <Tag className="tag" uppercase>
                            {dateUtil.getDateString(testrunIteration.reserveStartDateTime)}
                          </Tag>
                        </Td>
                        <Td align="center">
                          <Tag className="tag" uppercase>
                            {dateUtil.getDateString(testrunIteration.reserveEndDateTime)}
                          </Tag>
                        </Td>
                        <Td>
                          {testrunIteration.testrunIterationTimeType === 'WEEKLY' &&
                            [t('월'), t('화'), t('수'), t('목'), t('금'), t('토'), t('일')].map((day, jnx) => {
                              if (testrunIteration.days[jnx] === '1') {
                                return (
                                  <Tag key={jnx} className="day" uppercase border color="transparent">
                                    {day}
                                  </Tag>
                                );
                              }

                              return undefined;
                            })}
                          {testrunIteration.testrunIterationTimeType === 'WEEKLY' && (
                            <Tag className={`day ${testrunIteration.excludeHoliday ? 'selected' : ''}`} uppercase border color="transparent">
                              {testrunIteration.excludeHoliday ? t('휴일 포함') : t('휴일 제외')}
                            </Tag>
                          )}
                          {testrunIteration.testrunIterationTimeType === 'MONTHLY' && (
                            <Tag uppercase border color="transparent">
                              {TESTRUN_ITERATION_MONTHLY_DATES.find(d => d.key === testrunIteration.date)?.value}
                            </Tag>
                          )}
                          {testrunIteration.testrunIterationTimeType === 'MONTHLY_WEEKLY' && (
                            <Tag uppercase border color="transparent">
                              {HOLIDAY_CONDITION_WEEK_LIST.find(d => d.key === testrunIteration.week)?.value}
                            </Tag>
                          )}
                          {testrunIteration.testrunIterationTimeType === 'MONTHLY_WEEKLY' && (
                            <Tag uppercase border color="transparent">
                              {HOLIDAY_CONDITION_DAY_LIST.find(d => d.key === testrunIteration.day)?.value}
                            </Tag>
                          )}
                        </Td>
                        <Td className="start-time" align="center">
                          {dateUtil.getHourMinute(testrunIteration.startTime)}
                        </Td>
                        <Td className="duration" align="right">
                          {DURATIONS.find(d => d.key === testrunIteration.durationHours)?.value || t('@ 시간', { hours: testrunIteration.durationHours })}
                        </Td>
                        <Td className="testcase-count" align="right">
                          {testrunIteration.testcaseGroupCount}
                        </Td>
                        <Td className="testcase-count" align="right">
                          {testrunIteration.testcaseCount}
                        </Td>

                        <Td className="testcase-count" align="center">
                          <span>{t('@ 명', { count: testrunIteration.testrunUserCount })}</span>
                          {testrunIteration.testrunIterationUserFilterType !== 'NONE' && (
                            <>
                              <span>{t('중')}</span>
                              <span>{TESTRUN_ITERATION_USER_FILTER_TYPE_CODE.find(d => d.key === testrunIteration.testrunIterationUserFilterType)?.value}</span>
                              <span>{TESTRUN_ITERATION_USER_FILTER_SELECT_RULE.find(d => d.key === testrunIteration.testrunIterationUserFilterSelectRule)?.value}</span>
                              <span>{t('@ 명', { count: testrunIteration.filteringUserCount })}</span>
                            </>
                          )}
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </div>
          </>
        )}
      </PageContent>
    </Page>
  );
}

export default TestrunIterationListPage;
