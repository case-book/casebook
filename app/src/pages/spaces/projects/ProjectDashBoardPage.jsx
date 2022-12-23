import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, EmptyContent, Page, PageContent, PageTitle, PieChart, SeqId } from '@/components';
import { useTranslation } from 'react-i18next';

import TestrunService from '@/services/TestrunService';
import { useParams } from 'react-router';
import './ProjectDashBoardPage.scss';
import { ITEM_TYPE, TESTRUN_RESULT_CODE } from '@/constants/constants';
import { Link, useNavigate } from 'react-router-dom';

function ProjectDashBoardPage() {
  const { t } = useTranslation();
  const { spaceCode, projectId } = useParams();
  const [testruns, setTestruns] = useState([]);
  const [userAssignedTestruns, setUserAssignedTestruns] = useState([]);
  const navigate = useNavigate();

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

  return (
    <Page className="project-overview-info-page-wrapper" list wide>
      <PageTitle>{t('대시보드')}</PageTitle>
      <PageContent flex>
        <Card className="testruning-info">
          <CardHeader className="card-header">{t('진행중인 테스트런')}</CardHeader>
          <CardContent scroll horizontal className={`card-content ${testruns?.length < 1 ? 'empty' : ''}`}>
            {testruns.length < 1 && <EmptyContent className="empty-content">진행중인 테스트런이 없습니다.</EmptyContent>}
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
                        <div className="label">수행율</div>
                        <div className="percentage">{Math.round((doneCount / totalCount) * 100)}%</div>
                        <div className="remain-count">
                          <div>
                            {doneCount > 0 && (
                              <div
                                className={`done ${doneCount === totalCount ? 'full' : ''}`}
                                style={{
                                  width: `${(doneCount / totalCount) * 100}%`,
                                }}
                              >
                                <div>{doneCount}개 테스트 수행</div>
                              </div>
                            )}
                            {remainCount > 0 && (
                              <div
                                className={`remain ${remainCount === totalCount ? 'full' : ''}`}
                                style={{
                                  width: `${(remainCount / totalCount) * 100}%`,
                                }}
                              >
                                <div>{remainCount}개 테스트 남음</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="testcase-list-title">테스트케이스 목록</div>
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
                                        <div className="testcase-name">{testcase.name}</div>
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
          </CardContent>
        </Card>
      </PageContent>
    </Page>
  );
}

ProjectDashBoardPage.defaultProps = {};

ProjectDashBoardPage.propTypes = {};

export default ProjectDashBoardPage;
