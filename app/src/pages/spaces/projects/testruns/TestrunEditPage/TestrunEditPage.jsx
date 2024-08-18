import React, { useEffect, useMemo, useState } from 'react';
import {
  Block,
  Button,
  CheckBox,
  CloseIcon,
  DateRange,
  EmptyContent,
  Form,
  Input,
  Label,
  Liner,
  Page,
  PageButtons,
  PageContent,
  PageTitle,
  Table,
  Tag,
  Tbody,
  Text,
  TextArea,
  Th,
  THead,
  Title,
  Tr,
} from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import BlockRow from '@/components/BlockRow/BlockRow';
import ProjectService from '@/services/ProjectService';
import useStores from '@/hooks/useStores';
import ProjectUserSelectPopup from '@/pages/spaces/projects/testruns/ProjectUserSelectPopup/ProjectUserSelectPopup';
import { ProfileSelectPopup, TestcaseSelectPopup, TestcaseViewerPopup, TestrunHookEditPopup, TestrunHookTable, TestrunMessageChannelSelector } from '@/assets';
import TestrunService from '@/services/TestrunService';
import dialogUtil from '@/utils/dialogUtil';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import dateUtil from '@/utils/dateUtil';
import testcaseUtil from '@/utils/testcaseUtil';
import './TestrunEditPage.scss';
import ReleaseService from '@/services/ReleaseService';
import SpaceProfileService from '@/services/SpaceProfileService';
import TestcaseService from '@/services/TestcaseService';
import { waitFor } from '@/utils/request';
import ReleaseGroupItem from '@/pages/spaces/projects/releases/ReleaseInfoPage/ReleaseGroupItem';

const labelMinWidth = '160px';

function TestrunEditPage({ type }) {
  const { t } = useTranslation();
  const { projectId, spaceCode, testrunId } = useParams();
  const [searchParams] = useSearchParams();
  const releaseId = searchParams.get('releaseId') ?? null;

  const {
    userStore: { user },
  } = useStores();

  const navigate = useNavigate();

  const [projectUserSelectPopupOpened, setProjectUserSelectPopupOpened] = useState(false);

  const [testcaseSelectPopupOpened, setTestcaseSelectPopupOpened] = useState(false);

  const [profileSelectPopupOpened, setProfileSelectPopupOpened] = useState(false);

  const [testrunHookEditPopupInfo, setTestrunHookEditPopupInfo] = useState({
    opened: false,
  });

  const [project, setProject] = useState(null);

  const [currentSelectedTestcaseGroups, setCurrentSelectedTestcaseGroups] = useState([]);

  const [testcaseGroups, setTestcaseGroups] = useState([]);

  const [releases, setReleases] = useState([]);

  const [testcaseViewerInfo, setTestcaseViewerInfo] = useState(null);

  const [spaceProfileList, setSpaceProfileList] = useState([]);

  const [testrun, setTestrun] = useState({
    seqId: '',
    name: '',
    description: '',
    testrunUsers: [],
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
    autoTestcaseNotAssignedTester: true,
    profileIds: [],
    hooks: [],
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
    setCurrentSelectedTestcaseGroups(
      testcaseGroups.map(group => {
        return {
          testcaseGroupId: group.id,
          testcases:
            group?.testcases?.map(testcase => {
              return {
                testcaseId: testcase.id,
              };
            }) || [],
        };
      }),
    );
  };

  useEffect(() => {
    const promises = [];
    promises.push(SpaceProfileService.selectSpaceProfileList(spaceCode));
    promises.push(ProjectService.selectProjectInfo(spaceCode, projectId));
    promises.push(TestcaseService.selectTestcaseGroupList(spaceCode, projectId));

    waitFor(promises).then(responses => {
      const profiles = responses[0].data;
      const info = responses[1].data;
      const list = responses[2].data;

      setSpaceProfileList(profiles);
      setProject(info);
      setTestcaseGroups(list);

      if (isEdit) {
        TestrunService.selectTestrunInfo(spaceCode, projectId, testrunId, data => {
          setTestrun({
            ...data,
            startTime: dateUtil.getHourMinuteTime(data.startTime),
            startDateTime: dateUtil.getTime(data.startDateTime),
            endDateTime: dateUtil.getTime(data.endDateTime),
            messageChannels: data.messageChannels || [],
          });

          setCurrentSelectedTestcaseGroups(
            data.testcaseGroups.map(group => {
              return {
                testcaseGroupId: group.testcaseGroupId,
                testcases:
                  group?.testcases?.map(testcase => {
                    return {
                      testcaseId: testcase.testcaseId,
                    };
                  }) || [],
              };
            }),
          );
        });
      } else {
        const defaultProfile = profiles.find(profile => profile.default);

        setTestrun({
          ...testrun,
          testrunUsers: info.users?.map(d => {
            return { userId: d.userId, email: d.email, name: d.name };
          }),
          profileIds: defaultProfile ? [defaultProfile.id] : [],
          messageChannels: info.messageChannels?.map(d => {
            return {
              projectMessageChannelId: d.id,
            };
          }),
        });

        setCurrentSelectedTestcaseGroups([]);
      }
    });
  }, [isEdit, projectId, testrunId]);

  useEffect(() => {
    ReleaseService.selectReleaseList(spaceCode, projectId, list => {
      setReleases(list);
    });

    if (isEdit || !releaseId || !testcaseGroups) {
      return;
    }

    ReleaseService.selectRelease(spaceCode, projectId, releaseId, data => {
      const nextTestcaseGroups = testcaseUtil.getSelectionForTestrunEdit(
        testcaseGroups.map(group => ({
          ...group,
          testcases: group.testcases.filter(testcase => testcase.projectReleaseIds.includes(Number(data.id))),
        })),
      );

      setTestrun(prev => ({
        ...prev,
        name: data.name,
        description: data.description,
        testcaseGroups: nextTestcaseGroups,
      }));
    });
  }, [isEdit, spaceCode, projectId, releaseId, testcaseGroups]);

  const onSubmit = e => {
    e.preventDefault();

    if (testrun.startDateTime && testrun.endDateTime && testrun.startDateTime > testrun.endDateTime) {
      dialogUtil.setMessage(MESSAGE_CATEGORY.WARNING, t('테스트 기간 오류'), t('테스트 종료 일시가 테스트 시작 일시보다 빠릅니다.'));
      return;
    }

    if (currentSelectedTestcaseGroups.length < 1) {
      dialogUtil.setMessage(MESSAGE_CATEGORY.WARNING, t('테스트케이스 없음'), t('테스트런에 포함된 테스트케이스가 없습니다.'));
      return;
    }

    if (isEdit) {
      TestrunService.updateProjectTestrunInfo(
        spaceCode,
        projectId,
        {
          ...testrun,
          testcaseGroups: currentSelectedTestcaseGroups,
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
          testcaseGroups: currentSelectedTestcaseGroups,
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

  const selectedTestcaseIdMap = useMemo(() => {
    const map = {};
    currentSelectedTestcaseGroups.forEach(group => {
      group.testcases.forEach(testcase => {
        map[testcase.testcaseId] = true;
      });
    });

    return map;
  }, [currentSelectedTestcaseGroups]);

  const testcaseTreeData = useMemo(() => {
    return testcaseUtil.getTestcaseTreeData(testcaseGroups, 'id');
  }, [testcaseGroups]);

  const onChangeTestcase = testcase => {
    const nextTestcaseGroups = testcaseGroups.slice(0);
    const group = nextTestcaseGroups.find(d => d.id === testcase.testcaseGroupId);
    const nextTestcasesIndex = group.testcases.findIndex(d => d.id === testcase.id);
    if (nextTestcasesIndex > -1) {
      group.testcases[nextTestcasesIndex] = testcase;
    }
    setTestcaseGroups(nextTestcaseGroups);
  };

  return (
    <>
      <Page className="testrun-edit-page-wrapper">
        <PageTitle
          name={isEdit ? t('테스트런 변경') : t('테스트런 생성')}
          breadcrumbs={[
            {
              to: '/',
              text: t('HOME'),
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
              text: isEdit ? t('변경') : t('생성'),
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
                <Label minWidth={labelMinWidth}>{t('프로파일')}</Label>
                {testrun?.profileIds?.length > 0 && (
                  <div className="profile-list">
                    <ul>
                      {testrun?.profileIds?.map((profileId, inx) => {
                        return (
                          <li key={profileId}>
                            <div>
                              <span className="badge">
                                <span>{inx + 1}</span>
                              </span>
                            </div>
                            <div>{spaceProfileList.find(d => d.id === profileId)?.name}</div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                <Button
                  outline
                  size="sm"
                  onClick={() => {
                    setProfileSelectPopupOpened(true);
                  }}
                >
                  {t('프로파일 선택')}
                </Button>
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
              <BlockRow>
                <Label minWidth={labelMinWidth} tip={t('자동화 테스트케이스 테스터 할당 제외')}>
                  {t('자동화 테스터 제외')}
                </Label>
                <CheckBox
                  size="sm"
                  type="checkbox"
                  value={testrun.autoTestcaseNotAssignedTester}
                  onChange={val =>
                    setTestrun({
                      ...testrun,
                      autoTestcaseNotAssignedTester: val,
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
            </Block>
            <Title
              control={
                <div>
                  <Tag size="xs" border rounded>
                    {t('@개', { count: Object.keys(selectedTestcaseIdMap).length })}
                  </Tag>
                  <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 0.5rem" />
                  <Button
                    outline
                    size="sm"
                    onClick={() => {
                      setTestcaseSelectPopupOpened(true);
                    }}
                  >
                    {t('테스트케이스 선택')}
                  </Button>
                  <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 0.5rem" />
                  <Button
                    outline
                    size="sm"
                    onClick={() => {
                      selectAllTestcase();
                    }}
                  >
                    {t('모든 테스트케이스 추가')}
                  </Button>
                </div>
              }
            >
              {t('테스트케이스')}
            </Title>
            {currentSelectedTestcaseGroups.length < 1 && <EmptyContent border>{t('선택된 테스트케이스가 없습니다.')}</EmptyContent>}
            {currentSelectedTestcaseGroups.length > 0 && (
              <Block className="testcase-list" border padding={false} scroll>
                <Table className="table" cols={['1px', '100%', '1px']} sticky>
                  <THead>
                    <Tr>
                      <Th align="left">{t('테스트케이스 그룹')}</Th>
                      <Th align="left">{t('테스트케이스')}</Th>
                    </Tr>
                  </THead>
                  <Tbody>
                    {testcaseTreeData.map(testcaseGroup => {
                      return (
                        <ReleaseGroupItem
                          key={testcaseGroup.id}
                          testcaseGroup={testcaseGroup}
                          selectedTestcaseIdMap={selectedTestcaseIdMap}
                          onNameClick={(groupId, id) => {
                            setTestcaseViewerInfo({
                              testcaseTemplate: project.testcaseTemplates.find(d => d.id === id),
                              testcaseGroupId: groupId,
                              testcaseGroupTestcaseId: id,
                            });
                          }}
                        />
                      );
                    })}
                  </Tbody>
                </Table>
              </Block>
            )}

            <Title border={false} marginBottom={false}>
              {t('알림 채널')}
            </Title>
            <TestrunMessageChannelSelector
              projectMessageChannels={project?.messageChannels}
              messageChannels={testrun?.messageChannels}
              onChange={messageChannels => {
                setTestrun({
                  ...testrun,
                  messageChannels,
                });
              }}
            />
            <Title
              border={false}
              marginBottom={false}
              control={
                <Button
                  outline
                  size="sm"
                  onClick={() => {
                    setTestrunHookEditPopupInfo({
                      opened: true,
                      index: null,
                    });
                  }}
                >
                  {t('API 추가')}
                </Button>
              }
            >
              {t('테스트런 API 훅')}
            </Title>
            <Block>
              <BlockRow className="testrun-hooks-content">
                <TestrunHookTable
                  edit
                  hooks={testrun.hooks}
                  onNameClick={(data, index) => {
                    setTestrunHookEditPopupInfo({
                      opened: true,
                      index,
                      data,
                    });
                  }}
                  onDeleteClick={(data, index) => {
                    const nextTestrun = { ...testrun };
                    const nextHooks = nextTestrun.hooks.slice(0);
                    nextHooks.splice(index, 1);
                    setTestrun({
                      ...nextTestrun,
                      hooks: nextHooks,
                    });
                  }}
                />
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
          selectedUsers={testrun.testrunUsers || []}
          setOpened={setProjectUserSelectPopupOpened}
          onApply={selectedUsers => {
            onChangeTestrun('testrunUsers', selectedUsers);
          }}
        />
      )}
      {testcaseSelectPopupOpened && (
        <TestcaseSelectPopup
          testcaseGroups={testcaseGroups}
          users={project.users}
          selectedUsers={testrun.testrunUsers}
          setOpened={setTestcaseSelectPopupOpened}
          selectedTestcaseGroups={currentSelectedTestcaseGroups}
          onApply={setCurrentSelectedTestcaseGroups}
          releases={releases}
        />
      )}
      {profileSelectPopupOpened && (
        <ProfileSelectPopup
          profileIds={testrun.profileIds}
          setOpened={setProfileSelectPopupOpened}
          onApply={profileIds => {
            onChangeTestrun('profileIds', profileIds);
          }}
        />
      )}
      {testrunHookEditPopupInfo.opened && (
        <TestrunHookEditPopup
          spaceCode={spaceCode}
          projectId={projectId}
          setOpened={value => {
            setTestrunHookEditPopupInfo({ ...testrunHookEditPopupInfo, opened: value });
          }}
          data={testrunHookEditPopupInfo.data}
          onApply={apiInfo => {
            const nextTestrun = { ...testrun };
            const nextHooks = (nextTestrun.hooks || []).slice(0);
            if (testrunHookEditPopupInfo.index === null) {
              nextHooks.push(apiInfo);
              setTestrun({ ...nextTestrun, hooks: nextHooks });
            } else {
              nextHooks[testrunHookEditPopupInfo.index] = apiInfo;
              setTestrun({ ...nextTestrun, hooks: nextHooks });
            }
          }}
        />
      )}
      {testcaseViewerInfo && (
        <TestcaseViewerPopup
          spaceCode={spaceCode}
          projectId={projectId}
          project={project}
          releases={releases}
          testcaseTemplate={testcaseViewerInfo.testcaseTemplate}
          testcaseGroupId={testcaseViewerInfo.testcaseGroupId}
          testcaseGroupTestcaseId={testcaseViewerInfo.testcaseGroupTestcaseId}
          users={project?.users.map(u => {
            return {
              ...u,
              id: u.userId,
            };
          })}
          setOpened={() => {
            setTestcaseViewerInfo(null);
          }}
          editEnabled
          onTestcaseChange={onChangeTestcase}
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
