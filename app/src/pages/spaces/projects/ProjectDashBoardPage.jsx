import React, { useEffect, useState } from 'react';
import { EmptyContent, Liner, Page, PageContent, PageTitle, PieChart, Radio, Title } from '@/components';
import { useTranslation } from 'react-i18next';

import TestrunService from '@/services/TestrunService';
import { useParams } from 'react-router';
import './ProjectDashBoardPage.scss';
import { DATE_FORMATS_TYPES, ITEM_TYPE, TESTRUN_RESULT_CODE } from '@/constants/constants';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import dateUtil from '@/utils/dateUtil';
import ReactTooltip from 'react-tooltip';
import ProjectService from '@/services/ProjectService';

function ProjectDashBoardPage() {
  const { t } = useTranslation();
  const { spaceCode, projectId } = useParams();
  const [periods] = useState([
    { key: '1', value: t('@개월', { month: 1 }) },
    { key: '3', value: t('@개월', { month: 3 }) },
    { key: '6', value: t('@개월', { month: 6 }) },
    { key: '12', value: t('@개월', { month: 12 }) },
  ]);
  const [period, setPeriod] = useState('1');
  const [project, setProject] = useState(null);
  const [periodRange, setPeriodRange] = useState({});
  const [testruns, setTestruns] = useState([]);
  const [testrunHistories, setTestrunHistories] = useState([]);
  const [userAssignedTestruns, setUserAssignedTestruns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [testrunHistories]);

  useEffect(() => {
    TestrunService.selectProjectTestrunList(spaceCode, projectId, list => {
      setTestruns(
        list.map(testrun => {
          const data = [];
          data.push({
            id: 'PASSED',
            value: testrun.passedTestcaseCount,
            color: 'rgba(57,125,2,0.6)',
            label: `${TESTRUN_RESULT_CODE.PASSED}-${Math.round((testrun.passedTestcaseCount / testrun.totalTestcaseCount) * 100)}%`,
          });
          data.push({
            id: 'FAILED',
            value: testrun.failedTestcaseCount,
            color: 'rgba(244,117,96,1)',
            label: `${TESTRUN_RESULT_CODE.FAILED}-${Math.round((testrun.failedTestcaseCount / testrun.totalTestcaseCount) * 100)}%`,
          });
          data.push({
            id: 'UNTESTED',
            value: testrun.totalTestcaseCount - testrun.passedTestcaseCount - testrun.failedTestcaseCount,
            color: 'rgba(0,0,0,0.2)',
            label: `${TESTRUN_RESULT_CODE.OTHERS}-${Math.round(((testrun.totalTestcaseCount - testrun.passedTestcaseCount - testrun.failedTestcaseCount) / testrun.totalTestcaseCount) * 100)}%`,
          });
          return {
            ...testrun,
            data,
          };
        }),
      );
    });

    TestrunService.selectUserAssignedTestrunList(spaceCode, projectId, list => {
      setUserAssignedTestruns(list);
    });

    ProjectService.selectProjectName(spaceCode, projectId, info => {
      setProject(info);
    });
  }, [spaceCode, projectId]);

  useEffect(() => {
    const end = moment();
    end.hour(23);
    end.minute(59);
    end.second(59);
    end.millisecond(59);
    const start = moment().subtract(period, 'months');

    setPeriodRange({
      start,
      end,
    });
    TestrunService.selectTestrunHistoryList(spaceCode, projectId, start.toISOString(), end.toISOString(), list => {
      setTestrunHistories(list);
    });
  }, [spaceCode, projectId, period]);

  return (
    <Page className="project-overview-info-page-wrapper">
      <PageTitle
        name={t('대시보드')}
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
            to: `/spaces/${spaceCode}/projects/${projectId}`,
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
        <div className="scroll-content current-testrun-content">
          <div>
            {testruns.length < 1 && <EmptyContent className="empty-content">{t('진행 중인 테스트런이 없습니다.')}</EmptyContent>}
            {testruns.length > 0 && (
              <ul>
                {testruns.map(testrun => {
                  return (
                    <li key={testrun.id} className={`${testruns.length > 3 ? 'over-3' : 'until-3'} ${testruns.length > 2 ? 'over-2' : ''}  ${testruns.length > 1 ? 'over-1' : ''}`}>
                      <div className="name">
                        <div className="seq">{testrun.seqId}</div>
                        <div className="text">
                          <Link to={`/spaces/${spaceCode}/projects/${projectId}/testruns/${testrun.id}`}>{testrun.name}</Link>
                        </div>
                      </div>
                      <div className="chart">
                        <div className="chart-content">
                          <PieChart
                            margin={{ top: 20, right: 80, bottom: 80, left: 80 }}
                            onClick={() => {
                              navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns/${testrun.id}`);
                            }}
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
                            data={testrun.data}
                            defs={[
                              {
                                id: 'PASSED',
                                type: 'patternLines',
                                background: testrun.data.find(d => d.id === 'PASSED').color,
                                color: 'rgba(0,0,0,0.1)',
                                rotation: -45,
                                lineWidth: 6,
                                spacing: 10,
                              },
                              {
                                id: 'FAILED',
                                type: 'patternDots',
                                background: testrun.data.find(d => d.id === 'FAILED').color,
                                color: 'rgba(0,0,0,0.1)',
                                size: 8,
                                padding: 1,
                                stagger: true,
                              },
                              {
                                id: 'UNTESTED',
                                type: 'patternLines',
                                background: testrun.data.find(d => d.id === 'UNTESTED').color,
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
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
        <Title border={false} marginBottom={false}>
          {t('내가 진행해야할 테스트')}
        </Title>
        <div className="scroll-content my-testrun-content">
          <div>
            {userAssignedTestruns.length < 1 && <EmptyContent className="empty-content">{t('할당된 테스트케이스가 없습니다.')}</EmptyContent>}
            {userAssignedTestruns.length > 0 && (
              <ul>
                {userAssignedTestruns.map(testrun => {
                  let totalCount = 0;
                  let doneCount = 0;

                  testrun.testcaseGroups.forEach(testcaseGroup => {
                    testcaseGroup.testcases?.forEach(testcase => {
                      totalCount += 1;
                      if (testcase.testResult !== 'UNTESTED') {
                        doneCount += 1;
                      }
                    });
                  });

                  return (
                    <li key={testrun.id}>
                      <div className="name">
                        <div className="seq">{testrun.seqId}</div>
                        <div className="text">
                          <Link to={`/spaces/${spaceCode}/projects/${projectId}/testruns/${testrun.id}`}>{testrun.name}</Link>
                        </div>
                      </div>
                      <div className="summary">
                        <div>
                          <div className="percentage">
                            <span>{t('내 진행률')}</span>
                            <span>{Math.round((doneCount / totalCount) * 100)}%</span>
                          </div>
                          <div>
                            <Liner width="1px" height="10px" margin="0 0.5rem" />
                          </div>
                          <div className="count">
                            {doneCount} / {totalCount}
                          </div>
                          <div>
                            <Liner width="1px" height="10px" margin="0 0.5rem" />
                          </div>
                          <div className="progress">
                            <div>
                              <div
                                className="done"
                                style={{
                                  width: `${(doneCount / totalCount) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="testcase-list-title">{t('내 테스트케이스')}</div>
                      <div className="list">
                        <ul>
                          {testrun.testcaseGroups.map(testcaseGroup => {
                            return (
                              <li key={testcaseGroup.id}>
                                <div className="testcase-group-name">{testcaseGroup.name}</div>
                                <ul className="testcase-list">
                                  {testcaseGroup.testcases?.map(testcase => {
                                    return (
                                      <li key={testcase.id}>
                                        <div>
                                          <div className="testcase-name">
                                            <Link
                                              className={testcase.testResult}
                                              to={`/spaces/${spaceCode}/projects/${projectId}/testruns/${testrun.id}?tester=&type=${ITEM_TYPE.TESTCASE}&id=${testcase.testrunTestcaseGroupTestcaseId}`}
                                            >
                                              {testcase.name}
                                            </Link>
                                          </div>
                                          <div className="testcase-result">
                                            <span className={testcase.testResult}>{TESTRUN_RESULT_CODE[testcase.testResult]}</span>
                                          </div>
                                        </div>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
        <Title
          border={false}
          marginBottom={false}
          control={periods.map(d => {
            return (
              <Radio
                key={d.key}
                size="xs"
                value={d.key}
                type="inline"
                checked={period === d.key}
                onChange={val => {
                  setPeriod(val);
                }}
                label={d.value}
              />
            );
          })}
        >
          {t('테스트런 히스토리')}
        </Title>
        <div className="testrun-history-content">
          <div className="testrun-history-chart">
            <div className="chart-content">
              {testrunHistories.length < 1 && <EmptyContent className="empty-content">{t('테스트런 히스토리가 없습니다.')}</EmptyContent>}
              {testrunHistories.length > 0 && (
                <ul>
                  {testrunHistories
                    .sort((a, b) => {
                      return moment(a.startDateTime) - moment(b.startDateTime);
                    })
                    .map(d => {
                      const start = periodRange.start?.valueOf();
                      const end = periodRange.end?.valueOf();
                      const totalSpan = end - start;
                      const currentCloseSpan = moment(d.closedDate || d.endDateTime).valueOf() - moment(d.startDateTime).valueOf();

                      const left = ((moment(d.startDateTime).valueOf() - start) / totalSpan) * 100;
                      return (
                        <li key={d.id}>
                          <div
                            style={{
                              left: `${left < 0 ? 0 : left}%`,
                            }}
                          >
                            <div
                              className="start-close-line"
                              style={{
                                width: `${(currentCloseSpan / totalSpan) * 100}%`,
                              }}
                              data-tip={`${dateUtil.getDateString(d.startDateTime)}-${dateUtil.getDateString(
                                moment(d.closedDate || d.endDateTime).valueOf(),
                                DATE_FORMATS_TYPES.monthsDaysHoursMinutes,
                              )} [ ${d.passedTestcaseCount} PASSED / ${d.failedTestcaseCount} FAILED ]`}
                              onClick={() => {
                                navigate(`/spaces/${spaceCode}/projects/${projectId}/reports/${d.id}`);
                              }}
                            >
                              <div
                                className="passed"
                                style={{
                                  width: `${(d.passedTestcaseCount / d.totalTestcaseCount) * 100}%`,
                                }}
                              />
                              <div
                                className="failed"
                                style={{
                                  width: `${(d.failedTestcaseCount / d.totalTestcaseCount) * 100}%`,
                                }}
                              />
                            </div>
                            <div className={`testrun-name ${((moment(d.startDateTime).valueOf() - start) / totalSpan) * 100 > 10 ? 'left' : ''}`}>
                              <span>{d.name}</span>
                            </div>
                            <div className={`testrun-start-date ${((moment(d.startDateTime).valueOf() - start) / totalSpan) * 100 > 10 ? 'left' : ''}`}>
                              <span>{dateUtil.getDateString(d.startDateTime, DATE_FORMATS_TYPES.days)}</span>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                </ul>
              )}
            </div>
            <div className="chart-axis">
              <div className="line">
                <div className="start-line">
                  <div />
                </div>
                <div className="center-line">
                  <div />
                </div>
                <div className="end-line">
                  <div />
                </div>
              </div>
              <div className="range">
                <span>{dateUtil.getDateString(periodRange.start, DATE_FORMATS_TYPES.yearsDays)}</span>
              </div>
              <div className="range">
                <span>{dateUtil.getDateString(periodRange.end, DATE_FORMATS_TYPES.yearsDays)}</span>
              </div>
            </div>
          </div>
        </div>
      </PageContent>
    </Page>
  );
}

ProjectDashBoardPage.defaultProps = {};

ProjectDashBoardPage.propTypes = {};

export default ProjectDashBoardPage;
