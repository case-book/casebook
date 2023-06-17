import React, { useEffect, useState } from 'react';
import { Button, Card, EmptyContent, Liner, Page, PageContent, PageTitle, PieChart, Tag } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import TestrunService from '@/services/TestrunService';
import dateUtil from '@/utils/dateUtil';
import moment from 'moment';
import useStores from '@/hooks/useStores';
import './TestrunListPage.scss';
import ProjectService from '@/services/ProjectService';

function TestrunListPage() {
  const { t } = useTranslation();
  const {
    userStore: { user },
    socketStore: { addTopic, removeTopic, addMessageHandler, removeMessageHandler },
  } = useStores();
  const { spaceCode, projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [testruns, setTestruns] = useState([]);

  const getGraphData = testrun => {
    const list = [];
    const progress = testrun.passedTestcaseCount + testrun.failedTestcaseCount + testrun.untestableTestcaseCount;
    if (progress > 0) {
      list.push({
        id: 'PROGRESS',
        value: progress,
        color: 'rgba(57,125,2,0.6)',
        label: `수행-${Math.round((progress / testrun.totalTestcaseCount) * 100)}%`,
      });
    }

    if (testrun.totalTestcaseCount - progress > 0) {
      list.push({
        id: 'REMAINS',
        value: testrun.totalTestcaseCount - progress,
        color: 'rgba(0,0,0,0.2)',
        label: `미수행-${Math.round(((testrun.totalTestcaseCount - progress) / testrun.totalTestcaseCount) * 100)}%`,
      });
    }

    return list;
  };

  useEffect(() => {
    TestrunService.selectProjectTestrunList(spaceCode, projectId, list => {
      setTestruns(
        list.map(testrun => {
          return {
            ...testrun,
            data: getGraphData(testrun),
          };
        }),
      );
    });
    ProjectService.selectProjectName(spaceCode, projectId, info => {
      setProject(info);
    });
  }, [spaceCode, projectId]);

  const onMessage = info => {
    const { data } = info;

    switch (data.type) {
      case 'TESTRUN-CREATED': {
        const createdTestun = data.data.testrun;
        const nextTestruns = testruns.slice(0);
        const nextTestrun = nextTestruns.find(d => d.id === createdTestun.id);
        if (!nextTestrun) {
          nextTestruns.push({
            ...createdTestun,
            data: getGraphData(createdTestun),
          });
          setTestruns(nextTestruns);
        }

        break;
      }
      case 'TESTRUN-RESULT-CHANGED': {
        const { testrunStatus } = data.data;
        const changedTestrunId = data.data.testrunId;

        const nextTestruns = testruns.slice(0);
        const nextTestrun = nextTestruns.find(d => d.id === changedTestrunId);

        if (nextTestrun) {
          nextTestrun.failedTestcaseCount = testrunStatus.failedTestcaseCount;
          nextTestrun.passedTestcaseCount = testrunStatus.passedTestcaseCount;
          nextTestrun.totalTestcaseCount = testrunStatus.totalTestcaseCount;
          nextTestrun.untestableTestcaseCount = testrunStatus.untestableTestcaseCount;

          nextTestrun.data = getGraphData(nextTestrun);
          nextTestrun.opened = !testrunStatus.done;
          setTestruns(nextTestruns);
        }

        break;
      }

      default: {
        break;
      }
    }
  };

  useEffect(() => {
    if (user?.id && projectId) {
      addTopic(`/sub/projects/${projectId}`);
      addMessageHandler('TestrunListPage', onMessage);
    }

    return () => {
      removeTopic(`/sub/projects/${projectId}`);
      removeMessageHandler('TestrunListPage');
    };
  }, [user?.id, projectId, testruns]);

  return (
    <Page className="testrun-list-page-wrapper" list>
      <PageTitle
        className="page-title"
        breadcrumbs={[
          {
            to: '/',
            text: t('HOME'),
          },
          {
            to: '/',
            text: t('스페이스 목록'),
          },
          {
            to: `/spaces/${spaceCode}/info`,
            text: spaceCode,
          },
          {
            to: `/spaces/${spaceCode}/projects`,
            text: t('프로젝트 목록'),
          },
          {
            to: `/spaces/${spaceCode}/projects/${projectId}`,
            text: project?.name,
          },
          {
            to: `/spaces/${spaceCode}/projects/${projectId}/testruns`,
            text: t('테스트런'),
          },
        ]}
        links={[
          {
            to: `/spaces/${spaceCode}/projects/${projectId}/testruns/new`,
            text: t('테스트런'),
            color: 'primary',
            icon: <i className="fa-solid fa-plus" />,
          },
        ]}
        onListClick={() => {
          navigate(`/spaces/${spaceCode}/projects`);
        }}
      >
        {t('테스트런')}
      </PageTitle>
      <PageContent className="page-content">
        {testruns?.length <= 0 && (
          <EmptyContent border fill>
            <div>{t('실행 중인 테스트런이 없습니다.')}</div>
            <div>
              <Button
                outline
                color="primary"
                onClick={() => {
                  navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns/new`);
                }}
              >
                <i className="fa-solid fa-plus" /> {t('테스트런')}
              </Button>
            </div>
          </EmptyContent>
        )}

        {testruns?.length > 0 && (
          <ul className="testrun-cards">
            {testruns.map(testrun => {
              const progressPercentage = Math.round(((testrun.failedTestcaseCount + testrun.passedTestcaseCount + testrun.untestableTestcaseCount) / testrun.totalTestcaseCount) * 1000) / 10;
              const span = dateUtil.getSpan(moment.utc(), moment.utc(testrun.endDateTime));

              return (
                <li key={testrun.id}>
                  <Card className={`testrun-card ${testrun.opened ? 'opened' : 'closed'}`} border>
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
                      <div className="seq">{testrun.seqId}</div>
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
                      <div className="time-info">
                        <div className="time-span">
                          {testrun.opened && span.days > 0 && <span>{t('@ 일 남음', { days: span.days })}</span>}
                          {testrun.opened && span.days <= 0 && span.hours > 0 && (
                            <Tag color="white" border uppercase>
                              {t('@ 시간 남음', { hours: span.hours })}
                            </Tag>
                          )}
                          {testrun.opened && span.days <= 0 && span.hours <= 0 && <span>{t('기간 지남')}</span>}
                        </div>
                        <span className="calendar">
                          <i className="fa-regular fa-clock" />
                        </span>
                        {testrun.startDateTime && <span>{dateUtil.getDateString(testrun.startDateTime, 'monthsDaysHoursMinutes')}</span>}
                        <div className={`end-date-info ${!testrun.startDateTime ? 'no-start-time' : ''}`}>
                          {(testrun.startDateTime || testrun.endDateTime) && <Liner width="6px" height="1px" display="inline-block" margin="0 0.25rem 0 0" />}
                          {testrun.startDateTime && testrun.endDateTime && (
                            <span className={testrun.endDateTime && moment.utc().isAfter(moment.utc(testrun.endDateTime)) ? 'past' : ''}>
                              {dateUtil.getEndDateString(testrun.startDateTime, testrun.endDateTime)}
                            </span>
                          )}
                          {!testrun.startDateTime && testrun.endDateTime && (
                            <Tag color="white" border uppercase>
                              {dateUtil.getDateString(testrun.endDateTime)}
                            </Tag>
                          )}
                        </div>
                        {!testrun.startDateTime && !testrun.endDateTime && <Tag color="transparent">{t('설정된 테스트런 기간이 없습니다.')}</Tag>}
                      </div>
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
