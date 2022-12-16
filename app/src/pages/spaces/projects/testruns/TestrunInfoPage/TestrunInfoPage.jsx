import React, { useEffect, useState } from 'react';
import { Button, FlexibleLayout, Page, PageContent, PageTitle } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import dialogUtil from '@/utils/dialogUtil';
import { ITEM_TYPE, MESSAGE_CATEGORY } from '@/constants/constants';
import ProjectService from '@/services/ProjectService';
import useStores from '@/hooks/useStores';
import ProjectUserSelectPopup from '@/pages/spaces/projects/testruns/ProjectUserSelectPopup';
import TestcaseSelectPopup from '@/pages/spaces/projects/testruns/TestcaseSelectPopup/TestcaseSelectPopup';
import TestrunService from '@/services/TestrunService';
import testcaseUtil from '@/utils/testcaseUtil';
import TestcaseNavigator from '@/pages/spaces/projects/ProjectTestcaseInfoPage/TestcaseNavigator/TestcaseNavigator';
import TestRunTestcaseManager from '@/pages/spaces/projects/testruns/TestrunInfoPage/TestRunTestcaseManager/TestRunTestcaseManager';
import TestcaseService from '@/services/TestcaseService';
import './TestrunInfoPage.scss';

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

function TestrunEditPage() {
  const { t } = useTranslation();
  const { projectId, spaceCode, testrunId } = useParams();

  const {
    userStore: { user },
  } = useStores();

  const navigate = useNavigate();

  const [min, setMin] = useState(false);

  const [countSummary, setCountSummary] = useState({
    testcaseGroupCount: 0,
    testcaseCount: 0,
  });

  const [projectUserSelectPopupOpened, setProjectUserSelectPopupOpened] = useState(false);

  const [testcaseSelectPopupOpened, setTestcaseSelectPopupOpened] = useState(false);

  const [testcaseGroups, setTestcaseGroups] = useState([]);

  const [project, setProject] = useState(null);

  const [contentLoading, setContentLoading] = useState(false);

  const [content, setContent] = useState(null);

  const [userFilter, setUserFilter] = useState('');

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

  const [selectedItemInfo, setSelectedItemInfo] = useState({
    id: null,
    type: null,
    time: null,
  });

  useEffect(() => {
    ProjectService.selectProjectInfo(spaceCode, projectId, info => {
      setProject(info);
    });
  }, [projectId]);

  useEffect(() => {
    TestrunService.selectTestrunInfo(spaceCode, projectId, testrunId, info => {
      setTestrun(info);

      setCountSummary({
        testcaseGroupCount: info?.testcaseGroups?.length || 0,
        testcaseCount: info?.testcaseGroups?.reduce((count, next) => {
          return count + (next?.testcases?.length || 0);
        }, 0),
      });

      const groups = testcaseUtil.getTestcaseTreeData(info?.testcaseGroups, 'testcaseGroupId');
      setTestcaseGroups(groups);

      setUserFilter(user.id);
    });
  }, [projectId, testrunId]);

  useEffect(() => {
    if (!project) {
      return;
    }

    const filteredTestcaseGroups = testrun.testcaseGroups.map(d => {
      return {
        ...d,
        testcases: d.testcases.filter(testcase => {
          if (userFilter === '') {
            return true;
          }

          const testcaseTemplate = project?.testcaseTemplates.find(template => template.id === testcase.testcaseTemplateId);
          const testTemplateItem = testcaseTemplate?.testcaseTemplateItems?.find(templateItem => templateItem.systemLabel === 'TESTER');
          const testcaseTestcaseItem = testcase.testrunTestcaseItems?.find(testrunTestcaseItem => testrunTestcaseItem.testcaseTemplateItemId === testTemplateItem.id);

          return String(testcaseTestcaseItem?.value) === String(userFilter);
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
  }, [project, userFilter]);

  const getTestcase = testrunTestcaseGroupTestcaseId => {
    setContentLoading(true);

    const testcaseGroup = testrun?.testcaseGroups.find(d => d.testcases?.find(testcase => testcase.id === testrunTestcaseGroupTestcaseId));

    TestrunService.selectTestrunTestcaseGroupTestcase(
      spaceCode,
      projectId,
      testrunId,
      testcaseGroup.id,
      testrunTestcaseGroupTestcaseId,
      info => {
        setTimeout(() => {
          setContentLoading(false);
        }, 200);
        setContent(info);
      },
      () => {
        setContentLoading(false);
      },
    );
  };

  const getContent = () => {
    if (selectedItemInfo.type === ITEM_TYPE.TESTCASE) {
      getTestcase(selectedItemInfo.id);
    }
  };

  useEffect(() => {
    if (selectedItemInfo.id) {
      getContent();
    } else {
      setContent(null);
    }
  }, [selectedItemInfo.id]);

  const onDelete = () => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('테스트런 삭제'),
      <div>{t(`"${testrun.name}" 테스트런 및 테스트런에 입력된 모든 정보가 삭제됩니다. 삭제하시겠습니까?`)}</div>,
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
      <div>{t(`"${testrun.name}" 테스트런을 종료합니다. 계속하시겠습니까?`)}</div>,
      () => {
        TestrunService.updateTestrunStatusClosed(spaceCode, projectId, testrunId, () => {
          navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns`);
        });
      },
      null,
      t('종료'),
    );
  };

  const onChangeTestrun = (key, value) => {
    setTestrun({
      ...testrun,
      [key]: value,
    });
  };

  const onChangeComment = (id, comment, handler) => {
    TestrunService.updateTestrunComment(
      spaceCode,
      projectId,
      testrunId,
      content.testrunTestcaseGroupId,
      content.id,
      {
        id,
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

  const onDeleteComment = id => {
    TestrunService.deleteTestrunComment(spaceCode, projectId, testrunId, content.testrunTestcaseGroupId, content.id, id, () => {
      const nextContent = { ...content };
      const nextComments = nextContent.comments.slice(0);

      if (nextComments) {
        const index = nextComments.findIndex(comment => comment.id === id);
        nextComments.splice(index, 1);
        nextContent.comments = nextComments;

        setContent(nextContent);
      }
    });
  };

  const createTestrunImage = (testcaseId, name, size, type, file) => {
    return TestcaseService.createImage(spaceCode, projectId, testcaseId, name, size, type, file);
  };

  return (
    <>
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
                // addTestcaseGroup={addTestcaseGroup}
                // addTestcase={addTestcase}
                // onPositionChange={onPositionChange}
                // onChangeTestcaseGroupName={onChangeTestcaseGroupName}
                selectedItemInfo={selectedItemInfo}
                onSelect={setSelectedItemInfo}
                // onDelete={onDeleteTestcaseGroup}
                min={min}
                setMin={setMin}
                countSummary={countSummary}
                // contentChanged={contentChanged}
                userFilter={userFilter}
                setUserFilter={setUserFilter}
              />
            }
            right={
              selectedItemInfo.id && (
                <TestRunTestcaseManager
                  contentLoading={contentLoading}
                  content={content || {}}
                  testcaseTemplates={project?.testcaseTemplates}
                  setContent={d => {
                    setContent(d);
                  }}
                  onSave={() => {
                    TestrunService.updateTestrunResult(spaceCode, projectId, testrunId, content.testrunTestcaseGroupId, content.id, {
                      testrunTestcaseGroupTestcaseItemRequests: content.testrunTestcaseItems,
                    });
                  }}
                  onSaveComment={onChangeComment}
                  onDeleteComment={onDeleteComment}
                  onCancel={() => {}}
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

TestrunEditPage.defaultProps = {};

TestrunEditPage.propTypes = {};

export default TestrunEditPage;
