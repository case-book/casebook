import React, { useEffect, useState } from 'react';
import { Button, Card, EmptyContent, Liner, Page, PageContent, PageTitle, Radio, Table, Tbody, Td, Th, THead, Title, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import dateUtil from '@/utils/dateUtil';
import ReportService from '@/services/ReportService';
import './ReportListPage.scss';
import ProjectService from '@/services/ProjectService';
import moment from 'moment';

function ReportListPage() {
  const { t } = useTranslation();
  const { spaceCode, projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [testruns, setTestruns] = useState([]);
  const [latestTestruns, setLatestTestruns] = useState([]);

  const [periods] = useState([
    { key: '1', value: t('@개월', { month: 1 }) },
    { key: '3', value: t('@개월', { month: 3 }) },
    { key: '6', value: t('@개월', { month: 6 }) },
    { key: '12', value: t('@개월', { month: 12 }) },
  ]);

  const [period, setPeriod] = useState('1');

  useEffect(() => {
    ReportService.selectLatestReportList(spaceCode, projectId, list => {
      setLatestTestruns(
        list.map(testrun => {
          const data = [];
          const progress = testrun.passedTestcaseCount + testrun.failedTestcaseCount + testrun.untestableTestcaseCount;
          if (progress > 0) {
            data.push({
              id: 'PROGRESS',
              value: progress,
              color: '#ffbc4b',
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

    ReportService.selectReportList(spaceCode, projectId, start.toISOString(), end.toISOString(), list => {
      setTestruns(
        list.map(testrun => {
          const data = [];
          const progress = testrun.passedTestcaseCount + testrun.failedTestcaseCount + testrun.untestableTestcaseCount;
          if (progress > 0) {
            data.push({
              id: 'PROGRESS',
              value: progress,
              color: '#ffbc4b',
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
  }, [spaceCode, projectId, period]);

  return (
    <Page className="report-list-page-wrapper" list>
      <PageTitle
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
            to: `/spaces/${spaceCode}/projects/${projectId}/reports`,
            text: t('리포트'),
          },
        ]}
        onListClick={() => {
          navigate(`/spaces/${spaceCode}/projects`);
        }}
      >
        {t('리포트')}
      </PageTitle>
      <PageContent className="page-content">
        <Title border={false} marginBottom={false}>
          {t('최근 종료된 3개 테스트런')}
        </Title>
        {latestTestruns?.length <= 0 && (
          <EmptyContent className="empty" fill>
            {t('조회된 리포트가 없습니다.')}
          </EmptyContent>
        )}
        {latestTestruns?.length > 0 && (
          <ul className="report-cards">
            {latestTestruns.map(testrun => {
              const passedPercentage = testrun.totalTestcaseCount ? Math.round((testrun.passedTestcaseCount / testrun.totalTestcaseCount) * 1000) / 10 : 0;
              const failedPercentage = testrun.totalTestcaseCount ? Math.round((testrun.failedTestcaseCount / testrun.totalTestcaseCount) * 1000) / 10 : 0;
              const untestablePercentage = testrun.totalTestcaseCount ? Math.round((testrun.untestableTestcaseCount / testrun.totalTestcaseCount) * 1000) / 10 : 0;
              const remainPercentage = testrun.totalTestcaseCount
                ? 100 - Math.round(((testrun.failedTestcaseCount + testrun.passedTestcaseCount + testrun.untestableTestcaseCount) / testrun.totalTestcaseCount) * 1000) / 10
                : 0;

              return (
                <li key={testrun.id}>
                  <Card className="testrun-card" border>
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
                        <Link to={`/spaces/${spaceCode}/projects/${projectId}/reports/${testrun.id}`}>{testrun.name}</Link>
                      </div>
                    </div>
                    <div className="summary-bar">
                      <div
                        className="REMAINS"
                        style={{
                          width: `${testrun.totalTestcaseCount ? remainPercentage : 25}%`,
                        }}
                      >
                        <div className="bg" />
                        <div className="content">
                          <div className="label">
                            <span>{t('미수행')}</span>
                          </div>
                          <div className="percentage">
                            <div>{remainPercentage}%</div>
                          </div>
                          <div className="count-and-total">
                            ({testrun.totalTestcaseCount - testrun.passedTestcaseCount - testrun.failedTestcaseCount - testrun.untestableTestcaseCount}/{testrun.totalTestcaseCount})
                          </div>
                        </div>
                      </div>
                      <div
                        className="PASSED"
                        style={{
                          width: `${testrun.totalTestcaseCount ? passedPercentage : 25}%`,
                        }}
                      >
                        <div className="bg" />
                        <div className="content">
                          <div className="label">
                            <span>{t('성공')}</span>
                          </div>
                          <div className="percentage">
                            <div>{passedPercentage}%</div>
                          </div>
                          <div className="count-and-total">
                            ({testrun.passedTestcaseCount}/{testrun.totalTestcaseCount})
                          </div>
                        </div>
                      </div>
                      <div
                        className="FAILED"
                        style={{
                          width: `${testrun.totalTestcaseCount ? failedPercentage : 25}%`,
                        }}
                      >
                        <div className="bg" />
                        <div className="content">
                          <div className="label">
                            <span>{t('실패')}</span>
                          </div>
                          <div className="percentage">
                            <div>{failedPercentage}%</div>
                          </div>
                          <div className="count-and-total">
                            ({testrun.failedTestcaseCount}/{testrun.totalTestcaseCount})
                          </div>
                        </div>
                      </div>
                      <div
                        className="UNTESTABLE"
                        style={{
                          width: `${testrun.totalTestcaseCount ? untestablePercentage : 25}%`,
                        }}
                      >
                        <div className="bg" />
                        <div className="content">
                          <div className="label">
                            <span>{t('불가능')}</span>
                          </div>
                          <div className="percentage">
                            <div>{untestablePercentage}%</div>
                          </div>
                          <div className="count-and-total">
                            ({testrun.untestableTestcaseCount}/{testrun.totalTestcaseCount})
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="testrun-others">
                      <div className="time-info">
                        <span className="calendar">
                          <i className="fa-regular fa-clock" />
                        </span>
                        <span className="label">{t('테스트 기간')}</span>
                        {testrun.startDateTime && <span>{dateUtil.getDateString(testrun.startDateTime, 'monthsDaysHoursMinutes')}</span>}
                        <div className={`end-date-info ${!testrun.startDateTime ? 'no-start-time' : ''}`}>
                          {(testrun.startDateTime || testrun.closedDate) && <Liner width="6px" height="1px" display="inline-block" margin="0 0.5rem" />}
                          {testrun.startDateTime && testrun.closedDate && <span>{dateUtil.getEndDateString(testrun.startDateTime, testrun.closedDate)}</span>}
                          {!testrun.startDateTime && testrun.closedDate && <span>{dateUtil.getDateString(testrun.closedDate)}</span>}
                        </div>
                      </div>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
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
          {t('테스트런 리포트')}
        </Title>
        {testruns?.length <= 0 && <EmptyContent fill>{t('조회된 리포트가 없습니다.')}</EmptyContent>}
        {testruns?.length > 0 && (
          <div className="testrun-table-content">
            <Table className="testrun-table" cols={['1px', '100%', '1px', '1px', '1px', '1px']}>
              <THead>
                <Tr>
                  <Th align="center">{t('테스트런 ID')}</Th>
                  <Th align="left">{t('이름')}</Th>
                  <Th align="center">{t('수행률')}</Th>
                  <Th align="center">{t('성공률')}</Th>
                  <Th align="center">{t('실패율')}</Th>
                  <Th align="center">{t('테스트 불가')}</Th>
                  <Th align="center">{t('테스트 일시')}</Th>
                  <Th align="center" />
                </Tr>
              </THead>
              <Tbody>
                {testruns?.map(testrun => {
                  const testedCount = testrun.failedTestcaseCount + testrun.passedTestcaseCount + testrun.untestableTestcaseCount;
                  let progressPercentage = 0;
                  let passedPercentage = 0;
                  let failedPercentage = 0;
                  let untestablePercentage = 0;

                  if (testrun.totalTestcaseCount > 0) {
                    progressPercentage = Math.round((testedCount / testrun.totalTestcaseCount) * 1000) / 10;
                    passedPercentage = Math.round((testrun.passedTestcaseCount / testrun.totalTestcaseCount) * 1000) / 10;
                    failedPercentage = Math.round((testrun.failedTestcaseCount / testrun.totalTestcaseCount) * 1000) / 10;
                    untestablePercentage = Math.round((testrun.untestableTestcaseCount / testrun.totalTestcaseCount) * 1000) / 10;
                  }

                  return (
                    <Tr key={testrun.id}>
                      <Td className="testrun-id" align="center">
                        {testrun.seqId}
                      </Td>
                      <Td>
                        <Link to={`/spaces/${spaceCode}/projects/${projectId}/reports/${testrun.id}`}>{testrun.name}</Link>
                      </Td>
                      <Td className="count" align="right">
                        <div>
                          <div>{progressPercentage}%</div>
                          <div className="summary">
                            ({testedCount}/{testrun.totalTestcaseCount})
                          </div>
                        </div>
                      </Td>
                      <Td className="count PASSED" align="right">
                        <div>
                          <div>{passedPercentage}%</div>
                          <div className="summary">
                            ({testrun.passedTestcaseCount}/{testrun.totalTestcaseCount})
                          </div>
                        </div>
                      </Td>
                      <Td className="count FAILED" align="right">
                        <div>
                          <div>{failedPercentage}%</div>

                          <div className="summary">
                            ({testrun.failedTestcaseCount}/{testrun.totalTestcaseCount})
                          </div>
                        </div>
                      </Td>
                      <Td className="count UNTESTABLE" align="right">
                        <div>
                          <div>{untestablePercentage}%</div>
                          <div className="summary">
                            ({testrun.untestableTestcaseCount}/{testrun.totalTestcaseCount})
                          </div>
                        </div>
                      </Td>
                      <Td className="date">
                        {dateUtil.getDateString(testrun.startDateTime)} ~ {dateUtil.getEndDateString(testrun.startDateTime, testrun.closedDate)}
                      </Td>
                      <Td align="center">
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
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </div>
        )}
      </PageContent>
    </Page>
  );
}

export default ReportListPage;
