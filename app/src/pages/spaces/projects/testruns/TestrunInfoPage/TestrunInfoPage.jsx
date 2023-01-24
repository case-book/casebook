import React, { useEffect, useState } from 'react';
import { Button, FlexibleLayout, Page, PageContent, PageTitle } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import dialogUtil from '@/utils/dialogUtil';
import { ITEM_TYPE, MESSAGE_CATEGORY } from '@/constants/constants';
import ProjectService from '@/services/ProjectService';
import useStores from '@/hooks/useStores';
import TestrunService from '@/services/TestrunService';
import testcaseUtil from '@/utils/testcaseUtil';
import TestcaseNavigator from '@/pages/spaces/projects/ProjectTestcaseInfoPage/TestcaseNavigator/TestcaseNavigator';
import TestRunTestcaseManager from '@/pages/spaces/projects/testruns/TestrunInfoPage/TestRunTestcaseManager/TestRunTestcaseManager';
import './TestrunInfoPage.scss';
import useQueryString from '@/hooks/useQueryString';

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

function TestrunInfoPage() {
  const { t } = useTranslation();
  const { projectId, spaceCode, testrunId } = useParams();
  const { query, setQuery } = useQueryString();
  const { tester = '', id = null, type } = query;

  const {
    userStore: { user },
  } = useStores();

  const navigate = useNavigate();

  const [min, setMin] = useState(false);

  const [countSummary, setCountSummary] = useState({
    testcaseGroupCount: 0,
    testcaseCount: 0,
  });

  const [testcaseGroups, setTestcaseGroups] = useState([]);

  const [project, setProject] = useState(null);

  const [contentLoading, setContentLoading] = useState(false);

  const [content, setContent] = useState(null);

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

  const getTestrunInfo = () => {
    TestrunService.selectTestrunInfo(spaceCode, projectId, testrunId, info => {
      if (!project) {
        return;
      }

      setTestrun(info);

      const filteredTestcaseGroups = info.testcaseGroups?.map(d => {
        return {
          ...d,
          testcases:
            d.testcases?.filter(testcase => {
              if (tester === '') {
                return true;
              }

              return String(testcase.testerId) === String(tester);
            }) || [],
        };
      });

      setCountSummary({
        testcaseGroupCount: filteredTestcaseGroups?.length || 0,
        testcaseCount: filteredTestcaseGroups?.reduce((count, next) => {
          return count + (next?.testcases?.length || 0);
        }, 0),
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
  }, [project, testrunId]);

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

          return String(testcase.testerId) === String(tester);
        }),
      };
    });

    setCountSummary({
      testcaseGroupCount: filteredTestcaseGroups?.length || 0,
      testcaseCount: filteredTestcaseGroups?.reduce((count, next) => {
        return count + (next?.testcases?.length || 0);
      }, 0),
    });

    const groups = testcaseUtil.getTestcaseTreeData(filteredTestcaseGroups, 'testcaseGroupId');
    setTestcaseGroups(groups);
  }, [project, tester]);

  const getTestcase = (testrunTestcaseGroupTestcaseId, loading) => {
    if (loading) {
      setContentLoading(true);
    }

    const testcaseGroup = testrun?.testcaseGroups.find(d => d.testcases?.find(testcase => testcase.id === testrunTestcaseGroupTestcaseId));

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
  };

  const getContent = (loading = true) => {
    if (type === ITEM_TYPE.TESTCASE) {
      getTestcase(Number(id), loading);
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
  }, [testrun, id]);

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
    );
  };

  const onChangeComment = (pId, comment, handler) => {
    TestrunService.updateTestrunComment(
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
    TestrunService.deleteTestrunComment(spaceCode, projectId, testrunId, content.testrunTestcaseGroupId, content.id, pId, () => {
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

  /*
  const onSaveTestResultItems = nextContent => {
    TestrunService.updateTestrunResultItems(
      spaceCode,
      projectId,
      testrunId,
      nextContent?.testrunTestcaseGroupId || content.testrunTestcaseGroupId,
      nextContent.id || content.id,
      {
        testrunTestcaseGroupTestcaseItemRequests: nextContent ? nextContent.testrunTestcaseItems : content.testrunTestcaseItems,
      },
      () => {
        getTestrunInfo();
      },
    );
  };
   */

  const onSaveTestResultItem = target => {
    TestrunService.updateTestrunResultItem(spaceCode, projectId, testrunId, target.testrunTestcaseGroupId, target.testrunTestcaseGroupTestcaseId, target.testcaseTemplateItemId, target, () => {
      // getTestrunInfo();
      getContent(false);
    });
  };

  const onSaveTestResult = testResult => {
    TestrunService.updateTestrunResult(spaceCode, projectId, testrunId, content.testrunTestcaseGroupId, content.id, testResult, () => {
      getTestrunInfo();
    });
  };

  const onSaveTester = testerId => {
    TestrunService.updateTestrunTester(spaceCode, projectId, testrunId, content.testrunTestcaseGroupId, content.id, testerId, () => {
      getTestrunInfo();
    });
  };

  return (
    <Page className="testrun-info-page-wrapper" list wide>
      <PageTitle
        control={
          <div>
            <Button size="sm" color="warning" onClick={onClosed}>
              {t('테스트런 종료')}
            </Button>
            <Button size="sm" color="danger" onClick={onDelete}>
              {t('테스트런 삭제')}
            </Button>
          </div>
        }
      >
        {testrun.name}
      </PageTitle>
      <PageContent className="page-content">
        <FlexibleLayout
          layoutOptionKey={['testrun', 'testrun-layout', 'width']}
          min={min}
          setMin={setMin}
          left={
            <TestcaseNavigator
              user={user}
              users={project?.users}
              testcaseGroups={testcaseGroups}
              showTestResult
              enableDrag={false}
              selectedItemInfo={{ id: Number(id), type }}
              onSelect={onSelect}
              min={min}
              setMin={setMin}
              countSummary={countSummary}
              userFilter={tester}
              setUserFilter={onChangeTester}
            />
          }
          right={
            id && (
              <TestRunTestcaseManager
                contentLoading={contentLoading}
                content={content || {}}
                testcaseTemplates={project?.testcaseTemplates}
                setContent={d => {
                  setContent(d);
                }}
                onSaveTestResultItem={onSaveTestResultItem}
                onSaveResult={onSaveTestResult}
                onSaveTester={onSaveTester}
                onSaveComment={onChangeComment}
                onDeleteComment={onDeleteComment}
                users={project?.users.map(u => {
                  return {
                    ...u,
                    id: u.userId,
                  };
                })}
                user={user}
                createTestrunImage={createTestrunImage}
              />
            )
          }
        />
      </PageContent>
    </Page>
  );
}

TestrunInfoPage.defaultProps = {};

TestrunInfoPage.propTypes = {};

export default TestrunInfoPage;
