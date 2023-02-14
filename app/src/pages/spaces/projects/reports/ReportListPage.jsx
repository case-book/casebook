import React, { useEffect, useState } from 'react';
import { Button, Card, Liner, Page, PageContent, PageTitle, PieChart, SeqId, Table, Tag, Tbody, Td, Th, THead, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import dateUtil from '@/utils/dateUtil';
import { ITEM_TYPE } from '@/constants/constants';
import ReportService from '@/services/ReportService';
import './ReportListPage.scss';

function ReportListPage() {
  const { t } = useTranslation();
  const { spaceCode, projectId } = useParams();
  const navigate = useNavigate();
  const [testruns, setTestruns] = useState([]);

  useEffect(() => {
    ReportService.selectReportList(spaceCode, projectId, list => {
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
  }, [spaceCode]);

  return (
    <Page className="report-list-page-wrapper" list>
      <PageTitle
        className="page-title"
        onListClick={() => {
          navigate(`/spaces/${spaceCode}/projects`);
        }}
      >
        {t('리포트')}
      </PageTitle>
      <PageContent className="page-content">
        {testruns?.length <= 0 && (
          <div className="no-project">
            <div>
              <div>{t('조회된 리포트가 없습니다.')}</div>
            </div>
          </div>
        )}

        <ul className="report-cards">
          {testruns.slice(0, 3).map(testrun => {
            const progressPercentage = Math.round(((testrun.failedTestcaseCount + testrun.passedTestcaseCount + testrun.untestableTestcaseCount) / testrun.totalTestcaseCount) * 1000) / 10;
            const passedPercentage = Math.round((testrun.passedTestcaseCount / testrun.totalTestcaseCount) * 1000) / 10;
            const failedPercentage = Math.round((testrun.failedTestcaseCount / testrun.totalTestcaseCount) * 1000) / 10;
            const untestablePercentage = Math.round((testrun.untestableTestcaseCount / testrun.totalTestcaseCount) * 1000) / 10;

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
                    <div className="seq">
                      <SeqId className="seq-id" type={ITEM_TYPE.TESTCASE} copy={false} size="sm">
                        {testrun.seqId}
                      </SeqId>
                    </div>
                    <div className="text">
                      <Link to={`/spaces/${spaceCode}/projects/${projectId}/reports/${testrun.id}`}>{testrun.name}</Link>
                    </div>
                  </div>
                  <div className="summary-bar">
                    <div
                      className="PASSED"
                      style={{
                        width: `${passedPercentage}%`,
                      }}
                    />
                    <div
                      className="FAILED"
                      style={{
                        width: `${failedPercentage}%`,
                      }}
                    />
                    <div
                      className="UNTESTABLE"
                      style={{
                        width: `${untestablePercentage}%`,
                      }}
                    />
                  </div>
                  <div className="description">{testrun.description}</div>
                  <div className="summary">
                    <div className="progress-content">
                      <PieChart
                        data={testrun.data}
                        legend={false}
                        tooltip={false}
                        activeOuterRadiusOffset={0}
                        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                        isInteractive={false}
                        innerRadius={0.7}
                        cornerRadius={0}
                      />
                      <div className="percentage-content">
                        <div className="percentage-info">
                          <span className="percentage">{progressPercentage}</span>
                          <span className="symbol">%</span>
                        </div>
                        <div className="progress-label">{t('수행률')}</div>
                      </div>
                    </div>
                    <div className="result-summary">
                      <div>
                        <div className="label">{t('성공')}</div>
                        <div className="percentage PASSED">
                          <div>{passedPercentage}%</div>
                        </div>
                        <div className="count-and-total">
                          ({testrun.passedTestcaseCount}/{testrun.totalTestcaseCount})
                        </div>
                      </div>
                      <div>
                        <div className="label">{t('실패')}</div>
                        <div className="percentage FAILED">
                          <div>{failedPercentage}%</div>
                        </div>
                        <div className="count-and-total">
                          ({testrun.failedTestcaseCount}/{testrun.totalTestcaseCount})
                        </div>
                      </div>
                      <div>
                        <div className="label">{t('테스트 불가')}</div>
                        <div className="percentage UNTESTABLE">
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
                      {testrun.startDateTime && (
                        <Tag color="white" uppercase>
                          {dateUtil.getDateString(testrun.startDateTime, 'monthsDaysHoursMinutes')}
                        </Tag>
                      )}
                      <div className={`end-date-info ${!testrun.startDateTime ? 'no-start-time' : ''}`}>
                        {(testrun.startDateTime || testrun.closedDate) && <Liner width="6px" height="1px" display="inline-block" margin="0 0.5rem" />}
                        {testrun.startDateTime && testrun.closedDate && (
                          <Tag color="white" uppercase>
                            {dateUtil.getEndDateString(testrun.startDateTime, testrun.closedDate)}
                          </Tag>
                        )}
                        {!testrun.startDateTime && testrun.closedDate && (
                          <Tag color="white" uppercase>
                            {dateUtil.getDateString(testrun.closedDate)}
                          </Tag>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
        <div className="testrun-table-content">
          <Table className="testrun-table" cols={['1px', '100%', '1px', '1px', '1px', '1px']}>
            <THead>
              <Tr>
                <Th align="center">{t('테스트런 ID')}</Th>
                <Th align="left">{t('이름')}</Th>
                <Th align="center">{t('수행률')}</Th>
                <Th align="center">{t('성공')}</Th>
                <Th align="center">{t('실패')}</Th>
                <Th align="center">{t('테스트 불가')}</Th>
                <Th align="center">{t('테스트 시작일시')}</Th>
                <Th align="center">{t('테스트 종료일시')}</Th>
              </Tr>
            </THead>
            <Tbody>
              {testruns?.map(testrun => {
                const testedCount = testrun.failedTestcaseCount + testrun.passedTestcaseCount + testrun.untestableTestcaseCount;
                const progressPercentage = Math.round((testedCount / testrun.totalTestcaseCount) * 1000) / 10;
                const passedPercentage = Math.round((testrun.passedTestcaseCount / testrun.totalTestcaseCount) * 1000) / 10;
                const failedPercentage = Math.round((testrun.failedTestcaseCount / testrun.totalTestcaseCount) * 1000) / 10;
                const untestablePercentage = Math.round((testrun.untestableTestcaseCount / testrun.totalTestcaseCount) * 1000) / 10;

                return (
                  <Tr key={testrun.id}>
                    <Td align="center">
                      <SeqId type={ITEM_TYPE.TESTCASE_GROUP} copy={false}>
                        {testrun.seqId}
                      </SeqId>
                    </Td>
                    <Td bold>
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
                    <Td className="date" align="center">
                      {dateUtil.getDateString(testrun.startDateTime)}
                    </Td>
                    <Td className="date" align="center">
                      {dateUtil.getEndDateString(testrun.startDateTime, testrun.closedDate)}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </div>
      </PageContent>
    </Page>
  );
}

export default ReportListPage;
