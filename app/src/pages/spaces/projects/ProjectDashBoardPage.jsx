import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, EmptyContent, Page, PageContent, PageTitle, PieChart, Radio, SeqId } from '@/components';
import { useTranslation } from 'react-i18next';

import TestrunService from '@/services/TestrunService';
import { useParams } from 'react-router';
import './ProjectDashBoardPage.scss';
import { DATE_FORMATS_TYPES, ITEM_TYPE, TESTRUN_RESULT_CODE } from '@/constants/constants';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import dateUtil from '@/utils/dateUtil';
import ReactTooltip from 'react-tooltip';

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
  const [periodRange, setPeriodRange] = useState({});
  const [testruns, setTestruns] = useState([]);
  const [testrunHistories, setTestrunHistories] = useState([]);
  const [userAssignedTestruns, setUserAssignedTestruns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [testrunHistories]);

  useEffect(() => {
    TestrunService.selectProjectTestrunList(spaceCode, projectId, 'OPENED', list => {
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
    <Page className="project-overview-info-page-wrapper" list wide>
      <PageTitle>{t('대시보드')}</PageTitle>
      <PageContent flex>
        <Card className="testruning-info">
          <CardHeader className="card-header">{t('진행 중인 테스트런')}</CardHeader>
          <CardContent scroll horizontal className={`card-content ${testruns?.length < 1 ? 'empty' : ''}`}>
            {testruns.length < 1 && <EmptyContent className="empty-content">{t('진행 중인 테스트런이 없습니다.')}</EmptyContent>}
            {testruns.length > 0 && (
              <ul>
                {testruns.map(testrun => {
                  return (
                    <li key={testrun.id} className={`${testruns.length > 3 ? 'over-3' : 'until-3'} ${testruns.length > 2 ? 'over-2' : ''}  ${testruns.length > 1 ? 'over-1' : ''}`}>
                      <div className="name">
                        <div className="seq">
                          <SeqId type={ITEM_TYPE.TESTCASE} copy={false}>
                            {testrun.seqId}
                          </SeqId>
                        </div>
                        <div className="text">
                          <Link to={`/spaces/${spaceCode}/projects/${projectId}/testruns/${testrun.id}`}>{testrun.name}</Link>
                        </div>
                      </div>
                      <div className="chart">
                        <div className="chart-content">
                          <PieChart
                            onClick={() => {
                              navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns/${testrun.id}`);
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
                          />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card className="my-testrun-info">
          <CardHeader className="card-header">{t('내가 진행해야할 테스트')}</CardHeader>
          <CardContent scroll horizontal className={`card-content my-testrun-content  ${userAssignedTestruns?.length < 1 ? 'empty' : ''}`}>
            {userAssignedTestruns.length < 1 && <EmptyContent className="empty-content">{t('할당된 테스트 케이스가 없습니다.')}</EmptyContent>}
            {userAssignedTestruns.length > 0 && (
              <ul>
                {userAssignedTestruns.map(testrun => {
                  let totalCount = 0;
                  let doneCount = 0;
                  let remainCount = 0;
                  testrun.testcaseGroups.forEach(testcaseGroup => {
                    testcaseGroup.testcases?.forEach(testcase => {
                      totalCount += 1;
                      if (testcase.testResult === 'UNTESTED') {
                        remainCount += 1;
                      } else {
                        doneCount += 1;
                      }
                    });
                  });

                  return (
                    <li key={testrun.id}>
                      <div className="name">
                        <div className="seq">
                          <SeqId type={ITEM_TYPE.TESTCASE} copy={false}>
                            {testrun.seqId}
                          </SeqId>
                        </div>
                        <div className="text">
                          <Link to={`/spaces/${spaceCode}/projects/${projectId}/testruns/${testrun.id}`}>{testrun.name}</Link>
                        </div>
                      </div>
                      <div className="summary">
                        <div>
                          <div className="percentage">{t('@ 진행', { percentage: `${Math.round((doneCount / totalCount) * 100)}%` })}</div>
                          <div className="remain-count">
                            <div>
                              {doneCount > 0 && (
                                <div
                                  className={`done ${doneCount === totalCount ? 'full' : ''}`}
                                  style={{
                                    width: `${(doneCount / totalCount) * 100}%`,
                                  }}
                                >
                                  <div>{t('@개 테스트 수행', { count: doneCount })}</div>
                                </div>
                              )}
                              {remainCount > 0 && (
                                <div
                                  className={`remain ${remainCount === totalCount ? 'full' : ''}`}
                                  style={{
                                    width: `${(remainCount / totalCount) * 100}%`,
                                  }}
                                >
                                  <div>{t('@개 테스트 남음', { count: remainCount })}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="testcase-list-title">{t('테스트케이스 목록')}</div>
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
                                              to={`/spaces/${spaceCode}/projects/${projectId}/testruns/${testrun.id}?tester=&type=case&testrunTestcaseGroupId=${testcase.testrunTestcaseGroupId}&id=${testcase.testrunTestcaseGroupTestcaseId}`}
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
          </CardContent>
        </Card>
        <Card className="testrun-history">
          <CardHeader className="card-header">
            <div>
              <div className="text">{t('테스트런 히스토리')}</div>
              <div>
                {periods.map(d => {
                  return (
                    <Radio
                      key={d.key}
                      size="sm"
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
              </div>
            </div>
          </CardHeader>
          <CardContent className="testrun-history-content">
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

                        return (
                          <li key={d.id}>
                            <div
                              style={{
                                left: `${((moment(d.startDateTime).valueOf() - start) / totalSpan) * 100}%`,
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
                                  navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns/${d.id}`);
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
          </CardContent>
        </Card>
      </PageContent>
    </Page>
  );
}

ProjectDashBoardPage.defaultProps = {};

ProjectDashBoardPage.propTypes = {};

export default ProjectDashBoardPage;
