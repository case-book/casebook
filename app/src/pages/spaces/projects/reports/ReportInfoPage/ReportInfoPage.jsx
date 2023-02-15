import React, { useEffect, useState } from 'react';
import { Button, Page, PageButtons, PageContent, PageTitle, Table, Tag, Tbody, Text, Th, THead, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import ProjectService from '@/services/ProjectService';
import TestrunService from '@/services/TestrunService';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import dateUtil from '@/utils/dateUtil';
import './ReportInfoPage.scss';
import dialogUtil from '@/utils/dialogUtil';
import testcaseUtil from '@/utils/testcaseUtil';
import ReportGroupItem from '@/pages/spaces/projects/reports/ReportInfoPage/ReportGroupItem';
import useQueryString from '@/hooks/useQueryString';
import TestrunResultViewerPopup from '@/pages/spaces/projects/reports/ReportInfoPage/TestrunResultViewerPopup';

function ReportInfoPage() {
  const { t } = useTranslation();
  const { projectId, spaceCode, reportId } = useParams();

  const navigate = useNavigate();

  const [project, setProject] = useState(null);

  const [testrun, setTestrun] = useState({});

  const [testcaseGroups, setTestcaseGroups] = useState([]);

  const [testerProgressList, setTesterProgressList] = useState([]);

  const { query, setQuery } = useQueryString();

  const { groupId: testrunTestcaseGroupId, id: testrunTestcaseGroupTestcaseId } = query;

  const [popupInfo, setPopupInfo] = useState({
    opened: false,
  });

  useEffect(() => {
    if (testrunTestcaseGroupId && testrunTestcaseGroupTestcaseId) {
      const testrunTestcaseGroup = testrun.testcaseGroups?.find(d => d.id === Number(testrunTestcaseGroupId));

      if (testrunTestcaseGroup) {
        const testrunTestcaseGroupTestcase = testrunTestcaseGroup.testcases.find(d => d.id === Number(testrunTestcaseGroupTestcaseId));
        const testcaseTemplate = project.testcaseTemplates.find(d => d.id === testrunTestcaseGroupTestcase.testcaseTemplateId);

        setPopupInfo({
          opened: true,
          testcaseTemplate,
          testrunTestcaseGroupTestcase,
        });
      }
    } else {
      setPopupInfo({
        opened: false,
      });
    }
  }, [testcaseGroups, testrunTestcaseGroupId, testrunTestcaseGroupTestcaseId]);

  useEffect(() => {
    ProjectService.selectProjectInfo(spaceCode, projectId, info => {
      setProject(info);
      TestrunService.selectTestrunInfo(spaceCode, projectId, reportId, data => {
        setTestrun({ ...data, startTime: dateUtil.getHourMinuteTime(data.startTime), testedCount: data.passedTestcaseCount + data.failedTestcaseCount + data.untestableTestcaseCount });

        const tester = {};

        data.testcaseGroups?.forEach(testcaseGroup => {
          testcaseGroup.testcases?.forEach(testcase => {
            if (!tester[testcase.testerId]) {
              const user = info.users.find(u => u.userId === testcase.testerId);
              tester[testcase.testerId] = {
                name: user?.name,
                PASSED: 0,
                FAILED: 0,
                UNTESTED: 0,
                UNTESTABLE: 0,
                TOTAL_COUNT: 0,
              };
            }

            tester[testcase.testerId][testcase.testResult] += 1;
            tester[testcase.testerId].TOTAL_COUNT += 1;
          });
        });

        const groups = testcaseUtil.getTestcaseTreeData(data.testcaseGroups, 'testcaseGroupId');
        setTestcaseGroups(groups);

        setTesterProgressList(
          Object.values(tester).sort((a, b) => {
            return b.UNTESTED / b.TOTAL_COUNT - a.UNTESTED / a.TOTAL_COUNT;
          }),
        );
      });
    });
  }, [projectId, reportId]);

  const onOpened = () => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('테스트런 오픈'),
      <div>{t('종료된 @ 테스트런을 다시 오픈합니다. 계속하시겠습니까?', { name: testrun.name })}</div>,
      () => {
        TestrunService.updateTestrunStatusOpened(spaceCode, projectId, reportId, () => {
          navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns`);
        });
      },
      null,
      t('재오픈'),
    );
  };

  return (
    <>
      <Page className="report-info-page-wrapper">
        <PageTitle
          control={
            <Button color="warning" onClick={onOpened}>
              {t('테스트런 재오픈')}
            </Button>
          }
          onListClick={() => {
            navigate(`/spaces/${spaceCode}/projects/${projectId}/reports`);
          }}
        >
          &apos;{testrun?.name}&apos; {t('리포트')}
        </PageTitle>
        <PageContent>
          <div className="testrun-info">
            <div className="sub-title">{t('테스트런 정보')}</div>

            <div className="text-summary">
              <span className="range">
                {t('@부터 @까지', {
                  from: dateUtil.getDateString(testrun.startDateTime),
                  to: dateUtil.getDateString(testrun.closedDate),
                })}
              </span>
              {testrun.testrunUsers?.map(d => {
                return (
                  <Tag className="tester" size="sm" key={d.userId} color="white" border>
                    {d.name}
                  </Tag>
                );
              })}
              <span>{t('테스터가 테스트 진행')}</span>
            </div>
            <div className="description">{testrun?.description}</div>
          </div>
          <div className="summary">
            <div className="summary-content report-metric">
              <div className="sub-title">{t('테스트 진행 및 결과')}</div>
              <div className="boxes">
                <div className="summary-box progress">
                  <div
                    className="progress-bar"
                    style={{
                      height: `${(testrun.testedCount / testrun.totalTestcaseCount) * 100}%`,
                    }}
                  />
                  <div className="count-info">
                    <div className="label">
                      <span>{t('수행률')}</span>
                    </div>
                    <div className="progress-percentage">{Math.round((testrun.testedCount / testrun.totalTestcaseCount) * 1000) / 10}%</div>
                    <div className="progress-count">
                      (<span>{testrun.testedCount}</span>/<span>{testrun.totalTestcaseCount}</span>)
                    </div>
                  </div>
                </div>
                <div className="summary-box success">
                  <div
                    className="progress-bar"
                    style={{
                      height: `${(testrun.passedTestcaseCount / testrun.totalTestcaseCount) * 100}%`,
                    }}
                  />
                  <div className="count-info">
                    <div className="label">
                      <span>{t('테스트 성공률')}</span>
                    </div>
                    <div className="progress-percentage">{Math.round((testrun.passedTestcaseCount / testrun.totalTestcaseCount) * 1000) / 10}%</div>
                    <div className="progress-count">
                      (<span>{testrun.passedTestcaseCount}</span>/<span>{testrun.totalTestcaseCount}</span>)
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="summary-content user-metric">
              <div className="sub-title">{t('테스터별 테스트 진행률')}</div>
              <div className="boxes scrollbar-sm">
                {testerProgressList.map(testerProgress => {
                  const testedCount = testerProgress.TOTAL_COUNT - testerProgress.UNTESTED;
                  const totalCount = testerProgress.TOTAL_COUNT;
                  const testedPercentage = Math.round((testedCount / totalCount) * 1000) / 10;

                  return (
                    <div className="summary-box tester" key={testerProgress.name}>
                      <div
                        className="progress-bar"
                        style={{
                          height: `${testedPercentage}%`,
                        }}
                      />
                      <div className="count-info">
                        <div className="label">
                          <span>{testerProgress.name}</span>
                        </div>
                        <div className="progress-percentage">{testedPercentage}%</div>
                        <div className="progress-count">
                          (<span>{testedCount}</span>/<span>{totalCount}</span>)
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="testcase-result">
            <div className="sub-title">{t('테스트케이스 테스트 결과')}</div>
            {testcaseGroups?.length < 1 && <Text className="no-user">{t('선택된 테스트케이스가 없습니다.')}</Text>}
            {testcaseGroups?.length > 0 && (
              <Table size="sm" cols={['1px', '100%']} border>
                <THead>
                  <Tr>
                    <Th align="left">{t('테스트케이스 그룹')}</Th>
                    <Th align="left">{t('테스트케이스')}</Th>
                    <Th align="left">{t('테스터')}</Th>
                    <Th align="center">{t('테스트 결과')}</Th>
                  </Tr>
                </THead>
                <Tbody>
                  {testcaseGroups.map(testcaseGroup => {
                    return (
                      <ReportGroupItem
                        key={testcaseGroup.id}
                        users={project.users}
                        testcaseGroup={testcaseGroup}
                        onNameClick={(groupId, id) => {
                          setQuery({ groupId, id });
                        }}
                      />
                    );
                  })}
                </Tbody>
              </Table>
            )}
          </div>
          <PageButtons
            onList={() => {
              navigate(`/spaces/${spaceCode}/projects/${projectId}/reports`);
            }}
          />
        </PageContent>
      </Page>
      {popupInfo.opened && (
        <TestrunResultViewerPopup
          project={project}
          testcaseTemplate={popupInfo.testcaseTemplate}
          testrunTestcaseGroupTestcase={popupInfo.testrunTestcaseGroupTestcase}
          users={project?.users.map(u => {
            return {
              ...u,
              id: u.userId,
            };
          })}
          setOpened={val => {
            setPopupInfo({
              ...popupInfo,
              opened: val,
            });
            setQuery({ groupId: null, id: null });
          }}
        />
      )}
    </>
  );
}

ReportInfoPage.defaultProps = {};

ReportInfoPage.propTypes = {};

export default ReportInfoPage;
