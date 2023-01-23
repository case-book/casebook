import React, { useEffect, useMemo, useState } from 'react';
import { Block, Button, CloseIcon, DateRange, Form, Input, Label, Liner, Page, PageButtons, PageContent, PageTitle, Text, TextArea, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import BlockRow from '@/components/BlockRow/BlockRow';
import ProjectService from '@/services/ProjectService';
import useStores from '@/hooks/useStores';
import './TestrunEditPage.scss';
import ProjectUserSelectPopup from '@/pages/spaces/projects/testruns/ProjectUserSelectPopup';
import TestcaseSelectPopup from '@/pages/spaces/projects/testruns/TestcaseSelectPopup/TestcaseSelectPopup';
import TestrunService from '@/services/TestrunService';
import moment from 'moment';
import dialogUtil from '@/utils/dialogUtil';
import { MESSAGE_CATEGORY } from '@/constants/constants';

const labelMinWidth = '120px';

function TestrunEditPage({ type }) {
  const { t } = useTranslation();
  const { projectId, spaceCode } = useParams();

  const {
    userStore: { user },
  } = useStores();

  const navigate = useNavigate();

  const [projectUserSelectPopupOpened, setProjectUserSelectPopupOpened] = useState(false);

  const [testcaseSelectPopupOpened, setTestcaseSelectPopupOpened] = useState(false);

  const [project, setProject] = useState(null);

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
  });

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
    const nextTestrun = {
      ...testrun,
      testcaseGroups: project.testcaseGroups?.map(d => {
        return {
          testcaseGroupId: d.id,
          testcases: d.testcases?.map(item => {
            return {
              testcaseId: item.id,
            };
          }),
        };
      }),
    };
    setTestrun(nextTestrun);
  };

  useEffect(() => {
    ProjectService.selectProjectInfo(spaceCode, projectId, info => {
      setProject(info);
      if (!isEdit) {
        setTestrun({
          ...testrun,
          testrunUsers: info.users?.map(d => {
            return { userId: d.userId, email: d.email, name: d.name };
          }),
          testcaseGroups: info.testcaseGroups?.map(d => {
            return {
              testcaseGroupId: d.id,
              testcases: d.testcases?.map(item => {
                return {
                  testcaseId: item.id,
                };
              }),
            };
          }),
        });
      }
    });
  }, [type, projectId]);

  const onSubmit = e => {
    e.preventDefault();

    if (testrun.startDateTime && testrun.endDateTime && testrun.startDateTime > testrun.endDateTime) {
      dialogUtil.setMessage(MESSAGE_CATEGORY.WARNING, '테스트 기간 오류', '테스트 종료 일시가 테스트 시작 일시보다 빠릅니다.');
      return;
    }

    TestrunService.createProjectTestrunInfo(
      spaceCode,
      projectId,
      {
        ...testrun,
        projectId,
        startDateTime: testrun.startDateTime ? moment(testrun.startDateTime).format('YYYY-MM-DDTHH:mm:ss') : null,
        endDateTime: testrun.endDateTime ? moment(testrun.endDateTime).format('YYYY-MM-DDTHH:mm:ss') : null,
      },
      () => {
        navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns`);
      },
    );
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
        <PageTitle>{type === 'edit' ? t('테스트 런') : t('새 테스트런')}</PageTitle>
        <PageContent>
          <Form onSubmit={onSubmit}>
            <Title>{t('테스트 런 정보')}</Title>
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
                    {t('테스터케이스 선택')}
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
                {testrun.testcaseGroups?.length < 1 && <Text className="no-user">{t('선택된 테스트케이스가 없습니다.')}</Text>}
                {testrun.testcaseGroups?.length > 0 && (
                  <ul className="testrun-testcases g-no-select">
                    {testrun.testcaseGroups?.map(d => {
                      return (
                        <li key={d.testcaseGroupId}>
                          <div>
                            {project.testcaseGroups.find(group => group.id === d.testcaseGroupId)?.name}
                            {d.testcases?.length > 0 && (
                              <span className="badge">
                                <span>{d.testcases?.length}</span>
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </BlockRow>
            </Block>
            <PageButtons
              outline
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
          selectedUsers={testrun.testrunUsers}
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
            onChangeTestrun('testcaseGroups', selectedTestcaseGroups);
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
