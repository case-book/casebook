import React, { useEffect, useRef, useState } from 'react';
import { Button, Page, PageContent, PageTitle, UserAvatar } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import dialogUtil from '@/utils/dialogUtil';
import { ITEM_TYPE, MESSAGE_CATEGORY } from '@/constants/constants';
import ProjectService from '@/services/ProjectService';
import useStores from '@/hooks/useStores';
import TestrunService from '@/services/TestrunService';
import testcaseUtil from '@/utils/testcaseUtil';
import TestcaseNavigator from '@/pages/spaces/projects/ProjectTestcaseEditPage/TestcaseNavigator/TestcaseNavigator';
import TestRunTestcaseManager from '@/pages/spaces/projects/testruns/TestrunExecutePage/TestRunTestcaseManager/TestRunTestcaseManager';
import SplitPane, { Pane } from 'split-pane-react';
import './TestrunExecutePage.scss';
import useQueryString from '@/hooks/useQueryString';
import ReactTooltip from 'react-tooltip';

const start = new Date();
start.setHours(start.getHours() + 1);
start.setMinutes(0);
start.setSeconds(0);
start.setMilliseconds(0);

const end = new Date();
end.setHours(end.getHours() + 2);
end.setMinutes(0);
end.setSeconds(0);
end.setMilliseconds(0);

function TestrunExecutePage() {
  const { t } = useTranslation();
  const { projectId, spaceCode, testrunId } = useParams();
  const { query, setQuery } = useQueryString();
  const { tester = '', id = null, type } = query;

  const {
    userStore: { user },
    socketStore: { addTopic, removeTopic, addMessageHandler, removeMessageHandler, socketClient },
  } = useStores();

  const navigate = useNavigate();

  const [testcaseGroups, setTestcaseGroups] = useState([]);

  const [project, setProject] = useState(null);

  const [contentLoading, setContentLoading] = useState(false);

  const [content, setContent] = useState(null);

  const [paricipants, setParicipants] = useState([]);

  const lastParicipants = useRef(null);

  const [watcherInfo, setWatcherInfo] = useState({});

  const [sizes, setSizes] = useState(
    (() => {
      const info = JSON.parse(localStorage.getItem('testrun-execute-page-sizes'));
      if (info) {
        return info;
      }

      return [300, 'auto'];
    })(),
  );

  const onChangeSize = info => {
    localStorage.setItem('testrun-execute-page-sizes', JSON.stringify(info));
    setSizes(info);
  };

  const [testrun, setTestrun] = useState({
    seqId: '',
    name: '',
    description: '',
    testrunUsers: [],
    testcaseGroups: [],
    startDateTime: start.getTime(),
    endDateTime: end.getTime(),
    opened: false,
    totalTestcaseCount: true,
    passedTestcaseCount: true,
    failedTestcaseCount: true,
  });

  const onSelect = info => {
    setQuery(info);
  };

  const onChangeTester = info => {
    setQuery({ tester: info });
  };

  const getProject = () => {
    ProjectService.selectProjectInfo(spaceCode, projectId, info => {
      setProject(info);
    });
  };

  useEffect(() => {
    getProject();
  }, [projectId]);

  const join = () => {
    if (socketClient && socketClient.state.connected) {
      socketClient.sendMessage(
        `/pub/api/message/${spaceCode}/projects/${projectId}/testruns/${testrunId}/join`,
        JSON.stringify({
          type: 'JOIN',
        }),
      );
    }
  };

  const watch = testcaseId => {
    if (socketClient && socketClient.state.connected) {
      socketClient.sendMessage(
        `/pub/api/message/${spaceCode}/projects/${projectId}/testruns/${testrunId}/testcases/${testcaseId}/watch`,
        JSON.stringify({
          type: 'WATCH',
        }),
      );
    }
  };

  const leave = () => {
    if (socketClient && socketClient.state.connected) {
      socketClient.sendMessage(
        `/pub/api/message/${spaceCode}/projects/${projectId}/testruns/${testrunId}/leave`,
        JSON.stringify({
          type: 'LEAVE',
        }),
      );
    }
  };

  const getTestrunInfo = () => {
    TestrunService.selectTestrunInfo(spaceCode, projectId, testrunId, info => {
      if (!project) {
        return;
      }

      setTestrun(info);

      if (!info.opened) {
        dialogUtil.setConfirm(
          MESSAGE_CATEGORY.WARNING,
          t('종료된 테스트런'),
          <div>{t('테스트런이 종료되었습니다. 테스트런 리포트로 이동하시겠습니까?')}</div>,
          () => {
            navigate(`/spaces/${spaceCode}/projects/${projectId}/reports/${testrunId}`);
          },
          null,
          t('이동'),
        );
      }

      const filteredTestcaseGroups = info.testcaseGroups?.map(d => {
        return {
          ...d,
          testcases:
            d.testcases?.filter(testcase => {
              if (tester === '') {
                return true;
              }

              if (tester === 'none') {
                return !testcase.testerId;
              }

              return String(testcase.testerId) === String(tester);
            }) || [],
        };
      });

      const groups = testcaseUtil.getTestcaseTreeData(filteredTestcaseGroups, 'testcaseGroupId');
      setTestcaseGroups(groups);
    });
  };

  useEffect(() => {
    if (!project) {
      return;
    }
    getTestrunInfo();
    join();
  }, [project, testrunId]);

  useEffect(() => {
    return () => {
      leave();
    };
  }, [socketClient]);

  useEffect(() => {
    if (!project) {
      return;
    }

    const filteredTestcaseGroups = testrun.testcaseGroups?.map(d => {
      return {
        ...d,
        testcases: d.testcases?.filter(testcase => {
          if (tester === '') {
            return true;
          }

          if (tester === 'none') {
            return !testcase.testerId;
          }

          return String(testcase.testerId) === String(tester);
        }),
      };
    });

    const groups = testcaseUtil.getTestcaseTreeData(filteredTestcaseGroups, 'testcaseGroupId');
    setTestcaseGroups(groups);
  }, [project, tester]);

  const getTestcase = (testrunTestcaseGroupTestcaseId, loading) => {
    if (loading) {
      setContentLoading(true);
    }

    const testcaseGroup = testrun?.testcaseGroups.find(d => d.testcases?.find(testcase => testcase.id === testrunTestcaseGroupTestcaseId));

    if (testcaseGroup) {
      TestrunService.selectTestrunTestcaseGroupTestcase(
        spaceCode,
        projectId,
        testrunId,
        testcaseGroup.id,
        testrunTestcaseGroupTestcaseId,
        info => {
          if (loading) {
            setTimeout(() => {
              setContentLoading(false);
            }, 200);
          }

          setContent(info);
        },
        () => {
          if (loading) {
            setContentLoading(false);
          }
        },
      );
    } else {
      setContentLoading(false);
    }
  };

  const getContent = (loading = true) => {
    if (type === ITEM_TYPE.TESTCASE) {
      getTestcase(Number(id), loading);
      watch(id);
    } else {
      setContent(null);
      setQuery({});
      /*
      setSelectedItemInfo({
        id: null,
        type: null,
        time: null,
      });
       */
    }
  };

  useEffect(() => {
    if (testrun?.id && id) {
      getContent();
    } else {
      setContent(null);
    }
  }, [testrun.id, id]);

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

  const onNotify = () => {
    TestrunService.notifyTestrunProgress(spaceCode, projectId, testrunId, () => {});
  };

  const onChangeComment = (pId, comment, handler) => {
    TestrunService.updateTestrunTestcaseComment(
      spaceCode,
      projectId,
      testrunId,
      content.testrunTestcaseGroupId,
      content.id,
      {
        pId,
        comment,
        testrunTestcaseGroupTestcaseId: content.id,
      },
      info => {
        const nextContent = { ...content };

        if (!nextContent.comments) {
          nextContent.comments = [];
        }

        nextContent.comments.push(info);
        if (handler) {
          handler();
        }

        setContent(nextContent);
      },
    );
  };

  const onDeleteComment = pId => {
    TestrunService.deleteTestrunTestcaseComment(spaceCode, projectId, testrunId, content.testrunTestcaseGroupId, content.id, pId, () => {
      const nextContent = { ...content };
      const nextComments = nextContent.comments.slice(0);

      if (nextComments) {
        const index = nextComments.findIndex(comment => comment.id === pId);
        nextComments.splice(index, 1);
        nextContent.comments = nextComments;

        setContent(nextContent);
      }
    });
  };

  const createTestrunImage = (pId, name, size, pType, file) => {
    return TestrunService.createImage(spaceCode, projectId, testrunId, name, size, pType, file);
  };

  const onSaveTestResultItem = target => {
    TestrunService.updateTestrunResultItem(spaceCode, projectId, testrunId, target.testrunTestcaseGroupTestcaseId, target.testcaseTemplateItemId, target, () => {
      // getTestrunInfo();
      getContent(false);
    });
  };

  const onSaveTestResult = testResult => {
    TestrunService.updateTestrunResult(spaceCode, projectId, testrunId, content.testrunTestcaseGroupId, content.id, testResult, done => {
      if (done) {
        dialogUtil.setMessage(MESSAGE_CATEGORY.WARNING, t('테스트 완료'), t('모든 테스트케이스의 결과가 입력되었습니다. 테스트런 리포트 화면으로 이동합니다.'), () => {
          navigate(`/spaces/${spaceCode}/projects/${projectId}/reports/${testrunId}`);
        });
      }
    });
  };

  const onSaveTester = testerId => {
    TestrunService.updateTestrunTester(spaceCode, projectId, testrunId, content.testrunTestcaseGroupId, content.id, testerId, () => {
      getTestrunInfo();
    });
  };

  const onRandomTester = (userId, targetId, target, reason) => {
    TestrunService.updateTestrunTesterRandom(spaceCode, projectId, testrunId, userId, targetId, target, reason, () => {
      getTestcase(Number(targetId), true);
      dialogUtil.setMessage(MESSAGE_CATEGORY.INFO, t('테스트 변경 완료'), t('테스터가 변경되었습니다.'));
    });
  };

  const onMessage = info => {
    const { data } = info;

    switch (data.type) {
      case 'TESTRUN-PARTICIPANTS': {
        setParicipants(data?.data?.participants);
        lastParicipants.current = data?.data?.participants;
        break;
      }

      case 'TESTRUN-USER-JOIN': {
        const nextParicipants = lastParicipants.current?.slice(0);
        const userExist = lastParicipants.current?.find(d => d.id === data?.data?.participant.id);

        if (nextParicipants && !userExist) {
          nextParicipants.push(data?.data?.participant);
          setParicipants(nextParicipants);
          lastParicipants.current = nextParicipants;
        }

        break;
      }

      case 'TESTRUN-USER-LEAVE': {
        if (lastParicipants.current) {
          const nextParicipants = lastParicipants.current?.slice(0);
          const userIndex = nextParicipants.findIndex(d => d.id === data?.data?.participant.id);

          if (userIndex > -1) {
            nextParicipants.splice(userIndex, 1);

            setParicipants(nextParicipants);
            lastParicipants.current = nextParicipants;
          }

          const nextWatcherInfo = { ...watcherInfo };

          const testcaseIds = Object.keys(nextWatcherInfo);
          for (let inx = testcaseIds.length - 1; inx >= 0; inx -= 1) {
            for (let jnx = nextWatcherInfo[testcaseIds[inx]].length - 1; jnx >= 0; jnx -= 1) {
              if (nextWatcherInfo[testcaseIds[inx]][jnx].userId === data?.data?.participant.userId) {
                nextWatcherInfo[testcaseIds[inx]].splice(jnx, 1);
              }
            }
          }

          setWatcherInfo(nextWatcherInfo);
        }

        break;
      }

      case 'TESTRUN-TESTCASE-WATCH': {
        const nextWatcherInfo = { ...watcherInfo };

        if (!nextWatcherInfo[data.data.testcaseId]) {
          nextWatcherInfo[data.data.testcaseId] = [];
        }

        Object.keys(nextWatcherInfo).forEach(testcaseId => {
          if (nextWatcherInfo[testcaseId]) {
            const index = nextWatcherInfo[testcaseId].findIndex(d => d.userId === data.data.userId);
            if (index > -1) {
              nextWatcherInfo[testcaseId].splice(index, 1);
            }
          }
        });

        const exist = nextWatcherInfo[data.data.testcaseId].find(d => d.userId === data.data.userId);
        if (!exist) {
          nextWatcherInfo[data.data.testcaseId].push({
            userId: data.data.userId,
            userEmail: data.data.userEmail,
          });
        }
        setWatcherInfo(nextWatcherInfo);

        break;
      }

      case 'TESTRUN-TESTCASE-RESULT-CHANGED': {
        const nextTestrun = { ...testrun };
        for (let i = 0; i < nextTestrun.testcaseGroups.length; i += 1) {
          const target = nextTestrun.testcaseGroups[i].testcases?.find(testcase => testcase.id === data.data.testrunTestcaseGroupTestcaseId);
          if (target) {
            target.testResult = data.data.testResult;
            break;
          }
        }

        setTestrun(nextTestrun);

        if (type === ITEM_TYPE.TESTCASE && Number(id) === content.id) {
          const nextContent = { ...content };
          nextContent.testResult = data.data.testResult;
          setContent(nextContent);
        }

        const filteredTestcaseGroups = nextTestrun.testcaseGroups?.map(d => {
          return {
            ...d,
            testcases:
              d.testcases?.filter(testcase => {
                if (tester === '') {
                  return true;
                }

                if (tester === 'none') {
                  return !testcase.testerId;
                }

                return String(testcase.testerId) === String(tester);
              }) || [],
          };
        });

        const groups = testcaseUtil.getTestcaseTreeData(filteredTestcaseGroups, 'testcaseGroupId');
        setTestcaseGroups(groups);

        break;
      }

      case 'TESTRUN-TESTCASE-TESTER-CHANGED': {
        const nextTestrun = { ...testrun };
        for (let i = 0; i < nextTestrun.testcaseGroups.length; i += 1) {
          const target = nextTestrun.testcaseGroups[i].testcases?.find(testcase => testcase.id === data.data.testrunTestcaseGroupTestcaseId);
          if (target) {
            target.testerId = data.data.testerId;
            break;
          }
        }

        if (type === ITEM_TYPE.TESTCASE && data.data.testrunTestcaseGroupTestcaseId === content.id) {
          const nextContent = { ...content };
          nextContent.testerId = data.data.testerId;
          setContent(nextContent);
        }

        setTestrun(nextTestrun);
        break;
      }

      default: {
        break;
      }
    }
  };

  useEffect(() => {
    if (user?.id) {
      ReactTooltip.rebuild();
      addTopic(`/sub/projects/${projectId}/testruns/${testrunId}`);
      addTopic(`/sub/projects/${projectId}/testruns/${testrunId}/users/${user.id}`);
      addMessageHandler('TestrunExecutePage', onMessage);
    }

    return () => {
      removeTopic(`/sub/projects/${projectId}/testruns/${testrunId}`);
      removeTopic(`/sub/projects/${projectId}/testruns/${testrunId}/users/${user.id}`);
      removeMessageHandler('TestrunExecutePage');
    };
  }, [user, paricipants, watcherInfo, testrun, socketClient, content]);

  return (
    <Page className="testrun-execute-page-wrapper">
      <PageTitle
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
            to: `/spaces/${spaceCode}/projects/${projectId}/testruns/${testrunId}`,
            text: testrun?.name,
          },
        ]}
        control={
          testrun.opened && (
            <div>
              <Button size="sm" color="primary" onClick={onNotify}>
                {t('알림 메세지 전송')}
              </Button>
              <Button size="sm" color="warning" onClick={onClosed}>
                {t('테스트런 종료')}
              </Button>
            </div>
          )
        }
        onListClick={() => {
          navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns`);
        }}
      >
        <div className="page-title">
          <div>{testrun.name}</div>
          <div className="testrun-title-content">
            <div className="separator">
              <div />
            </div>
            <div className="label">{t('참여중')}</div>
            <div className="participants">
              <ul>
                {paricipants.map(paricipant => {
                  const paricipantUser = project.users?.find(d => d.userId === paricipant.userId);

                  return (
                    <li key={paricipant.id} data-tip={paricipant.userName}>
                      {paricipantUser?.avatarInfo && <UserAvatar avatarInfo={paricipantUser?.avatarInfo} size={36} rounded fill />}
                      {!paricipantUser?.avatarInfo && (
                        <div className="user-email-char">
                          <span>{paricipant.userEmail?.substring(0, 1)}</span>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </PageTitle>
      <PageContent className="page-content">
        <SplitPane sizes={sizes} onChange={onChangeSize}>
          <Pane className="testcase-navigator-content" minSize={300}>
            <TestcaseNavigator
              user={user}
              users={project?.users}
              testcaseGroups={testcaseGroups}
              showTestResult
              enableDrag={false}
              selectedItemInfo={{ id: Number(id), type }}
              onSelect={onSelect}
              userFilter={tester}
              setUserFilter={onChangeTester}
              watcherInfo={watcherInfo}
            />
          </Pane>
          <Pane className="testrun-testcase-manager-content" minSize={200}>
            {id && type === ITEM_TYPE.TESTCASE && (
              <TestRunTestcaseManager
                spaceCode={spaceCode}
                projectId={projectId}
                project={project}
                testrunId={testrunId}
                contentLoading={contentLoading}
                content={content || {}}
                testcaseTemplates={project?.testcaseTemplates}
                setContent={d => {
                  setContent(d);
                }}
                onSaveTestResultItem={onSaveTestResultItem}
                onSaveResult={onSaveTestResult}
                onSaveTester={onSaveTester}
                onRandomTester={onRandomTester}
                onSaveComment={onChangeComment}
                onDeleteComment={onDeleteComment}
                users={project?.users.map(u => {
                  return {
                    ...u,
                    id: u.userId,
                  };
                })}
                createTestrunImage={createTestrunImage}
              />
            )}
          </Pane>
        </SplitPane>
      </PageContent>
    </Page>
  );
}

TestrunExecutePage.defaultProps = {};

TestrunExecutePage.propTypes = {};

export default TestrunExecutePage;
