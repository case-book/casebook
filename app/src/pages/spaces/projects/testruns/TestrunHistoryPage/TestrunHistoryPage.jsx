import React, { useEffect, useState } from 'react';
import { EmptyContent, Page, PageContent, PageTitle, Radio, Tag, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import TestrunService from '@/services/TestrunService';
import { useParams } from 'react-router';
import { DATE_FORMATS_TYPES } from '@/constants/constants';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import dateUtil from '@/utils/dateUtil';
import ReactTooltip from 'react-tooltip';
import ProjectService from '@/services/ProjectService';
import './TestrunHistoryPage.scss';

function TestrunHistoryPage() {
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
  const [testrunHistories, setTestrunHistories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [testrunHistories]);

  useEffect(() => {
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
    <Page className="testrun-history-page-wrapper">
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
            to: `/spaces/${spaceCode}/projects/${projectId}/testruns/history`,
            text: t('테스트런 히스토리'),
          },
        ]}
        onListClick={() => {
          navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns`);
        }}
      >
        {t('테스트런 히스토리')}
      </PageTitle>
      <PageContent flex>
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
          <div className="chart-content">
            <div>
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
                      const passedPercentage = d.passedTestcaseCount === 0 ? 0 : (d.passedTestcaseCount / d.totalTestcaseCount) * 100;
                      const failedPercentage = d.failedTestcaseCount === 0 ? 0 : (d.failedTestcaseCount / d.totalTestcaseCount) * 100;
                      const untestablePercentage =
                        d.totalTestcaseCount - d.passedTestcaseCount - d.failedTestcaseCount === 0
                          ? 0
                          : ((d.totalTestcaseCount - d.passedTestcaseCount - d.failedTestcaseCount) / d.totalTestcaseCount) * 100;
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
                              {passedPercentage > 0 && (
                                <div
                                  className="passed"
                                  style={{
                                    width: `${passedPercentage}%`,
                                  }}
                                />
                              )}
                              {failedPercentage > 0 && (
                                <div
                                  className="failed"
                                  style={{
                                    width: `${failedPercentage}%`,
                                  }}
                                />
                              )}
                              {untestablePercentage > 0 && (
                                <div
                                  className="untestable"
                                  style={{
                                    width: `${untestablePercentage}%`,
                                  }}
                                />
                              )}
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
              <Tag border>{dateUtil.getDateString(periodRange.start, DATE_FORMATS_TYPES.yearsDays)}</Tag>
            </div>
            <div className="range">
              <Tag border>{dateUtil.getDateString(periodRange.end, DATE_FORMATS_TYPES.yearsDays)}</Tag>
            </div>
          </div>
        </div>
      </PageContent>
    </Page>
  );
}

TestrunHistoryPage.defaultProps = {};

TestrunHistoryPage.propTypes = {};

export default TestrunHistoryPage;
