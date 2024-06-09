import React, { useEffect, useMemo, useState } from 'react';
import {
  Block,
  Button,
  CheckBox,
  CloseIcon,
  DatePicker,
  EmptyContent,
  Form,
  Input,
  Label,
  Liner,
  Page,
  PageButtons,
  PageContent,
  PageTitle,
  Radio,
  Selector,
  Tag,
  Text,
  TextArea,
  Title,
} from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import BlockRow from '@/components/BlockRow/BlockRow';
import ProjectService from '@/services/ProjectService';

import ProjectUserSelectPopup from '@/pages/spaces/projects/testruns/ProjectUserSelectPopup/ProjectUserSelectPopup';
import TestcaseSelectPopup from '@/assets/TestcaseSelectPopup/TestcaseSelectPopup';
import TestrunService from '@/services/TestrunService';
import dialogUtil from '@/utils/dialogUtil';
import {
  DATE_FORMATS,
  DURATIONS,
  HOLIDAY_CONDITION_DAY_LIST,
  HOLIDAY_CONDITION_WEEK_LIST,
  MESSAGE_CATEGORY,
  TESTRUN_ITERATION_MONTHLY_DATES,
  TESTRUN_ITERATION_USER_FILTER_SELECT_RULE,
  TESTRUN_ITERATION_USER_FILTER_TYPE_CODE,
} from '@/constants/constants';
import DateCustomInput from '@/components/DateRange/DateCustomInput/DateCustomInput';
import dateUtil from '@/utils/dateUtil';
import './TestrunIterationEditPage.scss';
import SpaceProfileService from '@/services/SpaceProfileService';
import { ProfileSelectPopup, TestrunHookEditPopup, TestrunHookTable, TestrunMessageChannelSelector } from '@/assets';

const labelMinWidth = '120px';

function TestrunIterationEditPage({ type }) {
  const { t } = useTranslation();
  const { projectId, spaceCode, testrunIterationId } = useParams();

  const navigate = useNavigate();

  const [projectUserSelectPopupOpened, setProjectUserSelectPopupOpened] = useState(false);

  const [testcaseSelectPopupOpened, setTestcaseSelectPopupOpened] = useState(false);

  const [project, setProject] = useState(null);

  const [spaceProfileList, setSpaceProfileList] = useState([]);

  const [profileSelectPopupOpened, setProfileSelectPopupOpened] = useState(false);

  const [testrunHookEditPopupInfo, setTestrunHookEditPopupInfo] = useState({
    opened: false,
  });

  const [testrunIteration, setTestrunIteration] = useState({
    id: null,
    name: '',
    description: '',
    testrunUsers: [],
    testcaseGroups: [],
    projectId,
    reserveStartDateTime: (() => {
      const start = new Date();
      start.setHours(start.getHours() + 1);
      start.setMinutes(0);
      start.setSeconds(0);
      start.setMilliseconds(0);

      return start.getTime();
    })(),
    reserveEndDateTime: (() => {
      const end = new Date();
      end.setDate(end.getDate() + 90);
      end.setHours(19);
      end.setMinutes(0);
      end.setSeconds(0);
      end.setMilliseconds(0);

      return end.getTime();
    })(),
    testrunIterationTimeType: 'WEEKLY', // MONTHLY, WEEKLY, MONTHLY_WEEKLY
    excludeHoliday: false,
    durationHours: 24,
    days: '1111100',
    startTime: (() => {
      const startTime = new Date();
      startTime.setHours(9);
      startTime.setMinutes(0);
      return startTime.getTime();
    })(),
    deadlineClose: true,
    autoTestcaseNotAssignedTester: true,
    date: null,
    week: null,
    day: null,
    testrunIterationUserFilterType: 'NONE', // NONE, TESTRUN, WEEKLY, MONTHLY
    testrunIterationUserFilterSelectRule: 'SEQ', // RANDOM, SEQ
    filteringUserCount: null,
    profileIds: [],
    hooks: [],
  });

  const isEdit = useMemo(() => {
    return type === 'edit';
  }, [type]);

  const selectAllUser = () => {
    const nextTestrun = {
      ...testrunIteration,
      testrunUsers: project.users?.map(d => {
        return { userId: d.userId, email: d.email, name: d.name };
      }),
    };
    setTestrunIteration(nextTestrun);
  };

  const selectAllTestcase = () => {
    const nextTestrun = {
      ...testrunIteration,
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
    setTestrunIteration(nextTestrun);
  };

  useEffect(() => {
    SpaceProfileService.selectSpaceProfileList(spaceCode, profiles => {
      setSpaceProfileList(profiles);

      ProjectService.selectProjectInfo(spaceCode, projectId, info => {
        setProject(info);
        if (isEdit) {
          TestrunService.selectTestrunIterationInfo(spaceCode, projectId, testrunIterationId, data => {
            setTestrunIteration({
              ...data,
              startTime: dateUtil.getHourMinuteTime(data.startTime),
              reserveStartDateTime: dateUtil.getTime(data.reserveStartDateTime),
              reserveEndDateTime: dateUtil.getTime(data.reserveEndDateTime),
              messageChannels: data.messageChannels || [],
            });
          });
        } else {
          const defaultProfile = profiles.find(profile => profile.default);
          setTestrunIteration({
            ...testrunIteration,
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
            profileIds: defaultProfile ? [defaultProfile.id] : [],
            messageChannels: info.messageChannels?.map(d => {
              return {
                projectMessageChannelId: d.id,
              };
            }),
          });
        }
      });
    });
  }, [type, projectId, testrunIterationId]);

  const onSubmit = e => {
    e.preventDefault();

    if (testrunIteration.reserveStartDateTime && testrunIteration.reserveEndDateTime && testrunIteration.reserveStartDateTime > testrunIteration.reserveEndDateTime) {
      dialogUtil.setMessage(MESSAGE_CATEGORY.WARNING, '테스트 기간 오류', '테스트 종료 일시가 테스트 시작 일시보다 빠릅니다.');
      return;
    }

    if (!testrunIteration.testcaseGroups || testrunIteration.testcaseGroups?.length < 1) {
      dialogUtil.setMessage(MESSAGE_CATEGORY.WARNING, '테스트케이스 없음', '테스트런에 포함된 테스트케이스가 없습니다.');
      return;
    }

    if (!testrunIteration.testrunUsers || testrunIteration.testrunUsers?.length < 1) {
      dialogUtil.setMessage(MESSAGE_CATEGORY.WARNING, '테스터 없음', '테스트런에 포함된 테스터가 없습니다.');
      return;
    }

    if (isEdit) {
      TestrunService.updateProjectTestrunIterationInfo(
        spaceCode,
        projectId,
        {
          ...testrunIteration,
          projectId,
          reserveStartDateTime: testrunIteration.reserveStartDateTime ? new Date(testrunIteration.reserveStartDateTime)?.toISOString() : null,
          reserveEndDateTime: testrunIteration.reserveEndDateTime ? new Date(testrunIteration.reserveEndDateTime)?.toISOString() : null,
          startTime: testrunIteration.startTime ? new Date(testrunIteration.startTime)?.toISOString() : null,
        },
        () => {
          navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns/iterations`);
        },
      );
    } else {
      TestrunService.createProjectTestrunIterationInfo(
        spaceCode,
        projectId,
        {
          ...testrunIteration,
          projectId,
          reserveStartDateTime: testrunIteration.reserveStartDateTime ? new Date(testrunIteration.reserveStartDateTime)?.toISOString() : null,
          reserveEndDateTime: testrunIteration.reserveEndDateTime ? new Date(testrunIteration.reserveEndDateTime)?.toISOString() : null,
          startTime: testrunIteration.startTime ? new Date(testrunIteration.startTime)?.toISOString() : null,
          expired: false,
        },
        () => {
          navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns/iterations`);
        },
      );
    }
  };

  const onChangeTestrun = (key, value) => {
    setTestrunIteration({
      ...testrunIteration,
      [key]: value,
    });
  };

  const removeTestrunUser = userId => {
    const nextTestrunUsers = testrunIteration.testrunUsers.slice(0);
    const nextIndex = nextTestrunUsers.findIndex(d => d.userId === userId);
    if (nextIndex > -1) {
      nextTestrunUsers.splice(nextIndex, 1);
      onChangeTestrun('testrunUsers', nextTestrunUsers);
    }
  };

  const testrunUserCountList = useMemo(() => {
    const list = [];
    for (let i = 1; i <= testrunIteration.testrunUsers?.length; i += 1) {
      list.push(i);
    }
    return list;
  }, [testrunIteration.testrunUsers]);

  return (
    <>
      <Page className="testrun-iteration-edit-page-wrapper">
        <PageTitle
          name={isEdit ? t('반복 테스트런 편집') : t('반복 테스트런 생성')}
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
              to: `/spaces/${spaceCode}/projects/${projectId}/testruns/iterations`,
              text: t('반복 테스트런 목록'),
            },
            {
              to: isEdit ? `/spaces/${spaceCode}/projects/${projectId}/testruns/iterations/${testrunIterationId}/edit` : `/spaces/${spaceCode}/projects/${projectId}/testruns/iterations/new`,
              text: isEdit ? t('편집') : t('생성'),
            },
          ]}
          onListClick={() => {
            navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns/iterations`);
          }}
        >
          {type === 'edit' ? t('반복 테스트런') : t('새 반복 테스트런')}
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
                  value={testrunIteration.name}
                  onChange={val =>
                    setTestrunIteration({
                      ...testrunIteration,
                      name: val,
                    })
                  }
                  required
                  minLength={1}
                />
              </BlockRow>
              <BlockRow>
                <Label minWidth={labelMinWidth}>{t('프로파일')}</Label>
                {testrunIteration?.profileIds?.length > 0 && (
                  <div className="profile-list">
                    <ul>
                      {testrunIteration?.profileIds?.map((profileId, inx) => {
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
                  value={testrunIteration.description || ''}
                  rows={4}
                  onChange={val => {
                    setTestrunIteration({
                      ...testrunIteration,
                      description: val,
                    });
                  }}
                />
              </BlockRow>

              <BlockRow>
                <Label minWidth={labelMinWidth} required>
                  {t('반복 기간')}
                </Label>
                <div className="iteration-period">
                  <DatePicker
                    className="date-picker start-date-picker"
                    date={testrunIteration.reserveStartDateTime}
                    showTimeSelect
                    onChange={date => {
                      setTestrunIteration({
                        ...testrunIteration,
                        reserveStartDateTime: date,
                      });
                    }}
                    customInput={<DateCustomInput />}
                  />
                  <Liner display="inline-block" width="10px" height="1px" margin="0 0.5rem" />
                  <DatePicker
                    className="date-picker start-date-picker"
                    date={testrunIteration.reserveEndDateTime}
                    showTimeSelect
                    onChange={date => {
                      setTestrunIteration({
                        ...testrunIteration,
                        reserveEndDateTime: date,
                      });
                    }}
                    customInput={<DateCustomInput />}
                  />
                </div>
              </BlockRow>
              <BlockRow>
                <Label minWidth={labelMinWidth}>{t('반복 주기')}</Label>
                <Radio
                  value="WEEKLY"
                  type="default"
                  checked={testrunIteration.testrunIterationTimeType === 'WEEKLY'}
                  onChange={val => {
                    setTestrunIteration({
                      ...testrunIteration,
                      testrunIterationTimeType: val,
                    });
                  }}
                  label={t('요일별 반복')}
                />
                <Radio
                  value="MONTHLY"
                  type="default"
                  checked={testrunIteration.testrunIterationTimeType === 'MONTHLY'}
                  onChange={val => {
                    setTestrunIteration({
                      ...testrunIteration,
                      testrunIterationTimeType: val,
                      date: 1,
                      excludeHoliday: false,
                    });
                  }}
                  label={t('날짜별 반복')}
                />
                <Radio
                  value="MONTHLY_WEEKLY"
                  type="default"
                  checked={testrunIteration.testrunIterationTimeType === 'MONTHLY_WEEKLY'}
                  onChange={val => {
                    setTestrunIteration({
                      ...testrunIteration,
                      testrunIterationTimeType: val,
                    });
                  }}
                  label={t('주/요일별 반복')}
                />
              </BlockRow>

              <BlockRow>
                <Label minWidth={labelMinWidth} />
                <div className="day-of-weeks">
                  {testrunIteration.testrunIterationTimeType === 'WEEKLY' &&
                    [t('월'), t('화'), t('수'), t('목'), t('금'), t('토'), t('일')].map((day, jnx) => {
                      return (
                        <Button
                          key={jnx}
                          className={testrunIteration.days[jnx] === '1' ? 'selected' : ''}
                          size="md"
                          outline
                          rounded
                          onClick={() => {
                            const list = testrunIteration.days.split('');
                            list[jnx] = testrunIteration.days[jnx] === '1' ? '0' : '1';
                            const nextDays = list.join('');
                            setTestrunIteration({
                              ...testrunIteration,
                              days: nextDays,
                            });
                          }}
                        >
                          {day}
                        </Button>
                      );
                    })}
                  {testrunIteration.testrunIterationTimeType === 'MONTHLY' && (
                    <Selector
                      className="selector"
                      size="md"
                      items={TESTRUN_ITERATION_MONTHLY_DATES}
                      value={testrunIteration.date}
                      onChange={date => {
                        setTestrunIteration({
                          ...testrunIteration,
                          date,
                          excludeHoliday: date === -2 ? false : testrunIteration.excludeHoliday,
                        });
                      }}
                    />
                  )}
                  {testrunIteration.testrunIterationTimeType === 'MONTHLY_WEEKLY' && (
                    <>
                      <Selector
                        className="selector"
                        items={HOLIDAY_CONDITION_WEEK_LIST}
                        value={testrunIteration.week}
                        onChange={val => {
                          setTestrunIteration({
                            ...testrunIteration,
                            week: val,
                          });
                        }}
                      />
                      <Selector
                        className="selector"
                        items={HOLIDAY_CONDITION_DAY_LIST}
                        value={testrunIteration.day}
                        onChange={val => {
                          setTestrunIteration({
                            ...testrunIteration,
                            day: val,
                          });
                        }}
                      />
                    </>
                  )}
                  <Liner display="inline-block" width="1px" height="10px" color="light" margin="0 1rem" />
                  <Button
                    size="md"
                    className={`holiday-button ${testrunIteration.excludeHoliday ? 'selected' : ''}`}
                    disabled={testrunIteration.testrunIterationTimeType === 'MONTHLY' && testrunIteration.date === -2}
                    outline
                    onClick={() => {
                      setTestrunIteration({
                        ...testrunIteration,
                        excludeHoliday: !testrunIteration.excludeHoliday,
                      });
                    }}
                  >
                    {t('휴일 제외')}
                  </Button>
                  <Liner display="inline-block" width="1px" height="10px" color="light" margin="0 1rem" />
                  <div className="label">{t('시작 시간')}</div>
                  <div>
                    <DatePicker
                      clear={false}
                      className="date-picker start-date-picker"
                      date={testrunIteration.startTime}
                      showTimeSelect
                      showTimeSelectOnly
                      onChange={date => {
                        setTestrunIteration({
                          ...testrunIteration,
                          startTime: date,
                        });
                      }}
                      customInput={<DateCustomInput />}
                      dateFormat={DATE_FORMATS[dateUtil.getUserLocale()].hoursMinutes.picker}
                    />
                  </div>
                  <Liner display="inline-block" width="1px" height="10px" color="light" margin="0 1rem" />
                  <div className="label">{t('테스트 기간')}</div>
                  <Selector
                    className="selector"
                    size="md"
                    items={DURATIONS}
                    value={testrunIteration.durationHours}
                    onChange={value => {
                      setTestrunIteration({
                        ...testrunIteration,
                        durationHours: value,
                      });
                    }}
                  />
                </div>
              </BlockRow>
              <BlockRow>
                <Label minWidth={labelMinWidth} tip={t('테스트 종료 기간이 지나면, 모든 테스트가 완료되지 않은 상태라도 테스트를 종료 처리합니다.')}>
                  {t('자동 종료')}
                </Label>
                <CheckBox
                  size="sm"
                  type="checkbox"
                  value={testrunIteration.deadlineClose}
                  onChange={val =>
                    setTestrunIteration({
                      ...testrunIteration,
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
                  value={testrunIteration.autoTestcaseNotAssignedTester}
                  onChange={val =>
                    setTestrunIteration({
                      ...testrunIteration,
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
                {testrunIteration.testrunUsers?.length < 1 && <Text className="no-user">{t('선택된 사용자가 없습니다.')}</Text>}
                {testrunIteration.testrunUsers?.length > 0 && (
                  <ul className="testrun-users g-no-select">
                    {testrunIteration.testrunUsers?.map(d => {
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
              <BlockRow className="testrun-users-filter">
                <Label minWidth={labelMinWidth}>{t('테스터 필터')}</Label>
                <Selector
                  className="selector"
                  size="md"
                  items={TESTRUN_ITERATION_USER_FILTER_TYPE_CODE}
                  value={testrunIteration.testrunIterationUserFilterType}
                  onChange={testrunIterationUserFilterType => {
                    setTestrunIteration({
                      ...testrunIteration,
                      testrunIterationUserFilterType,
                    });
                  }}
                />
                {testrunIteration.testrunIterationUserFilterType !== 'NONE' && (
                  <Selector
                    className="selector"
                    size="md"
                    items={TESTRUN_ITERATION_USER_FILTER_SELECT_RULE}
                    value={testrunIteration.testrunIterationUserFilterSelectRule}
                    onChange={testrunIterationUserFilterSelectRule => {
                      setTestrunIteration({
                        ...testrunIteration,
                        testrunIterationUserFilterSelectRule,
                      });
                    }}
                  />
                )}
                {testrunIteration.testrunIterationUserFilterType !== 'NONE' && (
                  <Selector
                    className="selector"
                    size="md"
                    items={testrunUserCountList.map(d => {
                      return {
                        key: d,
                        value: t('@ 명', { count: d }),
                      };
                    })}
                    value={testrunIteration.filteringUserCount}
                    onChange={filteringUserCount => {
                      setTestrunIteration({
                        ...testrunIteration,
                        filteringUserCount,
                      });
                    }}
                  />
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
                {testrunIteration.testcaseGroups?.length < 1 && <Text className="no-user">{t('선택된 테스트케이스가 없습니다.')}</Text>}
                {testrunIteration.testcaseGroups?.length > 0 && (
                  <ul className="testrun-testcases g-no-select">
                    {testrunIteration.testcaseGroups?.map(d => {
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
              {isEdit && (
                <BlockRow>
                  <Label minWidth={labelMinWidth}>{t('테스트케이스')}</Label>
                  <Text>
                    <Tag className="tag" size="md" uppercase>
                      {testrunIteration.reserveExpired ? t('만료') : t('반복중')}
                    </Tag>
                  </Text>
                </BlockRow>
              )}
            </Block>
            <Title border={false} marginBottom={false}>
              {t('알림 채널')}
            </Title>
            <TestrunMessageChannelSelector
              projectMessageChannels={project?.messageChannels}
              messageChannels={testrunIteration?.messageChannels}
              onChange={messageChannels => {
                setTestrunIteration({
                  ...testrunIteration,
                  messageChannels,
                });
              }}
            />
            {!(project?.messageChannels?.length > 0) && (
              <EmptyContent className="empty-content">
                <div>{t('등록된 메세지 채널이 없습니다.')}</div>
              </EmptyContent>
            )}
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
                  hooks={testrunIteration.hooks}
                  onNameClick={(data, index) => {
                    setTestrunHookEditPopupInfo({
                      opened: true,
                      index,
                      data,
                    });
                  }}
                  onDeleteClick={(data, index) => {
                    const nextTestrun = { ...testrunIteration };
                    const nextHooks = nextTestrun.hooks.slice(0);
                    nextHooks.splice(index, 1);
                    setTestrunIteration({
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
          selectedUsers={testrunIteration.testrunUsers || []}
          setOpened={setProjectUserSelectPopupOpened}
          onApply={selectedUsers => {
            onChangeTestrun('testrunUsers', selectedUsers);
          }}
        />
      )}
      {testcaseSelectPopupOpened && (
        <TestcaseSelectPopup
          testcaseGroups={project.testcaseGroups}
          selectedTestcaseGroups={testrunIteration.testcaseGroups}
          users={project.users}
          selectedUsers={testrunIteration.testrunUsers}
          setOpened={setTestcaseSelectPopupOpened}
          onApply={selectedTestcaseGroups => {
            onChangeTestrun('testcaseGroups', selectedTestcaseGroups);
          }}
        />
      )}
      {profileSelectPopupOpened && (
        <ProfileSelectPopup
          profileIds={testrunIteration.profileIds}
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
            const nextTestrun = { ...testrunIteration };
            const nextHooks = (nextTestrun.hooks || []).slice(0);
            if (testrunHookEditPopupInfo.index === null) {
              nextHooks.push(apiInfo);
              setTestrunIteration({ ...nextTestrun, hooks: nextHooks });
            } else {
              nextHooks[testrunHookEditPopupInfo.index] = apiInfo;
              setTestrunIteration({ ...nextTestrun, hooks: nextHooks });
            }
          }}
        />
      )}
    </>
  );
}

TestrunIterationEditPage.defaultProps = {
  type: 'new',
};

TestrunIterationEditPage.propTypes = {
  type: PropTypes.string,
};

export default TestrunIterationEditPage;
