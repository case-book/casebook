import React, { useEffect, useMemo, useState } from 'react';
import {
  Block,
  Button,
  CheckBox,
  CloseIcon,
  DateRange,
  Form,
  Input,
  Label,
  Liner,
  Page,
  PageButtons,
  PageContent,
  PageTitle,
  Table,
  Tbody,
  Td,
  Text,
  TextArea,
  Th,
  THead,
  Title,
  Tr,
} from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import BlockRow from '@/components/BlockRow/BlockRow';
import ProjectService from '@/services/ProjectService';
import useStores from '@/hooks/useStores';
import ProjectUserSelectPopup from '@/pages/spaces/projects/testruns/ProjectUserSelectPopup';
import TestcaseSelectPopup from '@/pages/spaces/projects/testruns/TestcaseSelectPopup/TestcaseSelectPopup';
import TestrunService from '@/services/TestrunService';
import dialogUtil from '@/utils/dialogUtil';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import dateUtil from '@/utils/dateUtil';
import JiraSprintSelectPopup from '@/pages/spaces/projects/testruns/JiraSprintSelectPopup/JiraSprintSelectPopup';
import testcaseUtil from '@/utils/testcaseUtil';
import './TestrunEditPage.scss';

const labelMinWidth = '120px';

function TestrunEditPage({ type }) {
  const { t } = useTranslation();
  const { projectId, spaceCode, testrunId } = useParams();

  const {
    userStore: { user },
  } = useStores();

  const navigate = useNavigate();

  const [projectUserSelectPopupOpened, setProjectUserSelectPopupOpened] = useState(false);

  const [testcaseSelectPopupOpened, setTestcaseSelectPopupOpened] = useState(false);

  const [project, setProject] = useState(null);

  const [jiraSprintSelectPopupOpened, setJiraSprintSelectPopupOpened] = useState(false);

  const [testrun, setTestrun] = useState({
    seqId: '',
    name: '',
    description: '',
    testrunUsers: [],
    testcaseGroups: [],
    startDateTime: (() => {
      const start = new Date();
      start.setHours(10);
      start.setMinutes(0);
      start.setSeconds(0);
      start.setMilliseconds(0);

      return start.getTime();
    })(),
    endDateTime: (() => {
      const end = new Date();
      end.setDate(end.getDate() + 2);
      end.setHours(19);
      end.setMinutes(0);
      end.setSeconds(0);
      end.setMilliseconds(0);

      return end.getTime();
    })(),
    opened: false,
    totalTestcaseCount: true,
    passedTestcaseCount: true,
    failedTestcaseCount: true,
    days: '1111100',
    excludeHoliday: false,
    startTime: (() => {
      const startTime = new Date();
      startTime.setHours(9);
      startTime.setMinutes(0);
      return startTime.getTime();
    })(),
    durationHours: 24,
    deadlineClose: true,
  });

  const [selectedTestcaseGroupSummary, setSelectedTestcaseGroupSummary] = useState([]);

  const isEdit = useMemo(() => {
    return type === 'edit';
  }, [type]);

  const selectAllUser = () => {
    const nextTestrun = {
      ...testrun,
      testrunUsers: project.users?.map(d => {
        return { userId: d.userId, email: d.email, name: d.name };
      }),
    };
    setTestrun(nextTestrun);
  };

  const selectAllTestcase = () => {
    const initSelectedGroups = project.testcaseGroups?.map(d => {
      return {
        testcaseGroupId: d.id,
        testcases: d.testcases?.map(item => {
          return {
            testcaseId: item.id,
          };
        }),
      };
    });

    const nextTestrun = {
      ...testrun,
      testcaseGroups: initSelectedGroups,
    };
    setTestrun(nextTestrun);
    setSelectedTestcaseGroupSummary(testcaseUtil.getSelectedTestcaseGroupSummary(initSelectedGroups, project.testcaseGroups));
  };

  useEffect(() => {
    ProjectService.selectProjectInfo(spaceCode, projectId, info => {
      setProject(info);
      if (!isEdit) {
        const initSelectedGroups = info.testcaseGroups?.map(d => {
          return {
            testcaseGroupId: d.id,
            testcases: d.testcases?.map(item => {
              return {
                testcaseId: item.id,
              };
            }),
          };
        });

        setTestrun({
          ...testrun,
          testrunUsers: info.users?.map(d => {
            return { userId: d.userId, email: d.email, name: d.name };
          }),
          testcaseGroups: initSelectedGroups,
        });

        setSelectedTestcaseGroupSummary(testcaseUtil.getSelectedTestcaseGroupSummary(initSelectedGroups, info.testcaseGroups));
      } else {
        TestrunService.selectTestrunInfo(spaceCode, projectId, testrunId, data => {
          setTestrun({
            ...data,
            startTime: dateUtil.getHourMinuteTime(data.startTime),
            startDateTime: dateUtil.getTime(data.startDateTime),
            endDateTime: dateUtil.getTime(data.endDateTime),
          });
          setSelectedTestcaseGroupSummary(testcaseUtil.getSelectedTestcaseGroupSummary(data.testcaseGroups, info.testcaseGroups));
        });
      }
    });
  }, [type, projectId, testrunId]);

  const onSubmit = e => {
    e.preventDefault();

    if (testrun.startDateTime && testrun.endDateTime && testrun.startDateTime > testrun.endDateTime) {
      dialogUtil.setMessage(MESSAGE_CATEGORY.WARNING, t('테스트 기간 오류'), t('테스트 종료 일시가 테스트 시작 일시보다 빠릅니다.'));
      return;
    }

    if (!testrun.testcaseGroups || testrun.testcaseGroups?.length < 1) {
      dialogUtil.setMessage(MESSAGE_CATEGORY.WARNING, t('테스트케이스 없음'), t('테스트런에 포함된 테스트케이스가 없습니다.'));
      return;
    }

    if (isEdit) {
      TestrunService.updateProjectTestrunInfo(
        spaceCode,
        projectId,
        {
          ...testrun,
          projectId,
          startDateTime: testrun.startDateTime ? new Date(testrun.startDateTime)?.toISOString() : null,
          endDateTime: testrun.endDateTime ? new Date(testrun.endDateTime)?.toISOString() : null,
          startTime: testrun.startTime ? new Date(testrun.startTime)?.toISOString() : null,
        },
        () => {
          navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns`);
        },
      );
    } else {
      TestrunService.createProjectTestrunInfo(
        spaceCode,
        projectId,
        {
          ...testrun,
          projectId,
          // startDateTime: testrun.startDateTime ? moment(testrun.startDateTime).format('YYYY-MM-DDTHH:mm:ss') : null,
          // endDateTime: testrun.endDateTime ? moment(testrun.endDateTime).format('YYYY-MM-DDTHH:mm:ss') : null,
          startDateTime: testrun.startDateTime ? new Date(testrun.startDateTime)?.toISOString() : null,
          endDateTime: testrun.endDateTime ? new Date(testrun.endDateTime)?.toISOString() : null,
          startTime: testrun.startTime ? new Date(testrun.startTime)?.toISOString() : null,
        },
        () => {
          navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns`);
        },
      );
    }
  };

  const onChangeTestrun = (key, value) => {
    setTestrun({
      ...testrun,
      [key]: value,
    });
  };

  const removeTestrunUser = userId => {
    const nextTestrunUsers = testrun.testrunUsers.slice(0);
    const nextIndex = nextTestrunUsers.findIndex(d => d.userId === userId);
    if (nextIndex > -1) {
      nextTestrunUsers.splice(nextIndex, 1);
      onChangeTestrun('testrunUsers', nextTestrunUsers);
    }
  };

  const resetRange = () => {
    setTestrun({
      ...testrun,
      startDateTime: null,
      endDateTime: null,
    });
  };

  return (
    <>
      <Page className="testrun-edit-page-wrapper">
        <PageTitle
          name={isEdit ? t('테스트런 편집') : t('테스트런 생성')}
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
              text: t('테스트런 목록'),
            },
            {
              to: isEdit ? `/spaces/${spaceCode}/projects/${projectId}/testruns/${testrunId}/edit` : `/spaces/${spaceCode}/projects/${projectId}/testruns/new`,
              text: isEdit ? t('편집') : t('생성'),
            },
          ]}
          onListClick={() => {
            navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns`);
          }}
        >
          {type === 'edit' ? t('테스트런') : t('새 테스트런')}
        </PageTitle>
        <PageContent>
          <Form onSubmit={onSubmit}>
            <Title border={false} marginBottom={false}>
              {t('테스트런 정보')}
            </Title>
            <Block>
              <BlockRow>
                <Label minWidth={labelMinWidth}>{t('프로젝트')}</Label>
                <Text>{project?.name}</Text>
              </BlockRow>
              <BlockRow>
                <Label minWidth={labelMinWidth} required>
                  {t('이름')}
                </Label>
                <Input
                  value={testrun.name}
                  onChange={val =>
                    setTestrun({
                      ...testrun,
                      name: val,
                    })
                  }
                  required
                  minLength={1}
                />
              </BlockRow>
              <BlockRow>
                <Label minWidth={labelMinWidth}>{t('설명')}</Label>
                <TextArea
                  value={testrun.description || ''}
                  rows={4}
                  onChange={val => {
                    setTestrun({
                      ...testrun,
                      description: val,
                    });
                  }}
                />
              </BlockRow>

              <BlockRow className="testrun-range-type-row">
                <Label minWidth={labelMinWidth} required>
                  {t('테스트 기간')}
                </Label>
                <DateRange
                  country={user.country}
                  language={user.language}
                  startDate={testrun.startDateTime}
                  endDate={testrun.endDateTime}
                  startDateKey="startDateTime"
                  endDateKey="endDateTime"
                  onChange={(key, value) => {
                    setTestrun({
                      ...testrun,
                      [key]: value,
                    });
                  }}
                />
                <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 1rem" />
                <Link
                  to="/"
                  onClick={e => {
                    e.preventDefault();
                    resetRange();
                  }}
                >
                  {t('기간 없음')}
                </Link>
              </BlockRow>
              <BlockRow>
                <Label minWidth={labelMinWidth} tip={t('테스트 종료 기간이 지나면, 모든 테스트가 완료되지 않은 상태라도 테스트를 종료 처리합니다.')}>
                  {t('자동 종료')}
                </Label>
                <CheckBox
                  size="sm"
                  type="checkbox"
                  value={testrun.deadlineClose}
                  onChange={val =>
                    setTestrun({
                      ...testrun,
                      deadlineClose: val,
                    })
                  }
                />
              </BlockRow>
              <BlockRow className="testrun-users-type-row">
                <Label minWidth={labelMinWidth}>{t('테스터')}</Label>
                <Text>
                  <Link
                    to="/"
                    onClick={e => {
                      e.preventDefault();
                      setProjectUserSelectPopupOpened(true);
                    }}
                  >
                    {t('테스터 선택')}
                  </Link>
                  <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 0.5rem 0 1rem" />
                  <Button
                    outline
                    size="sm"
                    onClick={() => {
                      selectAllUser();
                    }}
                  >
                    {t('모든 사용자 추가')}
                  </Button>
                </Text>
              </BlockRow>
              <BlockRow>
                <Label minWidth={labelMinWidth} />
                {testrun.testrunUsers?.length < 1 && <Text className="no-user">{t('선택된 사용자가 없습니다.')}</Text>}
                {testrun.testrunUsers?.length > 0 && (
                  <ul className="testrun-users g-no-select">
                    {testrun.testrunUsers?.map(d => {
                      return (
                        <li key={d.userId}>
                          <div>{d.name}</div>
                          <div>
                            <CloseIcon
                              onClick={() => {
                                removeTestrunUser(d.userId);
                              }}
                              size="xs"
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </BlockRow>
              <BlockRow className="testrun-selection-type-row">
                <Label minWidth={labelMinWidth}>{t('테스트케이스')}</Label>
                <Text>
                  <Link
                    to="/"
                    onClick={e => {
                      e.preventDefault();
                      setTestcaseSelectPopupOpened(true);
                    }}
                  >
                    {t('테스트케이스 선택')}
                  </Link>
                  <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 0.5rem 0 1rem" />
                  <Button
                    outline
                    size="sm"
                    onClick={() => {
                      selectAllTestcase();
                    }}
                  >
                    {t('모든 테스트케이스 추가')}
                  </Button>
                </Text>
              </BlockRow>
              <BlockRow>
                <Label minWidth={labelMinWidth} />
                {selectedTestcaseGroupSummary?.length < 1 && <Text className="no-user">{t('선택된 테스트케이스가 없습니다.')}</Text>}
                {selectedTestcaseGroupSummary?.length > 0 && (
                  <Block className="summary-list" scroll maxHeight="600px" border>
                    <Table cols={['', '200px', '100px']} sticky>
                      <THead>
                        <Tr>
                          <Th align="left">{t('테스트케이스 그룹')}</Th>
                          <Th align="right">{t('선택 테스트케이스')}</Th>
                          <Th />
                        </Tr>
                      </THead>
                      <Tbody>
                        {selectedTestcaseGroupSummary.map(summary => {
                          return (
                            <Tr key={summary.testcaseGroupId}>
                              <Td>{summary.name}</Td>
                              <Td align="right">{t('@ 테스트케이스', { count: summary.count })}</Td>
                              <Td align="center">
                                <Button
                                  outline
                                  color="danger"
                                  size="xs"
                                  onClick={() => {
                                    const nextTestcaseGroups = testrun.testcaseGroups.slice(0);
                                    const index = nextTestcaseGroups.findIndex(d => d.testcaseGroupId === summary.testcaseGroupId);

                                    if (index > -1) {
                                      const hasChild = selectedTestcaseGroupSummary.some(d => d.parentId && d.parentId === summary.testcaseGroupId);
                                      if (hasChild) {
                                        nextTestcaseGroups[index].testcases = [];
                                      } else {
                                        nextTestcaseGroups.splice(index, 1);
                                      }

                                      onChangeTestrun('testcaseGroups', nextTestcaseGroups);
                                      setSelectedTestcaseGroupSummary(testcaseUtil.getSelectedTestcaseGroupSummary(nextTestcaseGroups, project.testcaseGroups));
                                    }
                                  }}
                                >
                                  {t('삭제')}
                                </Button>
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </Block>
                )}
              </BlockRow>
            </Block>
            {isEdit && (
              <Block>
                <BlockRow className="testrun-jira-integration-row">
                  <Label minWidth={labelMinWidth}>{t('Jira 스프린트')}</Label>
                  <Text>
                    <Link
                      to="/"
                      onClick={e => {
                        e.preventDefault();
                        setJiraSprintSelectPopupOpened(true);
                      }}
                    >
                      {t('Jira Sprint 선택')}
                    </Link>
                    <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 0.5rem 0 1rem" />
                    {testrun.jiraSprint?.name || t('선택된 Sprint가 없습니다.')}
                  </Text>
                </BlockRow>
              </Block>
            )}
            <PageButtons
              onCancel={() => {
                navigate(-1);
              }}
              onSubmit={() => {}}
              onSubmitText={t('저장')}
              onCancelIcon=""
            />
          </Form>
        </PageContent>
      </Page>
      {projectUserSelectPopupOpened && (
        <ProjectUserSelectPopup
          users={project.users}
          selectedUsers={testrun.testrunUsers || []}
          setOpened={setProjectUserSelectPopupOpened}
          onApply={selectedUsers => {
            onChangeTestrun('testrunUsers', selectedUsers);
          }}
        />
      )}
      {testcaseSelectPopupOpened && (
        <TestcaseSelectPopup
          testcaseGroups={project.testcaseGroups}
          selectedTestcaseGroups={testrun.testcaseGroups}
          users={project.users}
          selectedUsers={testrun.testrunUsers}
          setOpened={setTestcaseSelectPopupOpened}
          onApply={selectedTestcaseGroups => {
            setSelectedTestcaseGroupSummary(testcaseUtil.getSelectedTestcaseGroupSummary(selectedTestcaseGroups, project.testcaseGroups));

            onChangeTestrun('testcaseGroups', selectedTestcaseGroups);
          }}
        />
      )}
      {isEdit && jiraSprintSelectPopupOpened && (
        <JiraSprintSelectPopup
          spaceCode={spaceCode}
          projectId={projectId}
          setOpened={setJiraSprintSelectPopupOpened}
          onApply={selectedJiraSprint => {
            onChangeTestrun('jiraSprint', selectedJiraSprint);
          }}
        />
      )}
    </>
  );
}

TestrunEditPage.defaultProps = {
  type: 'new',
};

TestrunEditPage.propTypes = {
  type: PropTypes.string,
};

export default TestrunEditPage;
