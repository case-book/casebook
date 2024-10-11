import React, { useEffect, useMemo, useState } from 'react';
import { Block, Button, EmptyContent, Label, Liner, Page, PageButtons, PageContent, PageTitle, Table, Tag, Tbody, Text, Th, THead, Title, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import BlockRow from '@/components/BlockRow/BlockRow';
import ProjectService from '@/services/ProjectService';
import TestrunService from '@/services/TestrunService';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import dateUtil from '@/utils/dateUtil';
import dialogUtil from '@/utils/dialogUtil';
import SpaceProfileService from '@/services/SpaceProfileService';
import './TestrunInfoPage.scss';
import { TestcaseViewerPopup, TestrunHookInfoPopup, TestrunHookTable, TestrunMessageChannelList } from '@/assets';
import ReleaseGroupItem from '@/pages/spaces/projects/releases/ReleaseInfoPage/ReleaseGroupItem';
import testcaseUtil from '@/utils/testcaseUtil';
import TestcaseService from '@/services/TestcaseService';
import ReleaseService from '@/services/ReleaseService';

const labelMinWidth = '160px';

function TestrunInfoPage() {
  const { t } = useTranslation();
  const { projectId, spaceCode, testrunId } = useParams();

  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [releases, setReleases] = useState([]);

  const [spaceProfileList, setSpaceProfileList] = useState([]);

  const [testcaseViewerInfo, setTestcaseViewerInfo] = useState(null);

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
    profileIds: [],
    hooks: [],
  });

  const [testcaseGroups, setTestcaseGroups] = useState([]);

  const [testrunHookInfoPopup, setTestrunHookInfoPopup] = useState({
    opened: false,
  });

  const [releaseNameMap, setReleaseNameMap] = useState({});

  useEffect(() => {
    TestcaseService.selectTestcaseGroupList(spaceCode, projectId, list => {
      setTestcaseGroups(list);
    });

    ReleaseService.selectReleaseList(spaceCode, projectId, list => {
      setReleases(list);
      const nextReleaseNameMap = {};
      list.forEach(projectRelease => {
        nextReleaseNameMap[projectRelease.id] = projectRelease.name;
      });
      setReleaseNameMap(nextReleaseNameMap);
    });
  }, [spaceCode, projectId]);

  useEffect(() => {
    SpaceProfileService.selectSpaceProfileList(spaceCode, profiles => {
      setSpaceProfileList(profiles);
      ProjectService.selectProjectInfo(spaceCode, projectId, info => {
        setProject(info);
        TestrunService.selectTestrunInfo(spaceCode, projectId, testrunId, data => {
          setTestrun({
            ...data,
            startTime: dateUtil.getHourMinuteTime(data.startTime),
            startDateTime: dateUtil.getTime(data.startDateTime),
            endDateTime: dateUtil.getTime(data.endDateTime),
          });
        });
      });
    });
  }, [projectId, testrunId]);

  const userById = useMemo(() => {
    const map = {};

    project?.users.forEach(user => {
      map[user.userId] = user;
    });

    return map;
  }, [project]);

  const onDelete = () => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('테스트런 삭제'),
      <div>{t('@ 테스트런 및 테스트런에 입력된 모든 정보가 삭제됩니다. 삭제하시겠습니까?', { name: testrun.name })}</div>,
      () => {
        TestrunService.deleteTestrunInfo(spaceCode, projectId, testrunId, () => {
          navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns`);
        });
      },
      null,
      t('삭제'),
      null,
      'danger',
    );
  };

  const onClosed = () => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('테스트런 종료'),
      <div>{t('@ 테스트런을 종료합니다. 계속하시겠습니까?', { name: testrun.name })}</div>,
      () => {
        TestrunService.updateTestrunStatusClosed(spaceCode, projectId, testrunId, () => {
          navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns`);
        });
      },
      null,
      t('종료'),
      null,
      'primary',
    );
  };

  const selectedTestcaseIdMap = useMemo(() => {
    const map = {};
    testrun.testcaseGroups.forEach(group => {
      group.testcases?.forEach(testcase => {
        map[testcase.testcaseId] = testcase;
      });
    });

    return map;
  }, [testrun.testcaseGroups]);

  const onOpened = () => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('테스트런 오픈'),
      <div>{t('종료된 @ 테스트런을 다시 오픈합니다. 계속하시겠습니까?', { name: testrun.name })}</div>,
      () => {
        TestrunService.updateTestrunStatusOpened(spaceCode, projectId, testrunId, () => {
          navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns`);
        });
      },
      null,
      t('재오픈'),
      null,
      'primary',
    );
  };

  const testcaseTreeData = useMemo(() => {
    return testcaseUtil.getTestcaseTreeData(testcaseGroups, 'id');
  }, [testcaseGroups]);

  const onChangeTestcase = testcase => {
    const nextTestcaseGroups = testcaseGroups.slice(0);
    const group = nextTestcaseGroups.find(d => d.id === testcase.testcaseGroupId);
    if (group) {
      const nextTestcasesIndex = group.testcases.findIndex(d => d.id === testcase.id);
      if (nextTestcasesIndex > -1) {
        group.testcases[nextTestcasesIndex] = testcase;
      }
      setTestcaseGroups(nextTestcaseGroups);
    }
  };

  return (
    <>
      <Page className="testrun-info-page-wrapper">
        <PageTitle
          name={t('테스트런 정보')}
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
              to: `/spaces/${spaceCode}/projects/${projectId}/testruns/${testrunId}/info`,
              text: testrun?.name,
            },
          ]}
          control={
            <div>
              {testrun.opened && (
                <Button size="sm" color="warning" onClick={onClosed}>
                  {t('테스트런 종료')}
                </Button>
              )}
              {!testrun.opened && (
                <Button size="sm" color="warning" onClick={onOpened}>
                  {t('테스트런 오픈')}
                </Button>
              )}
              <Button size="sm" color="danger" onClick={onDelete}>
                {t('테스트런 삭제')}
              </Button>
              <Liner display="inline-block" width="1px" height="10px" margin="0 10px 0 0" />
              <Button
                size="sm"
                color="primary"
                onClick={() => {
                  navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns/${testrunId}/edit`);
                }}
              >
                {t('변경')}
              </Button>
            </div>
          }
          onListClick={() => {
            navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns`);
          }}
        >
          {t('테스트런')}
        </PageTitle>
        <PageContent>
          <Block>
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('프로젝트')}</Label>
              <Text>{project?.name}</Text>
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('이름')}</Label>
              <Text>{testrun?.name}</Text>
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
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('설명')}</Label>
              <Text>{testrun?.description}</Text>
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('테스트 기간')}</Label>
              <Text>
                <div className="testrun-range">
                  <div>{dateUtil.getDateString(testrun.startDateTime)}</div>
                  <Liner display="inline-block" width="10px" height="1px" margin="0 0.5rem" />
                  <div>{dateUtil.getDateString(testrun.endDateTime)}</div>
                </div>
              </Text>
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth} tip={t('테스트 종료 기간이 지나면, 모든 테스트가 완료되지 않은 상태라도 테스트를 종료 처리합니다.')}>
                {t('자동 종료')}
              </Label>
              <Text>{testrun.deadlineClose ? 'Y' : 'N'}</Text>
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth} tip={t('자동화 테스트케이스 테스터 할당 제외')}>
                {t('자동화 테스터 제외')}
              </Label>
              <Text>{testrun.autoTestcaseNotAssignedTester ? 'Y' : 'N'}</Text>
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('테스터')}</Label>
              {testrun.testrunUsers?.length < 1 && <Text className="no-user">{t('선택된 사용자가 없습니다.')}</Text>}
              {testrun.testrunUsers?.length > 0 && (
                <Text>
                  {testrun.testrunUsers?.map(d => {
                    return (
                      <Tag className="tester" size="sm" key={d.userId} color="white" border>
                        {d.name}
                      </Tag>
                    );
                  })}
                </Text>
              )}
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth} tip={t('선택된 테스트케이스와 케이스시퀀스로 연결된 모든 테스트케이스를 테스트런의 테스트케스로 추가합니다.')}>
                {t('연결된 케이스 추가')}
              </Label>
              <div>
                <Text>{testrun.addConnectedSequenceTestcase ? 'Y' : 'N'}</Text>
              </div>
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth} tip={t('테스트런에 포함된 테스트케이스 중 연결된 시퀀스의 테스트케이스의 테스터를 동일한 테스터로 지정합니다.')}>
                {t('시퀀스 동일 테스터')}
              </Label>
              <div>
                <Text>{testrun.assignSequenceTestcaseSameTester ? 'Y' : 'N'}</Text>
              </div>
            </BlockRow>
          </Block>
          <Title
            control={
              <div>
                <Tag size="xs" border rounded>
                  {t('@개', { count: Object.keys(selectedTestcaseIdMap).length })}
                </Tag>
              </div>
            }
          >
            {t('테스트케이스')}
          </Title>
          {testrun.testcaseGroups.length < 1 && <EmptyContent border>{t('선택된 테스트케이스가 없습니다.')}</EmptyContent>}
          {testrun.testcaseGroups.length > 0 && (
            <Block className="testcase-list" border padding={false} scroll>
              <Table className="table" cols={['1px', '100%', '1px', '1px']} sticky>
                <THead>
                  <Tr>
                    <Th align="left">{t('테스트케이스 그룹')}</Th>
                    <Th align="left">{t('테스트케이스')}</Th>
                    <Th align="left">{t('테스터')}</Th>
                    <Th align="left">{t('테스트 결과')}</Th>
                  </Tr>
                </THead>
                <Tbody>
                  {testcaseTreeData.map(testcaseGroup => {
                    return (
                      <ReleaseGroupItem
                        key={testcaseGroup.id}
                        testcaseGroup={testcaseGroup}
                        selectedTestcaseIdMap={selectedTestcaseIdMap}
                        releaseNameMap={releaseNameMap}
                        showTester
                        showTestResult
                        onNameClick={(groupId, id) => {
                          setTestcaseViewerInfo({
                            testcaseTemplate: project.testcaseTemplates.find(d => d.id === id),
                            testcaseGroupId: groupId,
                            testcaseGroupTestcaseId: id,
                          });
                        }}
                        userById={userById}
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
          {!(testrun?.messageChannels?.length > 0) && (
            <EmptyContent className="empty-content">
              <div>{t('등록된 메세지 채널이 없습니다.')}</div>
            </EmptyContent>
          )}
          <Block>
            <BlockRow className="testrun-hooks-content">
              <TestrunMessageChannelList messageChannels={testrun?.messageChannels} projectMessageChannels={project?.messageChannels} />
            </BlockRow>
          </Block>
          <Title border={false} marginBottom={false}>
            {t('테스트런 API 훅')}
          </Title>
          <Block>
            <BlockRow className="testrun-hooks-content">
              <TestrunHookTable
                hooks={testrun.hooks}
                onNameClick={hook => {
                  setTestrunHookInfoPopup({ opened: true, data: hook });
                }}
                onResultClick={hook => {
                  setTestrunHookInfoPopup({ opened: true, data: hook });
                }}
              />
            </BlockRow>
          </Block>
          <PageButtons
            onBack={() => {
              navigate(-1);
            }}
            onEdit={() => {
              navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns/${testrunId}/edit`);
            }}
            onCancelIcon=""
          />
        </PageContent>
      </Page>
      {testrunHookInfoPopup.opened && (
        <TestrunHookInfoPopup
          setOpened={value => {
            setTestrunHookInfoPopup({ opened: value });
          }}
          data={testrunHookInfoPopup.data}
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

TestrunInfoPage.defaultProps = {};

TestrunInfoPage.propTypes = {};

export default TestrunInfoPage;
