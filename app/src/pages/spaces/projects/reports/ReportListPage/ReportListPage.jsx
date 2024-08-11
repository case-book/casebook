import React, { useEffect, useState } from 'react';
import { Button, EmptyContent, Liner, Page, PageContent, PageTitle, Radio, Tag, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import dateUtil from '@/utils/dateUtil';
import ReportService from '@/services/ReportService';
import ProjectService from '@/services/ProjectService';
import moment from 'moment';
import './ReportListPage.scss';
import classNames from 'classnames';
import ReportReOpenPopup from '@/pages/spaces/projects/reports/ReportListPage/ReportReOpenPopup/ReportReOpenPopup';
import TestrunService from '@/services/TestrunService';
import dialogUtil from '@/utils/dialogUtil';
import { MESSAGE_CATEGORY } from '@/constants/constants';

function ReportListPage() {
  const { t } = useTranslation();
  const { spaceCode, projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [testruns, setTestruns] = useState([]);
  const [reportReOpenPopupInfo, setReportReOpenPopupInfo] = useState(null);

  const [periods] = useState([
    { key: '1', value: t('@개월', { month: 1 }) },
    { key: '3', value: t('@개월', { month: 3 }) },
    { key: '6', value: t('@개월', { month: 6 }) },
    { key: '12', value: t('@개월', { month: 12 }) },
  ]);

  const [period, setPeriod] = useState('1');

  useEffect(() => {
    ProjectService.selectProjectName(spaceCode, projectId, info => {
      setProject(info);
    });
  }, [spaceCode, projectId]);

  const selectReportList = () => {
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

          const tags = [];

          const testedCount = testrun.failedTestcaseCount + testrun.passedTestcaseCount + testrun.untestableTestcaseCount;
          const notTestedCount = testrun.totalTestcaseCount - testedCount;
          let progressPercentage = 0;
          let passedPercentage = 0;
          let failedPercentage = 0;
          let untestablePercentage = 0;
          let notTestedPercentage = 0;

          if (testrun.totalTestcaseCount > 0) {
            progressPercentage = Math.round((testedCount / testrun.totalTestcaseCount) * 1000) / 10;
            passedPercentage = Math.round((testrun.passedTestcaseCount / testrun.totalTestcaseCount) * 1000) / 10;
            failedPercentage = Math.round((testrun.failedTestcaseCount / testrun.totalTestcaseCount) * 1000) / 10;
            untestablePercentage = Math.round((testrun.untestableTestcaseCount / testrun.totalTestcaseCount) * 1000) / 10;
            notTestedPercentage = Math.round((notTestedCount / testrun.totalTestcaseCount) * 1000) / 10;

            if (testrun.totalTestcaseCount === testedCount) {
              tags.push('COMPLETE');
            }

            if (testrun.totalTestcaseCount === testrun.passedTestcaseCount) {
              tags.push('ALL-PASSED');
            } else {
              tags.push('FAILED');
            }
          }

          return {
            ...testrun,
            testedCount,
            progressPercentage,
            passedPercentage,
            failedPercentage,
            untestablePercentage,
            notTestedCount,
            notTestedPercentage,
            tags,
            data,
          };
        }),
      );
    });
  };

  useEffect(() => {
    selectReportList();
  }, [spaceCode, projectId, period]);

  const onReopen = option => {
    TestrunService.reopenProjectTestrunInfo(spaceCode, projectId, reportReOpenPopupInfo.testrun.id, option, () => {
      selectReportList();
      if (option.testrunReopenCreationType === 'REOPEN') {
        dialogUtil.setMessage(MESSAGE_CATEGORY.INFO, t('테스트런 생성 완료'), t('테스트런이 다시 시작되었습니다.'));
      } else {
        dialogUtil.setMessage(MESSAGE_CATEGORY.INFO, t('테스트런 생성 완료'), t('테스트런이 생성되었습니다.'));
      }
    });
  };

  return (
    <>
      <Page className="report-list-page-wrapper">
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
        <PageContent className="page-content" flex>
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
            {t('리포트')}
          </Title>
          {testruns?.length <= 0 && (
            <EmptyContent fill border>
              {t('조회된 리포트가 없습니다.')}
            </EmptyContent>
          )}
          {testruns?.length > 0 && (
            <ul className="report-list">
              {testruns?.map(testrun => {
                return (
                  <li key={testrun.id}>
                    <div className="title">
                      <div className="name">
                        <Link className="hoverable" to={`/spaces/${spaceCode}/projects/${projectId}/reports/${testrun.id}`}>
                          {testrun.name}
                        </Link>
                      </div>
                      {testrun.tags?.length > 0 && (
                        <div className="tags-content">
                          <Liner width="1px" height="10px" display="inline-block" color="gray" margin="0 10px" />
                          <div className="tags">
                            {testrun.tags.map(tag => {
                              return (
                                <Tag rounded key={tag} className={`tag ${tag}`}>
                                  {tag}
                                </Tag>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      <div className="testrun-others">
                        <div className="time-info">
                          <div className="calendar">
                            <i className="fa-regular fa-clock" />
                          </div>
                          {testrun.startDateTime && <div>{dateUtil.getDateString(testrun.startDateTime, 'monthsDaysHoursMinutes')}</div>}
                          <div className={`end-date-info ${!testrun.startDateTime ? 'no-start-time' : ''}`}>
                            {(testrun.startDateTime || testrun.closedDate || testrun.endDateTime) && <Liner width="6px" height="1px" display="inline-block" margin="0 0.5rem" />}
                            {testrun.startDateTime && (testrun.closedDate || testrun.endDateTime) && (
                              <span>{dateUtil.getEndDateString(testrun.startDateTime, testrun.closedDate || testrun.endDateTime)}</span>
                            )}
                            {!testrun.startDateTime && (testrun.closedDate || testrun.endDateTime) && <span>{dateUtil.getDateString(testrun.closedDate || testrun.endDateTime)}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="summary">
                      <div className="testrun-id">
                        <span>{testrun.seqId}</span>
                      </div>
                      <div className="count-summary">
                        <div className="count">
                          <div className="label">{t('진행')}</div>
                          <div>
                            {testrun.progressPercentage}% ({testrun.testedCount}/{testrun.totalTestcaseCount})
                          </div>
                        </div>
                        {testrun.passedTestcaseCount > 0 && (
                          <>
                            <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 0.5rem" />
                            <div className={classNames('count', { success: testrun.passedPercentage > 0 })}>
                              <div className="label">{t('성공')}</div>
                              <div>
                                {testrun.passedPercentage}% ({testrun.passedTestcaseCount}/{testrun.totalTestcaseCount})
                              </div>
                            </div>
                          </>
                        )}
                        {testrun.failedTestcaseCount > 0 && (
                          <>
                            <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 0.5rem" />
                            <div className={classNames('count', { danger: testrun.failedPercentage > 0 })}>
                              <div className="label">{t('실패')}</div>
                              <div>
                                {testrun.failedPercentage}% ({testrun.failedTestcaseCount}/{testrun.totalTestcaseCount})
                              </div>
                            </div>
                          </>
                        )}
                        {testrun.untestableTestcaseCount > 0 && (
                          <>
                            <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 0.5rem" />
                            <div className={classNames('count', { warning: testrun.untestablePercentage > 0 })}>
                              <div className="label">{t('테스트 불가')}</div>
                              <div>
                                {testrun.untestablePercentage}% ({testrun.untestableTestcaseCount}/{testrun.totalTestcaseCount})
                              </div>
                            </div>
                          </>
                        )}
                        {testrun.notTestedCount > 0 && (
                          <>
                            <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 0.5rem" />
                            <div className={classNames('count', { warning: testrun.notTestedPercentage > 0 })}>
                              <div className="label">{t('미수행')}</div>
                              <div>
                                {testrun.notTestedPercentage}% ({testrun.notTestedCount}/{testrun.totalTestcaseCount})
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="control">
                        <Button
                          tip={t('테스트런 재오픈')}
                          onClick={() => {
                            setReportReOpenPopupInfo({
                              testrun,
                            });
                          }}
                        >
                          <i className="fa-solid fa-repeat" />
                          <i className="fa-solid fa-scale-unbalanced-flip" />
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </PageContent>
      </Page>
      {reportReOpenPopupInfo && (
        <ReportReOpenPopup
          testrun={reportReOpenPopupInfo.testrun}
          setOpened={() => {
            setReportReOpenPopupInfo(null);
          }}
          onApply={onReopen}
        />
      )}
    </>
  );
}

export default ReportListPage;
