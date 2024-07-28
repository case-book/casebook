import React, { useEffect, useRef, useState } from 'react';
import { Block, Button, Page, PageContent, PageTitle, Tag, Title, UserAvatar } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
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

function ReportInfoPage() {
  const { t } = useTranslation();

  const {
    themeStore: { theme },
  } = useStores();

  const { projectId, spaceCode, reportId } = useParams();

  const navigate = useNavigate();

  const [project, setProject] = useState(null);

  const [testrun, setTestrun] = useState({});

  const [testcaseGroups, setTestcaseGroups] = useState([]);

  const [testerProgressList, setTesterProgressList] = useState([]);

  const { query, setQuery } = useQueryString();

  const editor = useRef(null);

  const [comment, setComment] = useState('');

  const [testrunCommentList, setTestrunCommentList] = useState([]);

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

  const onClickTestResultCount = (e, status, hasComment) => {
    e.preventDefault();
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

  return (
    <>
      <Page className="report-info-page-wrapper">
        <PageTitle
          control={
            <Button color="warning" onClick={onOpened}>
              {t('테스트런 재오픈')}
            </Button>
          }
          onListClick={() => {
            navigate(`/spaces/${spaceCode}/projects/${projectId}/reports`);
          }}
        >
          &apos;{testrun?.name}&apos; {t('리포트')}
        </PageTitle>
        <PageContent className="page-content">
          <div className="layout">
            <div className="info-layout">
              <Title border={false} marginBottom={false}>
                {t('테스트런 정보')}
              </Title>
              <Block>
                <div className="text-summary">
                  <div className="row">
                    <div className="label">요약</div>
                    <div>
                      <span className="range">
                        {t('@부터 @까지', {
                          from: dateUtil.getDateString(testrun.startDateTime),
                          to: dateUtil.getEndDateString(testrun.startDateTime, testrun.closedDate || testrun.endDateTime),
                        })}
                      </span>
                      {testrun.testrunUsers?.map(d => {
                        return (
                          <Tag className="tester" size="xs" key={d.userId} color="white" border>
                            {d.name}
                          </Tag>
                        );
                      })}
                      <span>{t('@명의 테스터가 테스트를 진행했습니다.', { count: testrun.testrunUsers?.length || 0 })}</span>
                    </div>
                  </div>
                  <div className="row desc">
                    <div className="label">설명</div>
                    <div>
                      <div className="description">{testrun?.description}</div>
                    </div>
                  </div>
                </div>
              </Block>
              <Title border={false} marginBottom={false} paddingBottom={false}>
                {t('테스트 결과 요약')}
              </Title>
              <Block>
                <div className="summary-content report-metric">
                  <div className="result-summary">
                    <div>
                      <div className="label">{t('수행률')}</div>
                      <div className="progress-info">
                        <div
                          className="progress-bar"
                          style={{
                            width: `${testrun.totalTestcaseCount ? (testrun.testedCount / testrun.totalTestcaseCount) * 100 : 0}%`,
                          }}
                        />
                        <div className="progress-percentage">{testrun.totalTestcaseCount ? Math.round((testrun.testedCount / testrun.totalTestcaseCount) * 1000) / 10 : 0}%</div>
                        <div className="progress-count">
                          (<span>{testrun.testedCount}</span>/<span>{testrun.totalTestcaseCount}</span>)
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="label">{t('성공률')}</div>
                      <div className="progress-info">
                        <div
                          className="progress-bar"
                          style={{
                            width: `${testrun.totalTestcaseCount ? (testrun.passedTestcaseCount / testrun.totalTestcaseCount) * 100 : 0}%`,
                          }}
                        />
                        <div className="progress-percentage">{testrun.totalTestcaseCount ? Math.round((testrun.passedTestcaseCount / testrun.totalTestcaseCount) * 1000) / 10 : 0}%</div>
                        <div className="progress-count">
                          (<span>{testrun.passedTestcaseCount}</span>/<span>{testrun.totalTestcaseCount}</span>)
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="summary-separator">
                    <div />
                  </div>
                  <div className="tester-summary scrollbar-sm">
                    {testerProgressList.map((testerProgress, inx) => {
                      const testedCount = testerProgress.TOTAL_COUNT - testerProgress.UNTESTED;
                      const totalCount = testerProgress.TOTAL_COUNT;
                      const testedPercentage = Math.round((testedCount / totalCount) * 1000) / 10;

                      return (
                        <div className="summary-box tester" key={inx}>
                          <div className="count-info">
                            <div className="user-icon">
                              <UserAvatar avatarInfo={testerProgress.avatarInfo} size={36} rounded fill outline />
                            </div>
                            <div className="label">
                              <Link
                                to="/"
                                onClick={e => {
                                  onClickUserTestResultCount(e, testerProgress.userId);
                                }}
                              >
                                {testerProgress.name}
                              </Link>
                            </div>
                            <div className="progress-bar">
                              <div
                                style={{
                                  width: `${testedPercentage}%`,
                                }}
                              />
                            </div>
                            <div className="progress-percentage">{testedPercentage}%</div>
                            <div className="progress-count">
                              (<span>{testedCount}</span>/<span>{totalCount}</span>)
                            </div>
                            <div className="result-count">
                              <Link
                                className="PASSED"
                                to="/"
                                onClick={e => {
                                  onClickUserTestResultCount(e, testerProgress.userId, 'PASSED');
                                }}
                              >
                                {testerProgress.PASSED}
                              </Link>
                              <Link
                                className="FAILED"
                                to="/"
                                onClick={e => {
                                  onClickUserTestResultCount(e, testerProgress.userId, 'FAILED');
                                }}
                              >
                                {testerProgress.FAILED}
                              </Link>
                              <Link
                                className="UNTESTABLE"
                                to="/"
                                onClick={e => {
                                  onClickUserTestResultCount(e, testerProgress.userId, 'UNTESTABLE');
                                }}
                              >
                                {testerProgress.UNTESTABLE}
                              </Link>
                              <Link
                                className="UNTESTED"
                                to="/"
                                onClick={e => {
                                  onClickUserTestResultCount(e, testerProgress.userId, 'UNTESTED');
                                }}
                              >
                                {testerProgress.UNTESTED}
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Block>
              <Title border={false} marginBottom={false}>
                {t('테스트 결과')}
              </Title>
              <Block>
                <div className="testrun-result-count scrollbar-sm">
                  <div>
                    <div>{t('전체')}</div>
                    <div className="count">
                      <Link
                        className="ALL"
                        to="/"
                        onClick={e => {
                          onClickTestResultCount(e, null, false);
                        }}
                      >
                        {testrun.totalTestcaseCount}
                      </Link>
                    </div>
                    <div className="has-comment">
                      <Link
                        className="ALL"
                        to="/"
                        onClick={e => {
                          onClickTestResultCount(e, null, true);
                        }}
                      >
                        {t('@ 코멘트', { count: testrun.totalTestcaseHasCommentCount })}
                      </Link>
                    </div>
                  </div>
                  <div>
                    <div>{TESTRUN_RESULT_CODE.PASSED}</div>
                    <div className="count">
                      <Link
                        className="PASSED"
                        to="/"
                        onClick={e => {
                          onClickTestResultCount(e, 'PASSED', false);
                        }}
                      >
                        {testrun.passedTestcaseCount}
                      </Link>
                    </div>
                    <div className="has-comment">
                      <Link
                        className="ALL"
                        to="/"
                        onClick={e => {
                          onClickTestResultCount(e, 'PASSED', true);
                        }}
                      >
                        {t('@ 코멘트', { count: testrun.passedTestcaseHasCommentCount })}
                      </Link>
                    </div>
                  </div>
                  <div>
                    <div>{TESTRUN_RESULT_CODE.FAILED}</div>
                    <div className="count">
                      <Link
                        className="FAILED"
                        to="/"
                        onClick={e => {
                          onClickTestResultCount(e, 'FAILED', false);
                        }}
                      >
                        {testrun.failedTestcaseCount}
                      </Link>
                    </div>
                    <div className="has-comment">
                      <Link
                        className="ALL"
                        to="/"
                        onClick={e => {
                          onClickTestResultCount(e, 'FAILED', true);
                        }}
                      >
                        {t('@ 코멘트', { count: testrun.failedTestcaseHasCommentCount })}
                      </Link>
                    </div>
                  </div>
                  <div>
                    <div>{TESTRUN_RESULT_CODE.UNTESTABLE}</div>
                    <div className="count">
                      <Link
                        className="UNTESTABLE"
                        to="/"
                        onClick={e => {
                          onClickTestResultCount(e, 'UNTESTABLE', false);
                        }}
                      >
                        {testrun.untestableTestcaseCount}
                      </Link>
                    </div>
                    <div className="has-comment">
                      <Link
                        className="ALL"
                        to="/"
                        onClick={e => {
                          onClickTestResultCount(e, 'UNTESTABLE', true);
                        }}
                      >
                        {t('@ 코멘트', { count: testrun.untestableTestcaseHasCommentCount })}
                      </Link>
                    </div>
                  </div>
                  <div>
                    <div>{TESTRUN_RESULT_CODE.UNTESTED}</div>
                    <div className="count">
                      <Link
                        className="UNTESTED"
                        to="/"
                        onClick={e => {
                          onClickTestResultCount(e, 'UNTESTED', false);
                        }}
                      >
                        {!Number.isNaN(testrun.totalTestcaseCount - testrun.testedCount) ? testrun.totalTestcaseCount - testrun.testedCount : ''}
                      </Link>
                    </div>
                    <div className="has-comment">
                      <Link
                        className="ALL"
                        to="/"
                        onClick={e => {
                          onClickTestResultCount(e, 'UNTESTED', true);
                        }}
                      >
                        {t('@ 코멘트', { count: testrun.untestedTestcaseHasCommentCount })}
                      </Link>
                    </div>
                  </div>
                </div>
              </Block>
            </div>
            <div className="comment-layout">
              <Title border={false} marginBottom={false}>
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
          </div>
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
