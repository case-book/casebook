import React, { useEffect, useRef, useState } from 'react';
import { Block, Button, CloseIcon, Info, Liner, Page, PageContent, PageTitle, Table, Tbody, Th, THead, Title, Tr, UserAvatar } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import SplitPane from 'split-pane-react';
import { useParams } from 'react-router';
import ProjectService from '@/services/ProjectService';
import TestrunService from '@/services/TestrunService';
import { MESSAGE_CATEGORY, TESTRUN_RESULT_CODE } from '@/constants/constants';
import dateUtil from '@/utils/dateUtil';
import dialogUtil from '@/utils/dialogUtil';
import testcaseUtil from '@/utils/testcaseUtil';
import useQueryString from '@/hooks/useQueryString';
import TestrunResultViewerPopup from '@/pages/spaces/projects/reports/ReportInfoPage/TestrunResultViewerPopup';
import { Editor } from '@toast-ui/react-editor';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import useStores from '@/hooks/useStores';
import TestrunTestcaseListViewerPopup from '@/pages/spaces/projects/reports/ReportInfoPage/TestrunTestcaseListViewerPopup';
import { getBaseURL } from '@/utils/configUtil';
import { CommentList } from '@/assets';
import './ReportInfoPage.scss';

import CommentBadge from '@/pages/spaces/projects/reports/ReportInfoPage/CommentBadge';
import classNames from 'classnames';
import ReportTestcaseGroupItem from '@/pages/spaces/projects/reports/ReportInfoPage/ReportTestcaseGroupItem';

function ReportInfoPage() {
  const { t } = useTranslation();

  const {
    themeStore: { theme },
  } = useStores();

  const { projectId, spaceCode, reportId } = useParams();

  const navigate = useNavigate();

  const [project, setProject] = useState(null);

  const [testrun, setTestrun] = useState({});

  const [showComment, setShowComment] = useState(
    (() => {
      const value = localStorage.getItem('reportInfoPageComment');
      if (!value) {
        return true;
      }
      return value === 'true';
    })(),
  );

  const [userById, setUserById] = useState({});

  const [testcaseGroups, setTestcaseGroups] = useState([]);

  const [testerProgressList, setTesterProgressList] = useState([]);

  const { query, setQuery } = useQueryString();

  const editor = useRef(null);

  const [comment, setComment] = useState('');

  const [testrunCommentList, setTestrunCommentList] = useState([]);

  const [sizes, setSizes] = useState(['1000px', '340px']);

  const { groupId: testrunTestcaseGroupId, id: testrunTestcaseGroupTestcaseId } = query;

  const [testcaseViewerInfo, setTestcaseViewerInfo] = useState({
    opened: false,
    status: null,
    userId: null,
    hasComment: false,
  });

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
    ProjectService.selectProjectInfo(
      spaceCode,
      projectId,
      info => {
        setProject(info);

        setUserById(
          info.users.reduce((acc, user) => {
            acc[user.userId] = user;
            return acc;
          }, {}),
        );

        TestrunService.selectTestrunInfo(spaceCode, projectId, reportId, data => {
          let passedTestcaseHasCommentCount = 0;
          let failedTestcaseHasCommentCount = 0;
          let untestableTestcaseHasCommentCount = 0;
          let totalTestcaseHasCommentCount = 0;
          let untestedTestcaseHasCommentCount = 0;

          if (data.testcaseGroups) {
            data.testcaseGroups.forEach(group => {
              if (group.testcases) {
                group.testcases.forEach(testcase => {
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
          }

          setTestrun({
            ...data,
            passedTestcaseHasCommentCount,
            failedTestcaseHasCommentCount,
            untestableTestcaseHasCommentCount,
            untestedTestcaseHasCommentCount,
            totalTestcaseHasCommentCount,
            startTime: dateUtil.getHourMinuteTime(data.startTime),
            testedCount: data.passedTestcaseCount + data.failedTestcaseCount + data.untestableTestcaseCount,
          });

          const tester = {};

          data.testcaseGroups?.forEach(testcaseGroup => {
            testcaseGroup.testcases?.forEach(testcase => {
              if (!tester[testcase.testerId]) {
                const user = info.users.find(u => u.userId === testcase.testerId);
                tester[testcase.testerId] = {
                  userId: testcase.testerId,
                  name: user?.name,
                  avatarInfo: user?.avatarInfo,
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
      },
      null,
      false,
    );

    TestrunService.selectTestrunCommentList(
      spaceCode,
      projectId,
      reportId,
      list => {
        setTestrunCommentList(list);
      },
      null,
      false,
    );
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

  const onClickTestResultCount = (status, hasComment, e) => {
    if (e) {
      e.preventDefault();
    }
    setTestcaseViewerInfo({
      opened: true,
      status,
      userId: null,
      hasComment,
    });
  };

  const onClickUserTestResultCount = (e, pUserId, status) => {
    e.preventDefault();
    setTestcaseViewerInfo({
      opened: true,
      status,
      userId: pUserId,
    });
  };

  const createComment = text => {
    TestrunService.createTestrunComment(spaceCode, projectId, reportId, text, data => {
      const nextTestrunCommentList = testrunCommentList.slice(0);
      nextTestrunCommentList.push(data);
      setTestrunCommentList(nextTestrunCommentList);
    });
  };

  const createTestrunImage = (name, size, pType, file) => {
    return TestrunService.createImage(spaceCode, projectId, reportId, name, size, pType, file);
  };

  const deleteComment = commentId => {
    TestrunService.deleteTestrunComment(spaceCode, projectId, reportId, commentId, () => {
      const nextTestrunCommentList = testrunCommentList.slice(0);
      const inx = nextTestrunCommentList.findIndex(d => d.id === commentId);
      if (inx > -1) {
        nextTestrunCommentList.splice(inx, 1);
      }
      setTestrunCommentList(nextTestrunCommentList);
    });
  };

  const onDelete = () => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('리포트 삭제'),
      <div>{t('@ 테스트런 및 리포트와 관련된 모든 정보가 삭제됩니다. 삭제하시겠습니까?', { name: testrun.name })}</div>,
      () => {
        TestrunService.deleteTestrunInfo(spaceCode, projectId, reportId, () => {
          navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns`);
        });
      },
      null,
      t('삭제'),
      null,
      'danger',
    );
  };

  const toggleComment = () => {
    if (showComment) {
      setShowComment(false);
      localStorage.setItem('reportInfoPageComment', 'false');
    } else {
      setShowComment(true);
      localStorage.setItem('reportInfoPageComment', 'true');
    }
  };

  useEffect(() => {
    if (showComment) {
      setSizes(['auto', '340px']);
    } else {
      setSizes(['auto', '0px']);
    }
  }, [showComment]);

  return (
    <>
      <Page className="report-info-page-wrapper">
        <PageTitle
          breadcrumbs={[
            { to: '/', text: t('HOME') },
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
              to: `/spaces/${spaceCode}/projects/${projectId}/reports`,
              text: t('리포트'),
            },
            {
              to: `/spaces/${spaceCode}/projects/${projectId}/reports/${reportId}`,
              text: testrun?.name,
            },
          ]}
          control={
            <div>
              <Button size="sm" onClick={toggleComment}>
                {t('테스트런 코멘트')}
              </Button>
              <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 0.5rem 0 0rem" />
              <Button size="sm" onClick={() => {}}>
                {t('리포트 공유')}
              </Button>
              <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 0.5rem 0 0rem" />
              <Button size="sm" color="danger" onClick={onDelete}>
                {t('리포트 삭제')}
              </Button>
              <Button color="warning" onClick={onOpened}>
                {t('다시 열기')}
              </Button>
            </div>
          }
          onListClick={() => {
            navigate(`/spaces/${spaceCode}/projects/${projectId}/reports`);
          }}
        >
          {t('리포트')}
        </PageTitle>
        <PageContent className="page-content" flex>
          <SplitPane sizes={sizes} onChange={setSizes}>
            <div className="info-layout scrollbar-sm">
              <div>
                <Title border={false} marginBottom={false}>
                  {t('테스트런')}
                </Title>
                <Block>
                  <div className="text-summary">
                    <div className="row">
                      <div className="label">{t('이름')}</div>
                      <div>{testrun?.name}</div>
                    </div>
                    <div className="row desc">
                      <div className="label">{t('설명')}</div>
                      <div>
                        <div className="description">{testrun?.description}</div>
                      </div>
                    </div>
                  </div>
                </Block>
                <Title border={false} marginBottom={false}>
                  {t('테스트 결과 요약')}
                </Title>
                <Block>
                  <Info className="summary" rounded={false}>
                    <span className="range">
                      {t('@부터 @까지 @명의 테스터가 테스트를 진행했습니다.', {
                        from: dateUtil.getDateString(testrun.startDateTime),
                        to: dateUtil.getEndDateString(testrun.startDateTime, testrun.closedDate || testrun.endDateTime),
                        count: testrun.testrunUsers?.length || 0,
                      })}
                    </span>
                  </Info>
                  <div className="testrun-result-count">
                    <div>
                      <div>{t('전체')}</div>
                      <div className="count">
                        <Link
                          className="ALL"
                          to="/"
                          onClick={e => {
                            onClickTestResultCount(null, false, e);
                          }}
                        >
                          {testrun.totalTestcaseCount}
                        </Link>
                      </div>
                      <CommentBadge
                        count={testrun.totalTestcaseHasCommentCount}
                        onClick={() => {
                          onClickTestResultCount(null, true);
                        }}
                      />
                    </div>
                    <div>
                      <div>{TESTRUN_RESULT_CODE.PASSED}</div>
                      <div className="count">
                        <Link
                          className="PASSED"
                          to="/"
                          onClick={e => {
                            onClickTestResultCount('PASSED', false, e);
                          }}
                        >
                          {testrun.passedTestcaseCount}
                        </Link>
                      </div>
                      <CommentBadge
                        count={testrun.passedTestcaseHasCommentCount}
                        onClick={() => {
                          onClickTestResultCount('PASSED', true);
                        }}
                      />
                    </div>
                    <div>
                      <div>{TESTRUN_RESULT_CODE.FAILED}</div>
                      <div className="count">
                        <Link
                          className="FAILED"
                          to="/"
                          onClick={e => {
                            onClickTestResultCount('FAILED', false, e);
                          }}
                        >
                          {testrun.failedTestcaseCount}
                        </Link>
                      </div>
                      <CommentBadge
                        count={testrun.failedTestcaseHasCommentCount}
                        onClick={() => {
                          onClickTestResultCount('FAILED', true);
                        }}
                      />
                    </div>
                    <div>
                      <div>{TESTRUN_RESULT_CODE.UNTESTABLE}</div>
                      <div className="count">
                        <Link
                          className="UNTESTABLE"
                          to="/"
                          onClick={e => {
                            onClickTestResultCount('UNTESTABLE', false, e);
                          }}
                        >
                          {testrun.untestableTestcaseCount}
                        </Link>
                      </div>
                      <CommentBadge
                        count={testrun.untestableTestcaseHasCommentCount}
                        onClick={() => {
                          onClickTestResultCount('UNTESTABLE', true);
                        }}
                      />
                    </div>
                    <div>
                      <div>{TESTRUN_RESULT_CODE.UNTESTED}</div>
                      <div className="count">
                        <Link
                          className="UNTESTED"
                          to="/"
                          onClick={e => {
                            onClickTestResultCount('UNTESTED', false, e);
                          }}
                        >
                          {!Number.isNaN(testrun.totalTestcaseCount - testrun.testedCount) ? testrun.totalTestcaseCount - testrun.testedCount : ''}
                        </Link>
                      </div>
                      <CommentBadge
                        count={testrun.untestedTestcaseHasCommentCount}
                        onClick={() => {
                          onClickTestResultCount('UNTESTED', true);
                        }}
                      />
                    </div>
                  </div>
                </Block>
                <Title border={false} marginBottom={false}>
                  {t('테스터별 테스트 결과')}
                </Title>
                <Block>
                  <div className="summary-content">
                    <div className="tester-summary">
                      <ul>
                        {testerProgressList.map((testerProgress, inx) => {
                          const testedCount = testerProgress.TOTAL_COUNT - testerProgress.UNTESTED;
                          const totalCount = testerProgress.TOTAL_COUNT;
                          const testedPercentage = Math.round((testedCount / totalCount) * 1000) / 10;

                          const passPercentage = testerProgress.PASSED > 0 ? (testerProgress.PASSED / totalCount) * 100 : 0;
                          const failPercentage = testerProgress.FAILED > 0 ? (testerProgress.FAILED / totalCount) * 100 : 0;
                          const untestablePercentage = testerProgress.UNTESTABLE > 0 ? (testerProgress.UNTESTABLE / totalCount) * 100 : 0;
                          const untestedPercentage = testerProgress.UNTESTED > 0 ? (testerProgress.UNTESTED / totalCount) * 100 : 0;

                          return (
                            <li className="tester" key={inx}>
                              <div className="user-icon">
                                <UserAvatar avatarInfo={testerProgress.avatarInfo} size={36} rounded fill outline />
                              </div>
                              <div className="user-name">
                                <Link
                                  to="/"
                                  className="hoverable"
                                  onClick={e => {
                                    onClickUserTestResultCount(e, testerProgress.userId);
                                  }}
                                >
                                  {testerProgress.name}
                                </Link>
                              </div>
                              <div className="progress">
                                <div>
                                  <span>{t('진행률')}</span>
                                </div>
                                <div className={classNames('data', { warning: testedPercentage < 100 })}>
                                  <div className="percentage">{testedPercentage}%</div>
                                  <div className="count">
                                    (<span>{testedCount}</span>/<span>{totalCount}</span>)
                                  </div>
                                </div>
                              </div>
                              <div className="count-summary">
                                <div className="bar">
                                  <div
                                    onClick={e => {
                                      onClickUserTestResultCount(e, testerProgress.userId, 'PASSED');
                                    }}
                                  >
                                    <div className="PASSED" style={{ height: `${passPercentage}%` }} />
                                  </div>
                                  <div
                                    onClick={e => {
                                      onClickUserTestResultCount(e, testerProgress.userId, 'FAILED');
                                    }}
                                  >
                                    <div className="FAILED" style={{ height: `${failPercentage}%` }} />
                                  </div>
                                  <div
                                    onClick={e => {
                                      onClickUserTestResultCount(e, testerProgress.userId, 'UNTESTABLE');
                                    }}
                                  >
                                    <div className="UNTESTABLE" style={{ height: `${untestablePercentage}%` }} />
                                  </div>
                                  <div
                                    onClick={e => {
                                      onClickUserTestResultCount(e, testerProgress.userId, 'UNTESTED');
                                    }}
                                  >
                                    <div className="UNTESTED" style={{ height: `${untestedPercentage}%` }} />
                                  </div>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </Block>
                <Title border={false} marginBottom={false}>
                  {t('테스트 결과')}
                </Title>
                <Block className="testcase-list" border padding={false} scroll>
                  <Table className="table" cols={['1px', '100%', '1px']} sticcd apky>
                    <THead>
                      <Tr>
                        <Th align="left">{t('테스트케이스 그룹')}</Th>
                        <Th align="left">{t('테스트케이스')}</Th>
                        <Th align="left">{t('테스터')}</Th>
                        <Th align="left">{t('테스트 결과')}</Th>
                        <Th align="center">{t('코멘트')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      {testcaseGroups.map(testcaseGroup => {
                        return (
                          <ReportTestcaseGroupItem
                            key={testcaseGroup.id}
                            testcaseGroup={testcaseGroup}
                            userById={userById}
                            onNameClick={(groupId, id) => {
                              setQuery({ groupId, id });
                            }}
                          />
                        );
                      })}
                    </Tbody>
                  </Table>
                </Block>
              </div>
            </div>
            {showComment && (
              <div className="comment-layout">
                <Title
                  border={false}
                  marginBottom={false}
                  control={
                    <CloseIcon
                      onClick={() => {
                        toggleComment();
                      }}
                    />
                  }
                >
                  {t('테스트런 코멘트')}
                </Title>
                <Block className="editor-block scrollbar-sm">
                  <div className="scroller">
                    <CommentList onDeleteComment={deleteComment} comments={testrunCommentList} />
                  </div>
                </Block>
                <Block className="comment-editor">
                  <Editor
                    key={theme}
                    ref={editor}
                    theme={theme === 'DARK' ? 'dark' : 'white'}
                    placeholder={t('내용을 입력해주세요.')}
                    previewStyle="vertical"
                    height="160px"
                    initialEditType="wysiwyg"
                    plugins={[colorSyntax]}
                    autofocus={false}
                    toolbarItems={[
                      ['heading', 'bold', 'italic', 'strike'],
                      ['hr', 'quote'],
                      ['ul', 'ol', 'task', 'indent', 'outdent'],
                      ['table', 'image', 'link'],
                      ['code', 'codeblock'],
                    ]}
                    hooks={{
                      addImageBlobHook: async (blob, callback) => {
                        const result = await createTestrunImage(blob.name, blob.size, blob.type, blob);
                        callback(`${getBaseURL()}/api/${spaceCode}/projects/${projectId}/images/${result.data.id}?uuid=${result.data.uuid}`);
                      },
                    }}
                    initialValue={comment || ''}
                    onChange={() => {
                      setComment(editor.current?.getInstance()?.getHTML());
                    }}
                  />
                  <div className="buttons">
                    <Button
                      outline
                      onClick={() => {
                        setComment('');
                        editor.current?.getInstance().setHTML('');
                      }}
                      size="sm"
                    >
                      {t('취소')}
                    </Button>
                    <Button
                      outline
                      size="sm"
                      onClick={() => {
                        if (comment) {
                          createComment(comment);
                          setComment('');
                          editor.current?.getInstance().setHTML('');
                        }
                      }}
                    >
                      {t('코멘트 추가')}
                    </Button>
                  </div>
                </Block>
              </div>
            )}
          </SplitPane>
        </PageContent>
      </Page>

      {testcaseViewerInfo.opened && (
        <TestrunTestcaseListViewerPopup
          project={project}
          testcaseGroups={testcaseGroups}
          users={project?.users.map(u => {
            return {
              ...u,
              id: u.userId,
            };
          })}
          setOpened={val => {
            setTestcaseViewerInfo({
              ...popupInfo,
              opened: val,
            });
            // setQuery({ groupId: null, id: null });
          }}
          onItemClick={q => {
            setQuery(q);
          }}
          userId={testcaseViewerInfo.userId}
          status={testcaseViewerInfo.status}
          hasComment={testcaseViewerInfo.hasComment}
          resultViewOpened={popupInfo.opened}
        />
      )}
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
