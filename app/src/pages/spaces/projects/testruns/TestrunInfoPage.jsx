import React, { useEffect, useState } from 'react';
import { Block, Button, EmptyContent, Label, Liner, Page, PageButtons, PageContent, PageTitle, SeqId, Table, Tag, Tbody, Td, Text, Th, THead, Title, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import BlockRow from '@/components/BlockRow/BlockRow';
import ProjectService from '@/services/ProjectService';
import TestrunService from '@/services/TestrunService';
import { CHANNEL_TYPE_CODE, ITEM_TYPE, MESSAGE_CATEGORY, TESTRUN_RESULT_CODE } from '@/constants/constants';
import dateUtil from '@/utils/dateUtil';
import dialogUtil from '@/utils/dialogUtil';
import SpaceProfileService from '@/services/SpaceProfileService';
import './TestrunInfoPage.scss';
import { TestrunHookInfoPopup, TestrunHookTable } from '@/assets';

const labelMinWidth = '120px';

function TestrunInfoPage() {
  const { t } = useTranslation();
  const { projectId, spaceCode, testrunId } = useParams();

  const navigate = useNavigate();

  const [project, setProject] = useState(null);

  const [spaceProfileList, setSpaceProfileList] = useState([]);

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

  const [testrunHookInfoPopup, setTestrunHookInfoPopup] = useState({
    opened: false,
  });

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
                {t('편집')}
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
              <Label minWidth={labelMinWidth}>{t('테스트케이스')}</Label>
            </BlockRow>
            <BlockRow className="testrun-testcases-content">
              {testrun.testcaseGroups?.length < 1 && <Text className="no-user">{t('선택된 테스트케이스가 없습니다.')}</Text>}
              {testrun.testcaseGroups?.length > 0 && (
                <Table cols={['1px', '100%']} border>
                  <THead>
                    <Tr>
                      <Th align="left">{t('테스트케이스 그룹')}</Th>
                      <Th align="left">{t('테스트케이스')}</Th>
                      <Th align="left">{t('테스터')}</Th>
                      <Th align="center">{t('테스트 결과')}</Th>
                    </Tr>
                  </THead>
                  <Tbody>
                    {testrun.testcaseGroups?.map(d => {
                      if (d.testcases?.length > 0) {
                        return (
                          <React.Fragment key={d.id}>
                            {d.testcases?.map((testcase, inx) => {
                              const tester = project.users.find(user => {
                                return user.userId === testcase.testerId;
                              });

                              return (
                                <Tr key={testcase.id}>
                                  {inx === 0 && (
                                    <Td rowSpan={d.testcases.length} className="group-info">
                                      <div className="seq-name">
                                        <div>
                                          <SeqId className="seq-id" size="sm" type={ITEM_TYPE.TESTCASE_GROUP} copy={false}>
                                            {d.seqId}
                                          </SeqId>
                                        </div>
                                        <div>{d.name}</div>
                                      </div>
                                    </Td>
                                  )}
                                  <Td>
                                    <div className="seq-name">
                                      <div>
                                        <SeqId className="seq-id" size="sm" type={ITEM_TYPE.TESTCASE} copy={false}>
                                          {testcase.seqId}
                                        </SeqId>
                                      </div>
                                      <div>{testcase.name}</div>
                                    </div>
                                  </Td>
                                  <Td align="left">{tester?.name}</Td>
                                  <Td align="center">
                                    <Tag size="xs" className={testcase.testResult}>
                                      {TESTRUN_RESULT_CODE[testcase.testResult]}
                                    </Tag>
                                  </Td>
                                </Tr>
                              );
                            })}
                          </React.Fragment>
                        );
                      }

                      return (
                        <Tr key={d.seqId}>
                          <Td className="group-info">
                            <div className="seq-name">
                              <div>
                                <SeqId size="sm" type={ITEM_TYPE.TESTCASE_GROUP} copy={false}>
                                  {d.seqId}
                                </SeqId>
                              </div>
                              <div>{d.name}</div>
                            </div>
                          </Td>
                          <Td />
                          <Td />
                          <Td />
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              )}
            </BlockRow>
          </Block>
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
              {testrun?.messageChannels?.length > 0 && (
                <ul className="message-channels">
                  {testrun.messageChannels?.map((channel, inx) => {
                    const channelInfo = project.messageChannels.find(d => d.id === channel.projectMessageChannelId);

                    if (!channelInfo) {
                      return null;
                    }

                    return (
                      <li key={inx}>
                        <div>
                          <Tag size="sm" color="white" border>
                            {CHANNEL_TYPE_CODE[channelInfo.messageChannelType]}
                          </Tag>
                        </div>
                        <div>{channelInfo.name}</div>
                      </li>
                    );
                  })}
                </ul>
              )}
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
    </>
  );
}

TestrunInfoPage.defaultProps = {};

TestrunInfoPage.propTypes = {};

export default TestrunInfoPage;
