import React, { useEffect, useMemo, useState } from 'react';
import { Block, Button, CheckBox, CloseIcon, DateRange, Form, Input, Label, Liner, Page, PageButtons, PageContent, PageTitle, Text, TextArea, Title } from '@/components';
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
import './TestrunReservationEditPage.scss';

const labelMinWidth = '120px';

function TestrunReservationEditPage({ type }) {
  const { t } = useTranslation();
  const { projectId, spaceCode, testrunReservationId } = useParams();

  const {
    userStore: { user },
  } = useStores();

  const navigate = useNavigate();

  const [projectUserSelectPopupOpened, setProjectUserSelectPopupOpened] = useState(false);

  const [testcaseSelectPopupOpened, setTestcaseSelectPopupOpened] = useState(false);

  const [project, setProject] = useState(null);

  const [testrunReservation, setTestrunReservation] = useState({
    id: null,
    projectId,
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
    expired: false,
    deadlineClose: true,
    selectCreatedTestcase: false,
    selectUpdatedTestcase: false,
  });

  const isEdit = useMemo(() => {
    return type === 'edit';
  }, [type]);

  const selectAllUser = () => {
    const nextTestrun = {
      ...testrunReservation,
      testrunUsers: project.users?.map(d => {
        return { userId: d.userId, email: d.email, name: d.name };
      }),
    };
    setTestrunReservation(nextTestrun);
  };

  const selectAllTestcase = () => {
    const nextTestrun = {
      ...testrunReservation,
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
    setTestrunReservation(nextTestrun);
  };

  useEffect(() => {
    ProjectService.selectProjectInfo(spaceCode, projectId, info => {
      setProject(info);
      if (!isEdit) {
        setTestrunReservation({
          ...testrunReservation,
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
      } else {
        TestrunService.selectTestrunReservationInfo(spaceCode, projectId, testrunReservationId, data => {
          setTestrunReservation({
            ...data,
            startTime: dateUtil.getHourMinuteTime(data.startTime),
            startDateTime: dateUtil.getTime(data.startDateTime),
            endDateTime: dateUtil.getTime(data.endDateTime),
          });
        });
      }
    });
  }, [type, projectId, testrunReservationId]);

  const onSubmit = e => {
    e.preventDefault();

    if (testrunReservation.startDateTime && testrunReservation.endDateTime && testrunReservation.startDateTime > testrunReservation.endDateTime) {
      dialogUtil.setMessage(MESSAGE_CATEGORY.WARNING, '테스트 기간 오류', '테스트 종료 일시가 테스트 시작 일시보다 빠릅니다.');
      return;
    }

    if (isEdit) {
      TestrunService.updateProjectTestrunReservationInfo(
        spaceCode,
        projectId,
        {
          ...testrunReservation,
          projectId,
          startDateTime: testrunReservation.startDateTime ? new Date(testrunReservation.startDateTime)?.toISOString() : null,
          endDateTime: testrunReservation.endDateTime ? new Date(testrunReservation.endDateTime)?.toISOString() : null,
          startTime: testrunReservation.startTime ? new Date(testrunReservation.startTime)?.toISOString() : null,
        },
        () => {
          navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns/reservations`);
        },
      );
    } else {
      TestrunService.createProjectTestrunReservationInfo(
        spaceCode,
        projectId,
        {
          ...testrunReservation,
          projectId,
          name: testrunReservation.name,
          description: testrunReservation.description,
          testrunUsers: testrunReservation.testrunUsers,
          testcaseGroups: testrunReservation.testcaseGroups,
          startDateTime: testrunReservation.startDateTime ? new Date(testrunReservation.startDateTime)?.toISOString() : null,
          endDateTime: testrunReservation.endDateTime ? new Date(testrunReservation.endDateTime)?.toISOString() : null,
          expired: false,
          deadlineClose: testrunReservation.deadlineClose,
        },
        () => {
          navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns/reservations`);
        },
      );
    }
  };

  const onChangeTestrun = (key, value) => {
    setTestrunReservation({
      ...testrunReservation,
      [key]: value,
    });
  };

  const removeTestrunUser = userId => {
    const nextTestrunUsers = testrunReservation.testrunUsers.slice(0);
    const nextIndex = nextTestrunUsers.findIndex(d => d.userId === userId);
    if (nextIndex > -1) {
      nextTestrunUsers.splice(nextIndex, 1);
      onChangeTestrun('testrunUsers', nextTestrunUsers);
    }
  };

  return (
    <>
      <Page className="testrun-reservation-edit-page-wrapper">
        <PageTitle
          name={isEdit ? t('예약 테스트런 편집') : t('예약 테스트런 생성')}
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
              to: `/spaces/${spaceCode}/projects/${projectId}/testruns/reservations`,
              text: t('예약 테스트런 목록'),
            },
            {
              to: isEdit ? `/spaces/${spaceCode}/projects/${projectId}/testruns/reservations/${testrunReservationId}/edit` : `/spaces/${spaceCode}/projects/${projectId}/testruns/reservations/new`,
              text: isEdit ? t('편집') : t('생성'),
            },
          ]}
          onListClick={() => {
            navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns/reservations`);
          }}
        >
          {type === 'edit' ? t('예약 테스트런') : t('새 예약 테스트런')}
        </PageTitle>
        <PageContent>
          <Form onSubmit={onSubmit}>
            <Title border={false} marginBottom={false}>
              {t('예약 테스트런 정보')}
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
                  value={testrunReservation.name}
                  onChange={val =>
                    setTestrunReservation({
                      ...testrunReservation,
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
                  value={testrunReservation.description || ''}
                  rows={4}
                  onChange={val => {
                    setTestrunReservation({
                      ...testrunReservation,
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
                  startDate={testrunReservation.startDateTime}
                  endDate={testrunReservation.endDateTime}
                  startDateKey="startDateTime"
                  endDateKey="endDateTime"
                  onChange={(key, value) => {
                    setTestrunReservation({
                      ...testrunReservation,
                      [key]: value,
                    });
                  }}
                />
              </BlockRow>
              <BlockRow>
                <Label minWidth={labelMinWidth} tip={t('테스트 종료 기간이 지나면, 모든 테스트가 완료되지 않은 상태라도 테스트를 종료 처리합니다.')}>
                  {t('자동 종료')}
                </Label>
                <CheckBox
                  size="sm"
                  type="checkbox"
                  value={testrunReservation.deadlineClose}
                  onChange={val =>
                    setTestrunReservation({
                      ...testrunReservation,
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
                {testrunReservation.testrunUsers?.length < 1 && <Text className="no-user">{t('선택된 사용자가 없습니다.')}</Text>}
                {testrunReservation.testrunUsers?.length > 0 && (
                  <ul className="testrun-users g-no-select">
                    {testrunReservation.testrunUsers?.map(d => {
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
                {testrunReservation.testcaseGroups?.length < 1 && <Text className="no-user">{t('선택된 테스트케이스가 없습니다.')}</Text>}
                {testrunReservation.testcaseGroups?.length > 0 && (
                  <ul className="testrun-testcases g-no-select">
                    {testrunReservation.testcaseGroups?.map(d => {
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
              <BlockRow>
                <Label minWidth={labelMinWidth} tip={t('예약 테스트런을 만든 시점부터, 예약 테스트런에 생성될때까지 추가된 테스트케이스를 자동으로 추가합니다.')}>
                  {t('자동 추가')}
                </Label>
                <Text>
                  <CheckBox
                    size="sm"
                    type="checkbox"
                    label={t('예약 테스트런 생성전까지 생성된 테스트케이스 자동 추가')}
                    value={testrunReservation.selectCreatedTestcase}
                    onChange={val =>
                      setTestrunReservation({
                        ...testrunReservation,
                        selectCreatedTestcase: val,
                      })
                    }
                  />
                </Text>
              </BlockRow>
              <BlockRow>
                <Label minWidth={labelMinWidth} />
                <Text>
                  <CheckBox
                    size="sm"
                    type="checkbox"
                    label={t('예약 테스트런 생성전까지 변경된 테스트케이스 자동 추가')}
                    value={testrunReservation.selectUpdatedTestcase}
                    onChange={val =>
                      setTestrunReservation({
                        ...testrunReservation,
                        selectUpdatedTestcase: val,
                      })
                    }
                  />
                </Text>
              </BlockRow>
            </Block>
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
          selectedUsers={testrunReservation.testrunUsers || []}
          setOpened={setProjectUserSelectPopupOpened}
          onApply={selectedUsers => {
            onChangeTestrun('testrunUsers', selectedUsers);
          }}
        />
      )}
      {testcaseSelectPopupOpened && (
        <TestcaseSelectPopup
          testcaseGroups={project.testcaseGroups}
          selectedTestcaseGroups={testrunReservation.testcaseGroups}
          users={project.users}
          selectedUsers={testrunReservation.testrunUsers}
          setOpened={setTestcaseSelectPopupOpened}
          onApply={selectedTestcaseGroups => {
            onChangeTestrun('testcaseGroups', selectedTestcaseGroups);
          }}
        />
      )}
    </>
  );
}

TestrunReservationEditPage.defaultProps = {
  type: 'new',
};

TestrunReservationEditPage.propTypes = {
  type: PropTypes.string,
};

export default TestrunReservationEditPage;
