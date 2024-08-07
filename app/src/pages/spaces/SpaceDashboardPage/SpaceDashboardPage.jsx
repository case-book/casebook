import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, EmptyContent, Liner, Page, PageContent, PageTitle, PieChart, Tag, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import TestrunService from '@/services/TestrunService';
import { TESTRUN_RESULT_CODE } from '@/constants/constants';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import dateUtil from '@/utils/dateUtil';
import SpaceService from '@/services/SpaceService';
import useStores from '@/hooks/useStores';
import './SpaceDashboardPage.scss';

function SpaceDashboardPage() {
  const { t } = useTranslation();

  const {
    userStore: { user },
    contextStore: { spaceCode },
  } = useStores();

  const [projectTestruns, setProjectTestruns] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    SpaceService.selectSpaceTestrunDetailList(spaceCode, data => {
      if (!spaceCode) {
        return;
      }

      setProjectTestruns(
        data.map(d => {
          return {
            ...d,
            testruns: d.testruns.map(testrun => {
              const pies = [];
              if (testrun.passedTestcaseCount > 0) {
                pies.push({
                  id: 'PASSED',
                  value: testrun.passedTestcaseCount,
                  color: 'rgba(57,125,2,0.6)',
                  label: `${TESTRUN_RESULT_CODE.PASSED}-${Math.round((testrun.passedTestcaseCount / testrun.totalTestcaseCount) * 100)}%`,
                });
              }

              if (testrun.failedTestcaseCount > 0) {
                pies.push({
                  id: 'FAILED',
                  value: testrun.failedTestcaseCount,
                  color: 'rgba(244,117,96,1)',
                  label: `${TESTRUN_RESULT_CODE.FAILED}-${Math.round((testrun.failedTestcaseCount / testrun.totalTestcaseCount) * 100)}%`,
                });
              }

              if (testrun.totalTestcaseCount - testrun.passedTestcaseCount - testrun.failedTestcaseCount > 0) {
                pies.push({
                  id: 'UNTESTED',
                  value: testrun.totalTestcaseCount - testrun.passedTestcaseCount - testrun.failedTestcaseCount,
                  color: 'rgba(0,0,0,0.2)',
                  label: `${TESTRUN_RESULT_CODE.OTHERS}-${Math.round(((testrun.totalTestcaseCount - testrun.passedTestcaseCount - testrun.failedTestcaseCount) / testrun.totalTestcaseCount) * 100)}%`,
                });
              }

              return {
                ...testrun,
                pies,
                summary: {
                  totalCount: testrun.testcaseGroups?.reduce((acc, cur) => {
                    return (
                      acc +
                      (cur.testcases?.reduce((s, testcase) => {
                        return s + (testcase.testerId === user.id ? 1 : 0);
                      }, 0) || 0)
                    );
                  }, 0),
                  doneCount: testrun.testcaseGroups?.reduce((acc, cur) => {
                    return (
                      acc +
                      (cur.testcases?.reduce((s, testcase) => {
                        return s + (testcase.testerId === user.id && testcase.testResult !== 'UNTESTED' ? 1 : 0);
                      }, 0) || 0)
                    );
                  }, 0),
                },
              };
            }),
          };
        }),
      );
    });
  }, [spaceCode]);

  const list = useMemo(() => {
    return projectTestruns.filter(projectTestrun => projectTestrun.testruns.length > 0);
  }, [projectTestruns]);

  const onNotify = (projectId, testrunId) => {
    TestrunService.notifyTestrunProgress(spaceCode, projectId, testrunId, () => {});
  };

  return (
    <Page className="space-dashboard-page-wrapper">
      <PageTitle
        name={t('대시보드')}
        breadcrumbs={[
          {
            to: '/',
            text: t('HOME'),
          },
          {
            to: `/spaces/${spaceCode}/info`,
            text: spaceCode,
          },
          {
            to: `/spaces/${spaceCode}/dashboard`,
            text: t('대시보드'),
          },
        ]}
        onListClick={() => {
          navigate(`/spaces/${spaceCode}/projects`);
        }}
      >
        {t('대시보드')}
      </PageTitle>
      <PageContent flex>
        <Title border={false} marginBottom={false}>
          {t('진행 중인 테스트런')}
        </Title>
        {list.length < 1 && (
          <EmptyContent border fill className="empty-content">
            {t('진행 중인 테스트런이 없습니다.')}
          </EmptyContent>
        )}
        {list.length > 0 && (
          <ul className="project-testrun-list">
            {list.map(projectTestrun => {
              return (
                <li key={projectTestrun.id}>
                  <div className="project-name">
                    <Tag border rounded size="sm">
                      PROJECT
                    </Tag>
                    <span>{projectTestrun.name}</span>
                  </div>
                  <ul className="testruns">
                    {projectTestrun.testruns.map(testrun => {
                      const progressPercentage =
                        testrun.totalTestcaseCount > 0
                          ? Math.round(((testrun.failedTestcaseCount + testrun.passedTestcaseCount + testrun.untestableTestcaseCount) / testrun.totalTestcaseCount) * 1000) / 10
                          : 0;
                      const span = dateUtil.getSpan(moment.utc(), moment.utc(testrun.endDateTime));

                      return (
                        <li key={testrun.id}>
                          <Card className="testrun-card" border>
                            <div>
                              <div className="testrun-name">
                                <Link to={`/spaces/${spaceCode}/projects/${projectTestrun.id}/testruns/${testrun.id}`}>{testrun.name}</Link>
                              </div>
                              <div className="testrun-content">
                                <div className="pie">
                                  <PieChart
                                    margin={{
                                      top: 0,
                                      right: 20,
                                      bottom: 20,
                                      left: 20,
                                    }}
                                    onClick={() => {
                                      navigate(`/spaces/${spaceCode}/projects/${projectTestrun.id}/testruns/${testrun.id}`);
                                    }}
                                    tooltip={false}
                                    legend={false}
                                    getArcLabel={id => {
                                      if (id === 'PASSED') {
                                        return '성공';
                                      }

                                      if (id === 'FAILED') {
                                        return '실패';
                                      }

                                      if (id === 'UNTESTED') {
                                        return '미수행&수행불가';
                                      }

                                      return id;
                                    }}
                                    data={testrun.pies}
                                    defs={[
                                      {
                                        id: 'PASSED',
                                        type: 'patternLines',
                                        background: testrun.pies.find(d => d.id === 'PASSED')?.color,
                                        color: 'rgba(0,0,0,0.1)',
                                        rotation: -45,
                                        lineWidth: 6,
                                        spacing: 10,
                                      },
                                      {
                                        id: 'FAILED',
                                        type: 'patternDots',
                                        background: testrun.pies.find(d => d.id === 'FAILED')?.color,
                                        color: 'rgba(0,0,0,0.1)',
                                        size: 8,
                                        padding: 1,
                                        stagger: true,
                                      },
                                      {
                                        id: 'UNTESTED',
                                        type: 'patternLines',
                                        background: testrun.pies.find(d => d.id === 'UNTESTED')?.color,
                                        color: 'rgba(0,0,0,0.2)',
                                        rotation: 45,
                                        lineWidth: 6,
                                        spacing: 10,
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
                                <div className="testrun-info">
                                  <div className="total-progress">
                                    <div className="label">{t('전체 진행율')}</div>
                                    <div className="progress-percentage">{progressPercentage}%</div>
                                    <div className="progress-count">
                                      <Tag size="xs" border rounded>
                                        {testrun.passedTestcaseCount + testrun.failedTestcaseCount + testrun.untestableTestcaseCount} / {testrun.totalTestcaseCount}
                                      </Tag>
                                      {!(Number.isNaN(span.days) || Number.isNaN(span.hours)) && (
                                        <Tag border rounded size="xs">
                                          <div className="time-span">
                                            {span.days > 0 && <span>{t('@ 일 남음', { days: span.days })}</span>}
                                            {span.days <= 0 && span.hours > 0 && (
                                              <Tag color="white" border uppercase>
                                                {t('@ 시간 남음', { hours: span.hours })}
                                              </Tag>
                                            )}
                                            {span.days <= 0 && span.hours <= 0 && <span>{t('기간 지남')}</span>}
                                          </div>
                                        </Tag>
                                      )}
                                    </div>
                                  </div>
                                  <div className="time-info">
                                    <span className="calendar">
                                      <i className="fa-regular fa-clock" />
                                    </span>
                                    {testrun.startDateTime && <span>{dateUtil.getDateString(testrun.startDateTime, 'monthsDaysHoursMinutes')}</span>}
                                    {(testrun.startDateTime || testrun.endDateTime) && <Liner width="6px" height="1px" display="inline-block" />}
                                    <div className={`end-date-info ${!testrun.startDateTime ? 'no-start-time' : ''}`}>
                                      {testrun.startDateTime && testrun.endDateTime && (
                                        <span className={testrun.endDateTime && moment.utc().isAfter(moment.utc(testrun.endDateTime)) ? 'past' : ''}>
                                          {dateUtil.getEndDateString(testrun.startDateTime, testrun.endDateTime)}
                                        </span>
                                      )}
                                      {!testrun.startDateTime && testrun.endDateTime && <span>{dateUtil.getDateString(testrun.endDateTime)}</span>}
                                    </div>
                                    {!testrun.startDateTime && !testrun.endDateTime && <span>{t('설정된 테스트런 기간이 없습니다.')}</span>}
                                  </div>
                                  <div className="my-test">
                                    <div className="my-test-title">
                                      <div className="line-1">
                                        <div />
                                      </div>
                                      <div>{t('내 테스트')}</div>
                                      <div className="line-2">
                                        <div />
                                      </div>
                                    </div>
                                    <div className="my-test-summary">
                                      <div>
                                        <div className="title done">
                                          <span>{t('완료')}</span>
                                        </div>
                                        <div
                                          className="value"
                                          onClick={() => {
                                            navigate(`/spaces/${spaceCode}/projects/${projectTestrun.id}/testruns/${testrun.id}?tester=${user.id}`);
                                          }}
                                        >
                                          <span>{testrun.summary.doneCount}</span>
                                        </div>
                                      </div>
                                      <div>
                                        <div className="title remains">
                                          <span>{t('미수행')}</span>
                                        </div>
                                        <div
                                          className="value"
                                          onClick={() => {
                                            navigate(`/spaces/${spaceCode}/projects/${projectTestrun.id}/testruns/${testrun.id}?tester=${user.id}`);
                                          }}
                                        >
                                          <span>{testrun.summary.totalCount - testrun.summary.doneCount}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="controls">
                                    <Button
                                      rounded
                                      size="lg"
                                      disabled={testrun.messageChannels.length < 1}
                                      tip={testrun.messageChannels.length > 0 ? t('진행 상황 알림') : t('등록된 메세지 채널이 없습니다.')}
                                      onClick={() => {
                                        onNotify(projectTestrun.id, testrun.id);
                                      }}
                                    >
                                      <i className="fa-solid fa-bullhorn" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        )}
      </PageContent>
    </Page>
  );
}

SpaceDashboardPage.defaultProps = {};

SpaceDashboardPage.propTypes = {};

export default observer(SpaceDashboardPage);
