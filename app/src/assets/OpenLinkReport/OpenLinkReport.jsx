import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { Block, Info, Table, Tbody, Th, THead, Title, Tr } from '@/components';
import OpenLinkTestcaseGroupItem from '@/assets/OpenLinkReport/OpenLinkTestcaseGroupItem';
import OpenLinkService from '@/services/OpenLinkService';
import testcaseUtil from '@/utils/testcaseUtil';
import './OpenLinkReport.scss';
import { ReportCountSummary } from '@/assets';
import dateUtil from '@/utils/dateUtil';

function OpenLinkReport({ className, token }) {
  const { t } = useTranslation();

  const [openLink, setOpenLink] = useState(null);
  const [userById, setUserById] = useState({});
  const [selectedItemInfo, setSelectedItemInfo] = useState({});

  useEffect(() => {
    OpenLinkService.selectOpenLinkInfoByToken(token, info => {
      setOpenLink(info);
      setUserById(
        info.users.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {}),
      );
    });
  }, [token]);

  console.log(selectedItemInfo);

  const report = useMemo(() => {
    if (!openLink) {
      return null;
    }
    const testruns = openLink.testruns.sort((a, b) => a.id - b.id);
    const testcaseGroupsById = {};

    const testrunCount = testruns.length;

    let minStartDate = null;
    let maxCloseDate = null;
    const testerById = {};

    testruns.forEach((testrun, inx) => {
      if (testrun.startDateTime) {
        if (minStartDate === null || moment(testrun.startDateTime).isBefore(minStartDate)) {
          minStartDate = moment(testrun.startDateTime);
        }
      }

      if (testrun.endDateTime) {
        if (maxCloseDate === null || moment(testrun.endDateTime).isAfter(maxCloseDate)) {
          maxCloseDate = moment(testrun.endDateTime);
        }
      }

      testrun.testcaseGroups.forEach(testcaseGroup => {
        if (!testcaseGroupsById[testcaseGroup.testcaseGroupId]) {
          testcaseGroupsById[testcaseGroup.testcaseGroupId] = {
            ...testcaseGroup,
            testcaseById: {},
          };
        }

        testcaseGroup.testcases?.forEach(testcase => {
          testerById[testcase.testerId] = true;
          if (!testcaseGroupsById[testcaseGroup.testcaseGroupId].testcaseById[testcase.testcaseId]) {
            testcaseGroupsById[testcaseGroup.testcaseGroupId].testcaseById[testcase.testcaseId] = {
              ...testcase,
              testResults: Array(testrunCount).fill(''),
            };
          }

          testcaseGroupsById[testcaseGroup.testcaseGroupId].testcaseById[testcase.testcaseId].testResults[inx] = testcase.testResult;
          if (testcase.testResult !== 'UNTESTED') {
            testcaseGroupsById[testcaseGroup.testcaseGroupId].testcaseById[testcase.testcaseId].testResult = testcase.testResult;
          }
        });
      });
    });

    const mergedTestcaseGroups = Object.values(testcaseGroupsById)
      .sort((a, b) => a.itemOrder - b.itemOrder)
      .map(testcaseGroup => {
        return {
          ...testcaseGroup,
          testcases: Object.values(testcaseGroup.testcaseById).sort((a, b) => a.itemOrder - b.itemOrder),
        };
      });

    const info = {
      ...openLink,
    };

    if (mergedTestcaseGroups) {
      let passedTestcaseHasCommentCount = 0;
      let failedTestcaseHasCommentCount = 0;
      let untestableTestcaseHasCommentCount = 0;
      let totalTestcaseHasCommentCount = 0;
      let untestedTestcaseHasCommentCount = 0;

      let totalTestcaseCount = 0;
      let passedTestcaseCount = 0;
      let failedTestcaseCount = 0;
      let untestableTestcaseCount = 0;

      mergedTestcaseGroups.forEach(group => {
        if (group.testcases) {
          group.testcases.forEach(testcase => {
            totalTestcaseCount += 1;
            if (testcase.testResult === 'PASSED') {
              passedTestcaseCount += 1;
            }

            if (testcase.testResult === 'FAILED') {
              failedTestcaseCount += 1;
            }

            if (testcase.testResult === 'UNTESTABLE') {
              untestableTestcaseCount += 1;
            }

            if (testcase.testResult === 'PASSED' && testcase.comments?.length > 0) {
              passedTestcaseHasCommentCount += 1;
            }

            if (testcase.testResult === 'FAILED' && testcase.comments?.length > 0) {
              failedTestcaseHasCommentCount += 1;
            }

            if (testcase.testResult === 'UNTESTABLE' && testcase.comments?.length > 0) {
              untestableTestcaseHasCommentCount += 1;
            }

            if (testcase.testResult === 'UNTESTED' && testcase.comments?.length > 0) {
              untestedTestcaseHasCommentCount += 1;
            }

            if (testcase.comments?.length > 0) {
              totalTestcaseHasCommentCount += 1;
            }
          });
        }
      });

      info.failedTestcaseHasCommentCount = failedTestcaseHasCommentCount;
      info.passedTestcaseHasCommentCount = passedTestcaseHasCommentCount;
      info.untestableTestcaseHasCommentCount = untestableTestcaseHasCommentCount;
      info.totalTestcaseHasCommentCount = totalTestcaseHasCommentCount;
      info.untestedTestcaseHasCommentCount = untestedTestcaseHasCommentCount;
      info.testedCount = passedTestcaseCount + failedTestcaseCount + untestableTestcaseCount;
      info.totalTestcaseCount = totalTestcaseCount;
      info.passedTestcaseCount = passedTestcaseCount;
      info.failedTestcaseCount = failedTestcaseCount;
      info.untestableTestcaseCount = untestableTestcaseCount;
    }

    info.mergedTestcaseGroups = testcaseUtil.getTestcaseTreeData(mergedTestcaseGroups, 'testcaseGroupId');
    info.minStartDate = minStartDate;
    info.maxCloseDate = maxCloseDate;
    info.testerCount = Object.keys(testerById).length;

    return info;
  }, [openLink]);

  const testrunCount = useMemo(() => {
    return report?.testruns.length;
  }, [report]);

  const testrunHeader = useMemo(() => {
    const headers = [];
    for (let i = 0; i < testrunCount; i += 1) {
      headers.push(`${i + 1}차`);
    }

    return headers;
  }, [report]);

  console.log(report);
  console.log(testrunCount);

  const onClickTestResultCount = (status, hasComment, e) => {
    if (e) {
      e.preventDefault();
    }
  };

  return (
    <div className={`open-link-report-wrapper ${className}`}>
      {report && (
        <>
          <Title border={false} marginBottom={false}>
            {t('테스트 결과 요약')}
          </Title>
          <Block>
            <Info className="summary" rounded={false}>
              {t('@부터 @까지 총 @회 동안 @명의 테스터가 테스트를 진행하였습니다.', {
                start: dateUtil.getDateString(report.minStartDate),
                end: dateUtil.getDateString(report.maxCloseDate),
                count: testrunCount,
                people: report.testerCount,
              })}
            </Info>
            <ReportCountSummary info={report} onCardClick={onClickTestResultCount} />
          </Block>
          <Title className="test-result-title" border={false} marginBottom={false}>
            {t('테스트 결과')}
          </Title>
          <Block className="testcase-list" border scroll>
            <Table className="table" cols={['100px', '100%', '1px']} sticcd apky>
              <THead>
                <Tr>
                  <Th className="testcase-group" rowSpan={2} align="left">
                    {t('테스트케이스 그룹')}
                  </Th>
                  <Th rowSpan={2} align="left">
                    {t('테스트케이스')}
                  </Th>
                  <Th rowSpan={2} align="left">
                    {t('최종 테스터')}
                  </Th>
                  <Th rowSpan={2} align="left">
                    {t('최종 테스트 결과')}
                  </Th>
                  {testrunCount > 0 && (
                    <Th colSpan={testrunCount} align="center">
                      {t('테스트 진행')}
                    </Th>
                  )}
                </Tr>
                <Tr>
                  {testrunHeader.map(d => {
                    return <Th align="center">{d}</Th>;
                  })}
                </Tr>
              </THead>
              <Tbody>
                {report.mergedTestcaseGroups.map(testcaseGroup => {
                  return (
                    <OpenLinkTestcaseGroupItem
                      testrunCount={testrunCount}
                      key={testcaseGroup.id}
                      testcaseGroup={testcaseGroup}
                      userById={userById}
                      onNameClick={(groupId, id) => {
                        setSelectedItemInfo({ groupId, id });
                      }}
                    />
                  );
                })}
              </Tbody>
            </Table>
          </Block>
        </>
      )}
    </div>
  );
}

OpenLinkReport.defaultProps = {
  className: '',
};

OpenLinkReport.propTypes = {
  className: PropTypes.string,
  token: PropTypes.string.isRequired,
};

export default OpenLinkReport;
