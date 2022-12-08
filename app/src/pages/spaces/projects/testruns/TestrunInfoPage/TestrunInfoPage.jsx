import React, { useEffect, useState } from 'react';
import { Button, FlexibleLayout, Page, PageContent, PageTitle } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import dialogUtil from '@/utils/dialogUtil';
import { ITEM_TYPE, MESSAGE_CATEGORY } from '@/constants/constants';
import ProjectService from '@/services/ProjectService';
import useStores from '@/hooks/useStores';
import './TestrunInfoPage.scss';
import ProjectUserSelectPopup from '@/pages/spaces/projects/testruns/ProjectUserSelectPopup';
import TestcaseSelectPopup from '@/pages/spaces/projects/testruns/TestcaseSelectPopup/TestcaseSelectPopup';
import TestrunService from '@/services/TestrunService';
import testcaseUtil from '@/utils/testcaseUtil';
import TestcaseNavigator from '@/pages/spaces/projects/ProjectTestcaseInfoPage/TestcaseNavigator/TestcaseNavigator';
import TestRunTestcaseManager from '@/pages/spaces/projects/testruns/TestrunInfoPage/TestRunTestcaseManager/TestRunTestcaseManager';
import TestcaseService from '@/services/TestcaseService';

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

  console.log(user);

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

  console.log(content, contentLoading);

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
      console.log(info);
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

      console.log(info?.testcaseGroups);

      const groups = testcaseUtil.getTestcaseTreeData(info?.testcaseGroups, 'testcaseGroupId');
      setTestcaseGroups(groups);
    });
  }, [projectId, testrunId]);

  const getTestcase = testrunTestcaseGroupTestcaseId => {
    setContentLoading(true);

    console.log(testcaseGroups);

    const testcaseGroup = testrun?.testcaseGroups.find(d => d.testcases?.find(testcase => testcase.id === testrunTestcaseGroupTestcaseId));
    console.log(testcaseGroup);

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
    console.log(selectedItemInfo.id);
    if (selectedItemInfo.type === ITEM_TYPE.TESTCASE) {
      if (false) {
        getTestcase(selectedItemInfo.id);
      } else {
        console.log(testrun?.testcaseGroups);
        const testcaseGroup = testrun?.testcaseGroups.find(d => d.testcases?.find(testcase => testcase.id === selectedItemInfo.id));
        const testcase = testcaseGroup?.testcases?.find(d => d.id === selectedItemInfo.id);

        const testcaseTemplate = project?.testcaseTemplates.find(d => d.id === testcase.testcaseTemplateId);

        setContent({ ...testcase, testcaseTemplate, testrunTestcaseGroupId: testcaseGroup.id });
        console.log({ ...testcase, testcaseTemplate });
      }
    } else {
      //
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

  console.log(testcaseGroups);
  console.log(content);

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
              />
            }
            right={
              selectedItemInfo.id && (
                <TestRunTestcaseManager
                  content={content || {}}
                  testcaseTemplates={project?.testcaseTemplates}
                  setContent={d => {
                    setContent(d);
                  }}
                  onSave={() => {
                    TestrunService.updateTestrunResult(
                      spaceCode,
                      projectId,
                      testrunId,
                      content.testrunTestcaseGroupId,
                      content.id,
                      {
                        testrunTestcaseGroupTestcaseItemRequests: content.testrunTestcaseItems,
                      },
                      e => {
                        console.log(e);
                      },
                    );
                    console.log(content);
                  }}
                  onCancel={() => {}}
                  users={project?.users}
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
