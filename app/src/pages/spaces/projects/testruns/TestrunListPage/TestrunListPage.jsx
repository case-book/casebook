import React, { useEffect, useState } from 'react';
import { Button, Card, Liner, Page, PageContent, PageTitle, PieChart, Radio, SeqId, Tag, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import TestrunService from '@/services/TestrunService';
import dateUtil from '@/utils/dateUtil';
import moment from 'moment';
import useQueryString from '@/hooks/useQueryString';
import './TestrunListPage.scss';
import ReserveTestrunList from '@/pages/spaces/projects/testruns/TestrunListPage/ReserveTestrunList';
import IterationTestrunList from '@/pages/spaces/projects/testruns/TestrunListPage/IterationTestrunList';
import { ITEM_TYPE } from '@/constants/constants';

function TestrunListPage() {
  const { t } = useTranslation();
  const { spaceCode, projectId } = useParams();
  const navigate = useNavigate();
  const [testruns, setTestruns] = useState([]);
  const [status, setStatus] = useState('OPENED');
  const { query, setQuery } = useQueryString();
  const { type = 'CREATE' } = query;

  useEffect(() => {
    if (type === 'CREATE') {
      TestrunService.selectProjectTestrunList(spaceCode, projectId, status, 'CREATE', list => {
        setTestruns(
          list.map(testrun => {
            const data = [];
            const progress = testrun.passedTestcaseCount + testrun.failedTestcaseCount + testrun.untestableTestcaseCount;
            if (progress > 0) {
              data.push({
                id: 'PROGRESS',
                value: progress,
                color: 'rgba(57,125,2,0.6)',
                label: `수행-${Math.round((progress / testrun.totalTestcaseCount) * 100)}%`,
              });
            }

            if (testrun.totalTestcaseCount - progress > 0) {
              data.push({
                id: 'REMAINS',
                value: testrun.totalTestcaseCount - progress,
                color: 'rgba(0,0,0,0.2)',
                label: `미수행-${Math.round(((testrun.totalTestcaseCount - progress) / testrun.totalTestcaseCount) * 100)}%`,
              });
            }

            return {
              ...testrun,
              data,
            };
          }),
        );
      });
    } else {
      TestrunService.selectProjectTestrunList(spaceCode, projectId, '', type, list => {
        setTestruns(list);
      });
    }
  }, [type, spaceCode, status]);

  const onChangeSearchTestrunCreationType = value => {
    if (value) {
      setStatus('OPENED');
    }
    setQuery({ type: value });
  };

  return (
    <Page className="testrun-list-page-wrapper" list={type === 'CREATE'}>
      <PageTitle
        className="page-title"
        links={[
          <Link to={`/spaces/${spaceCode}/projects/${projectId}/testruns/new`}>
            <i className="fa-solid fa-plus" /> {t('테스트런')}
          </Link>,
        ]}
        control={
          <div className="options">
            {type === 'CREATE' && (
              <>
                <div>
                  <Radio
                    size="sm"
                    value="ALL"
                    type="line"
                    checked={status === 'ALL'}
                    onChange={val => {
                      setStatus(val);
                    }}
                    label={t('전체')}
                  />
                  <Radio
                    size="sm"
                    value="OPENED"
                    type="line"
                    checked={status === 'OPENED'}
                    onChange={val => {
                      setStatus(val);
                    }}
                    label={t('진행 중인 테스트런')}
                  />
                  <Radio
                    size="sm"
                    value="CLOSED"
                    type="line"
                    checked={status === 'CLOSED'}
                    onChange={val => {
                      setStatus(val);
                    }}
                    label={t('종료된 테스트런')}
                  />
                </div>
                <Liner className="dash" width="1px" height="10px" display="inline-block" color="black" margin="0 0.75rem 0 0.5rem" />
              </>
            )}
            <div>
              <Radio
                size="sm"
                value="CREATE"
                checked={type === 'CREATE'}
                onChange={val => {
                  onChangeSearchTestrunCreationType(val);
                }}
                label="테스트런"
              />
              <Radio
                size="sm"
                value="RESERVE"
                checked={type === 'RESERVE'}
                onChange={val => {
                  onChangeSearchTestrunCreationType(val);
                }}
                label="예약"
              />
              <Radio
                size="sm"
                value="ITERATION"
                checked={type === 'ITERATION'}
                onChange={val => {
                  onChangeSearchTestrunCreationType(val);
                }}
                label="반복"
              />
            </div>
          </div>
        }
        onListClick={() => {
          navigate(`/spaces/${spaceCode}/projects`);
        }}
      >
        {t('테스트런')}
      </PageTitle>
      <PageContent className="page-content">
        {testruns?.length <= 0 && (
          <div className="no-project">
            <div>
              {type === 'RESERVE' && <div>{t('예약된 테스트런이 없습니다.')}</div>}
              {type === 'ITERATION' && <div>{t('반복 설정된 테스트런이 없습니다.')}</div>}
              {!(type === 'RESERVE' || type === 'ITERATION') && <div>{t('조회된 테스트런이 없습니다.')}</div>}
              <div>
                <Button
                  outline
                  onClick={() => {
                    navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns/new?creationType=${type}`);
                  }}
                >
                  <i className="fa-solid fa-plus" /> {t('테스트런')}
                </Button>
              </div>
            </div>
          </div>
        )}
        {type === 'RESERVE' && testruns?.length > 0 && (
          <>
            <Title border={false}>{t('예약 테스트런 리스트')}</Title>
            <ReserveTestrunList projectId={projectId} spaceCode={spaceCode} testruns={testruns} />
          </>
        )}
        {type === 'ITERATION' && testruns?.length > 0 && (
          <>
            <Title border={false}>{t('반복 테스트런 리스트')}</Title>
            <IterationTestrunList projectId={projectId} spaceCode={spaceCode} testruns={testruns} />
          </>
        )}
        {type === 'CREATE' && testruns?.length > 0 && (
          <ul className="testrun-cards">
            {testruns.map(testrun => {
              const progressPercentage = Math.round(((testrun.failedTestcaseCount + testrun.passedTestcaseCount + testrun.untestableTestcaseCount) / testrun.totalTestcaseCount) * 1000) / 10;
              const span = dateUtil.getSpan(moment.utc(), moment.utc(testrun.endDateTime));

              return (
                <li key={testrun.id}>
                  <Card className={`testrun-card ${testrun.opened ? 'opened' : 'closed'}`} border>
                    <div className="status">
                      <Tag className="status-tag" size="xs">
                        {testrun.opened ? t('진행중') : t('종료됨')}
                      </Tag>
                    </div>
                    <div className="config-button">
                      <Button
                        rounded
                        outline
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns/${testrun.id}/info`);
                        }}
                      >
                        <i className="fa-solid fa-gear" />
                      </Button>
                    </div>
                    <div className="name">
                      <div className="seq">
                        <SeqId className="seq-id" type={ITEM_TYPE.TESTCASE} copy={false} size="sm">
                          {testrun.seqId}
                        </SeqId>
                      </div>
                      <div className="text">
                        <Link to={`/spaces/${spaceCode}/projects/${projectId}/testruns/${testrun.id}`}>{testrun.name}</Link>
                      </div>
                    </div>
                    <div className="description">{testrun.description}</div>
                    <div className="chart">
                      <div className="chart-content">
                        <PieChart
                          data={testrun.data}
                          legend={false}
                          tooltip={false}
                          activeOuterRadiusOffset={0}
                          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                          isInteractive={false}
                          defs={[
                            {
                              id: 'PROGRESS',
                              type: 'patternLines',
                              background: testrun?.data?.find(d => d.id === 'PROGRESS')?.color,
                              color: 'rgba(0,0,0,0.1)',
                              rotation: -45,
                              lineWidth: 6,
                              spacing: 10,
                            },
                            {
                              id: 'REMAINS',
                              type: 'patternDots',
                              background: testrun?.data?.find(d => d.id === 'REMAINS')?.color,
                              color: 'rgba(0,0,0,0.1)',
                              size: 8,
                              padding: 1,
                              stagger: true,
                            },
                          ]}
                          fill={[
                            {
                              match: {
                                id: 'PASSED',
                              },
                              id: 'PASSED',
                            },
                            {
                              match: {
                                id: 'FAILED',
                              },
                              id: 'FAILED',
                            },
                            {
                              match: {
                                id: 'UNTESTED',
                              },
                              id: 'UNTESTED',
                            },
                          ]}
                        />
                      </div>
                      <div className="progress-content">
                        <div className="percentage-info">
                          <span className="percentage">{progressPercentage}</span>
                          <span className="symbol">%</span>
                        </div>
                        <div className="progress-label">{t('진행')}</div>
                      </div>
                    </div>
                    <div className="testrun-others">
                      {testrun.opened && (
                        <div className="time-info">
                          <div className="time-span">
                            {testrun.opened && span.days > 0 && (
                              <Tag color="white" border uppercase>
                                {t('@ 일 남음', { days: span.days })}
                              </Tag>
                            )}
                            {testrun.opened && span.days <= 0 && span.hours > 0 && (
                              <Tag color="white" border uppercase>
                                {t('@ 시간 남음', { hours: span.hours })}
                              </Tag>
                            )}
                            {testrun.opened && span.days <= 0 && span.hours <= 0 && (
                              <Tag color="white" border uppercase>
                                {t('기간 지남')}
                              </Tag>
                            )}
                          </div>
                          <span className="calendar">
                            <i className="fa-regular fa-clock" />
                          </span>
                          {testrun.startDateTime && (
                            <Tag color="transparent" uppercase>
                              {dateUtil.getDateString(testrun.startDateTime, 'monthsDaysHoursMinutes')}
                            </Tag>
                          )}
                          <div className={`end-date-info ${!testrun.startDateTime ? 'no-start-time' : ''}`}>
                            {(testrun.startDateTime || testrun.endDateTime) && <Liner width="6px" height="1px" display="inline-block" margin="0 0.25rem 0 0" />}
                            {testrun.startDateTime && testrun.endDateTime && (
                              <Tag color="white" border uppercase className={testrun.endDateTime && moment.utc().isAfter(moment.utc(testrun.endDateTime)) ? 'past' : ''}>
                                {dateUtil.getEndDateString(testrun.startDateTime, testrun.endDateTime)}
                              </Tag>
                            )}
                            {!testrun.startDateTime && testrun.endDateTime && (
                              <Tag color="white" border uppercase>
                                {dateUtil.getDateString(testrun.endDateTime)}
                              </Tag>
                            )}
                          </div>
                          {!testrun.startDateTime && !testrun.endDateTime && <Tag color="transparent">{t('설정된 테스트런 기간이 없습니다.')}</Tag>}
                        </div>
                      )}
                      {!testrun.opened && (
                        <div className="time-info">
                          {testrun.startDateTime && (testrun.closedDate || testrun.endDateTime) && (
                            <div className="time-summary">
                              {t('@부터 @까지 테스트 진행', {
                                from: dateUtil.getDateString(testrun.startDateTime, 'monthsDaysHoursMinutes'),
                                to: dateUtil.getEndDateString(testrun.startDateTime, testrun.closedDate || testrun.endDateTime),
                              })}
                            </div>
                          )}
                          {!(testrun.startDateTime && (testrun.closedDate || testrun.endDateTime)) && <div className="time-summary">{t('설정된 테스트런 기간이 없습니다.')}</div>}
                        </div>
                      )}
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </PageContent>
    </Page>
  );
}

export default TestrunListPage;
