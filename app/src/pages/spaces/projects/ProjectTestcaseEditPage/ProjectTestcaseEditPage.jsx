import React, { useEffect, useMemo, useState } from 'react';
import { ITEM_TYPE, MESSAGE_CATEGORY } from '@/constants/constants';
import dialogUtil from '@/utils/dialogUtil';
import { useParams } from 'react-router';
import { Page, PageContent, PageTitle } from '@/components';
import { useTranslation } from 'react-i18next';
import ProjectService from '@/services/ProjectService';
import TestcaseService from '@/services/TestcaseService';
import ReleaseService from '@/services/ReleaseService';
import TestcaseNavigator from '@/pages/spaces/projects/ProjectTestcaseEditPage/TestcaseNavigator/TestcaseNavigator';
import ContentManager from '@/pages/spaces/projects/ProjectTestcaseEditPage/ContentManager/ContentManager';
import SplitPane, { Pane } from 'split-pane-react';
import './ProjectTestcaseEditPage.scss';
import testcaseUtil from '@/utils/testcaseUtil';
import { useNavigate } from 'react-router-dom';
import useQueryString from '@/hooks/useQueryString';
import SpaceVariableService from '@/services/SpaceVariableService';
import SpaceService from '@/services/SpaceService';

function ProjectTestcaseEditPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectId, spaceCode } = useParams();
  const [project, setProject] = useState(null);
  const [llms, setLlms] = useState([]);
  const [tags, setTags] = useState([]);
  const [projectUsers, setProjectUsers] = useState([]);
  const [allTestcaseGroups, setAllTestcaseGroups] = useState([]);
  const [testcaseGroups, setTestcaseGroups] = useState([]);
  const [releases, setReleases] = useState([]);
  const [paraphraseInfo, setParaphraseInfo] = useState({});
  const { query, setQuery: setSelectedItemInfo } = useQueryString();

  const selectedItemInfo = useMemo(() => {
    return {
      ...query,
      time: Number.isNaN(query.time) ? null : Number(query.time),
      id: Number.isNaN(query.id) ? null : Number(query.id),
    };
  }, [query]);

  const [contentLoading, setContentLoading] = useState(false);
  const [content, setContent] = useState(null);
  const [popupContent, setPopupContent] = useState(null);
  const [contentChanged, setContentChanged] = useState(false);
  const [variables, setVariables] = useState([]);

  const [sizes, setSizes] = useState(
    (() => {
      const info = JSON.parse(localStorage.getItem('project-testcase-edit-page-sizes'));
      if (info) {
        return info;
      }

      return [300, 'auto'];
    })(),
  );

  const onChangeSize = info => {
    localStorage.setItem('project-testcase-edit-page-sizes', JSON.stringify(info));
    setSizes(info);
  };

  const getLlms = () => {
    SpaceService.selectSpaceLlmList(spaceCode, list => {
      setLlms(list);
    });
  };

  const getProject = () => {
    ProjectService.selectProjectInfo(spaceCode, projectId, info => {
      setProject(info);

      const tagMap = {};

      setProjectUsers(
        info.users.map(d => {
          const currentTags = d.tags?.split(';').filter(i => !!i) || [];
          currentTags.forEach(word => {
            tagMap[word] = true;
          });

          return {
            id: d.userId,
            email: d.email,
            name: d.name,
          };
        }),
      );

      setTags(Object.keys(tagMap));
    });
  };

  const getTestcaseGroups = () => {
    TestcaseService.selectTestcaseGroupList(spaceCode, projectId, list => {
      setAllTestcaseGroups(list);
    });
  };

  const getTestcase = testcaseId => {
    setContentLoading(true);

    TestcaseService.selectTestcase(
      spaceCode,
      projectId,
      testcaseId,
      info => {
        setTimeout(() => {
          setContentLoading(false);
        }, 200);
        setContentChanged(false);
        setContent(info);
      },
      () => {
        setContentLoading(false);
      },
    );
  };

  const getPopupContentTestcase = testcaseId => {
    TestcaseService.selectTestcase(spaceCode, projectId, testcaseId, info => {
      setPopupContent(info);
    });
  };

  const getReleases = () =>
    ReleaseService.selectReleaseList(spaceCode, projectId, list => {
      setReleases(list);
    });

  const targetRelease = useMemo(() => {
    return releases.find(d => d.isTarget);
  }, [releases]);

  useEffect(() => {
    window.scrollTo(0, 0);
    getLlms();
    getProject();
    getTestcaseGroups();
    getReleases();
  }, [spaceCode, projectId]);

  useEffect(() => {
    SpaceVariableService.selectSpaceVariableList(spaceCode, list => {
      setVariables(list);
    });
  }, [spaceCode]);

  const findGroup = (id, groups) => {
    if (!groups || groups?.length < 1) {
      return null;
    }

    if (groups.find(d => d.id === id)) {
      return groups.find(d => d.id === id);
    }

    for (let i = 0; i < groups.length; i += 1) {
      const group = findGroup(id, groups[i].children);
      if (group) {
        return group;
      }
    }

    return null;
  };

  const getContent = () => {
    if (selectedItemInfo.type === ITEM_TYPE.TESTCASE) {
      getTestcase(selectedItemInfo.id);
    } else {
      const group = findGroup(selectedItemInfo.id, testcaseGroups);
      setContentChanged(false);
      setContent(group);
    }
  };

  const getPopupContent = testcaseId => {
    getPopupContentTestcase(testcaseId);
  };

  useEffect(() => {
    if (selectedItemInfo.id) {
      getContent();
    } else {
      setContentChanged(false);
      setContent(null);
    }
  }, [selectedItemInfo.id]);

  useEffect(() => {
    if (allTestcaseGroups?.length > 0) {
      const nextGroups = testcaseUtil.getTestcaseTreeData(allTestcaseGroups);
      setTestcaseGroups(nextGroups);
    } else {
      setTestcaseGroups([]);
    }
  }, [allTestcaseGroups]);

  useEffect(() => {
    getContent();
  }, [testcaseGroups]);

  const addTestcaseGroup = (focus = false) => {
    const name = '그룹';
    let testcaseGroup = {
      parentId: null,
      name,
      testcases: [],
    };

    if (selectedItemInfo.type === ITEM_TYPE.TESTCASE_GROUP && selectedItemInfo.id) {
      const selectedGroup = allTestcaseGroups.find(d => d.id === selectedItemInfo.id);

      testcaseGroup = {
        parentId: selectedGroup.id,
        name,
        testcases: [],
      };
    }

    TestcaseService.createTestcaseGroup(spaceCode, projectId, testcaseGroup, info => {
      const nextAllTestcaseGroups = allTestcaseGroups.slice(0);
      nextAllTestcaseGroups.push(info);
      setAllTestcaseGroups(nextAllTestcaseGroups);

      if (focus) {
        setSelectedItemInfo({
          id: info.id,
          type: ITEM_TYPE.TESTCASE_GROUP,
          time: Date.now(),
        });
      }
    });
  };

  const addTestcase = (focus = true) => {
    let group = null;

    if (selectedItemInfo.type === ITEM_TYPE.TESTCASE_GROUP && selectedItemInfo.id) {
      group = allTestcaseGroups.find(d => d.id === selectedItemInfo.id);
    } else if (selectedItemInfo.type === ITEM_TYPE.TESTCASE && selectedItemInfo.id) {
      group = allTestcaseGroups.find(d => {
        return d.testcases?.findIndex(item => item.id === selectedItemInfo.id) > -1;
      });
    }

    if (!group) {
      return;
    }

    const name = '테스트케이스';
    const testcase = {
      testcaseGroupId: group.id,
      name,
      testcases: [],
    };

    TestcaseService.createTestcase(spaceCode, projectId, group.id, testcase, info => {
      const nextAllTestcaseGroups = allTestcaseGroups.slice(0);
      const nextTestcaseGroup = nextAllTestcaseGroups.find(d => d.id === group.id);
      if (!nextTestcaseGroup.testcases) {
        nextTestcaseGroup.testcases = [];
      }
      nextTestcaseGroup.testcases.push(info);
      setAllTestcaseGroups(nextAllTestcaseGroups);

      if (selectedItemInfo.type === ITEM_TYPE.TESTCASE_GROUP) {
        setContent({ ...nextTestcaseGroup });
      }

      if (focus) {
        setSelectedItemInfo({
          id: info.id,
          type: ITEM_TYPE.TESTCASE,
          time: Date.now(),
        });
      }
    });
  };

  const copyTestcase = (sourceType, sourceId, targetType, targetId) => {
    if (sourceType === 'case') {
      TestcaseService.copyTestcase(spaceCode, projectId, sourceId, targetType, targetId, info => {
        const nextAllTestcaseGroups = allTestcaseGroups.slice(0);
        const nextTestcaseGroup = nextAllTestcaseGroups.find(d => d.id === info.testcaseGroupId);
        if (!nextTestcaseGroup.testcases) {
          nextTestcaseGroup.testcases = [];
        }

        nextTestcaseGroup.testcases.forEach(testcase => {
          const next = testcase;
          if (next.itemOrder >= info.itemOrder) {
            next.itemOrder += 1;
          }
        });

        nextTestcaseGroup.testcases.push(info);
        setAllTestcaseGroups(nextAllTestcaseGroups);

        if (selectedItemInfo.type === ITEM_TYPE.TESTCASE_GROUP) {
          setContent({ ...nextTestcaseGroup });
        }

        setSelectedItemInfo({
          id: info.id,
          type: ITEM_TYPE.TESTCASE,
          time: Date.now(),
        });
      });
    } else if (sourceType === 'group') {
      TestcaseService.copyTestcaseGroup(spaceCode, projectId, sourceId, targetType, targetId, info => {
        const nextAllTestcaseGroups = allTestcaseGroups.slice(0);
        nextAllTestcaseGroups.push(info);
        setAllTestcaseGroups(nextAllTestcaseGroups);

        setSelectedItemInfo({
          id: info.id,
          type: ITEM_TYPE.TESTCASE_GROUP,
          time: Date.now(),
        });
      });
    }
  };

  const onPositionChange = changeInfo => {
    if (changeInfo.targetType === ITEM_TYPE.TESTCASE_GROUP && changeInfo.destinationType === ITEM_TYPE.TESTCASE_GROUP) {
      TestcaseService.updateTestcaseGroupOrders(spaceCode, projectId, changeInfo, () => {
        getTestcaseGroups();
      });
    } else if (changeInfo.targetType === ITEM_TYPE.TESTCASE && changeInfo.destinationType === ITEM_TYPE.TESTCASE_GROUP) {
      TestcaseService.updateTestcaseTestcaseGroup(spaceCode, projectId, changeInfo.targetId, changeInfo, () => {
        getTestcaseGroups();
      });
    } else if (changeInfo.targetType === ITEM_TYPE.TESTCASE && changeInfo.destinationType === ITEM_TYPE.TESTCASE) {
      TestcaseService.updateTestcaseOrder(spaceCode, projectId, changeInfo.targetId, changeInfo, () => {
        getTestcaseGroups();
      });
    }
  };

  const onDeleteTestcaseGroup = (type, id) => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('데이터 삭제'),
      type === ITEM_TYPE.TESTCASE_GROUP ? '선택한 테스트케이스 그룹과 하위의 그룹 및 테스트케이스가 모두 삭제됩니다. 삭제하시겠습니까?' : '선택한 테스트케이스가 삭제됩니다. 삭제하시겠습니까?',

      () => {
        if (type === ITEM_TYPE.TESTCASE_GROUP) {
          TestcaseService.deleteTestcaseGroup(spaceCode, projectId, id, () => {
            setSelectedItemInfo({
              id: null,
              type: null,
              time: null,
            });

            getTestcaseGroups();
          });
        } else if (type === ITEM_TYPE.TESTCASE) {
          TestcaseService.deleteTestcase(spaceCode, projectId, id, () => {
            setSelectedItemInfo({
              id: null,
              type: null,
              time: null,
            });

            getTestcaseGroups();
          });
        }
      },
      null,
      t('삭제'),
      null,
      'danger',
    );
  };

  const onChangeTestcaseGroupName = (type, id, name) => {
    if (type === ITEM_TYPE.TESTCASE_GROUP) {
      TestcaseService.updateTestcaseGroupName(spaceCode, projectId, id, name, info => {
        const nextAllTestcaseGroups = allTestcaseGroups.slice(0);
        const inx = nextAllTestcaseGroups.findIndex(d => d.id === info.id);
        if (inx > -1) {
          nextAllTestcaseGroups[inx] = info;
          setAllTestcaseGroups(nextAllTestcaseGroups);
        }
      });
    } else if (type === ITEM_TYPE.TESTCASE) {
      TestcaseService.updateTestcaseName(spaceCode, projectId, id, name, info => {
        const nextAllTestcaseGroups = allTestcaseGroups.slice(0);
        const nextGroup = nextAllTestcaseGroups.find(d => d.id === info.testcaseGroupId);
        const inx = nextGroup.testcases.findIndex(d => d.id === info.id);
        if (inx > -1) {
          nextGroup.testcases[inx] = info;
          setAllTestcaseGroups(nextAllTestcaseGroups);
        }
      });
    }
  };

  const onChangeTestcaseNameAndDescription = (id, name, description, handler) => {
    TestcaseService.updateTestcaseNameAndDescription(spaceCode, projectId, id, name, description, info => {
      const nextAllTestcaseGroups = allTestcaseGroups.slice(0);
      const nextGroup = nextAllTestcaseGroups.find(d => d.id === info.testcaseGroupId);
      const inx = nextGroup.testcases.findIndex(d => d.id === info.id);
      if (inx > -1) {
        nextGroup.testcases[inx] = info;
        setAllTestcaseGroups(nextAllTestcaseGroups);

        setContent({ ...nextGroup });

        if (handler) {
          handler(info);
        }
      }
    });
  };

  const updateTestcase = (info, handler) => {
    TestcaseService.updateTestcase(
      spaceCode,
      projectId,
      info.id,
      info,
      result => {
        setTimeout(() => {
          setContentLoading(false);
        }, 200);
        const nextAllTestcaseGroups = allTestcaseGroups.slice(0);
        const nextGroup = nextAllTestcaseGroups.find(g => g.id === result.testcaseGroupId);
        const index = nextGroup.testcases.findIndex(d => d.id === result.id);
        if (index > -1) {
          nextGroup.testcases[index] = result;
        }

        if (result.id === popupContent?.id) {
          setPopupContent({ ...result });
        }

        if (content.seqId[0] === 'G' && content.id === result.testcaseGroupId) {
          setContent({ ...nextGroup });
        }

        setAllTestcaseGroups(nextAllTestcaseGroups);
        setContentChanged(false);
        if (handler) {
          handler();
        }
      },
      () => {
        setContentLoading(false);
      },
    );
  };

  const onSaveTestcase = (info, handler) => {
    setContentLoading(true);

    if (targetRelease && !info.projectReleaseIds.includes(targetRelease.id)) {
      dialogUtil.setConfirm(
        MESSAGE_CATEGORY.WARNING,
        t('타켓 릴리스 추가 확인'),
        t('설정된 프로젝트의 타켓 릴리스가 현재 테스트케이스에 추가되어 있지 않습니다. 테스트케이스에 타켓 릴리스를 추가하시겠습니까?'),
        () => {
          info.projectReleaseIds.push(targetRelease.id);
          updateTestcase(info, handler);
        },
        () => {
          updateTestcase(info, handler);
        },
        '추가',
        '추가 안함',
      );
    } else {
      updateTestcase(info, handler);
    }
  };

  const onSaveTestcaseGroup = (groupInfo, handler) => {
    TestcaseService.updateTestcaseGroup(spaceCode, projectId, groupInfo.id, groupInfo, info => {
      const nextAllTestcaseGroups = allTestcaseGroups.slice(0);
      const inx = nextAllTestcaseGroups.findIndex(d => d.id === info.id);
      if (inx > -1) {
        nextAllTestcaseGroups[inx] = info;
        setAllTestcaseGroups(nextAllTestcaseGroups);
      }
      setContentChanged(false);
      if (handler) {
        handler();
      }
    });
  };

  const createTestcaseImage = (testcaseId, name, size, type, file) => {
    return TestcaseService.createImage(spaceCode, projectId, testcaseId, name, size, type, file);
  };

  const onParaphrase = (testcaseId, modelId) => {
    setParaphraseInfo({
      testcaseId,
      isLoading: true,
    });
    return TestcaseService.createParaphraseTestcase(spaceCode, projectId, testcaseId, modelId, d => {
      try {
        const items = JSON.parse(d);

        // items가 array인지 확인
        if (!Array.isArray(items)) {
          setParaphraseInfo({
            testcaseId,
            result: false,
            isLoading: false,
          });
          dialogUtil.setMessage(MESSAGE_CATEGORY.WARNING, t('재구성 데이터 오류'), t('AI로부터 전달된 데이터 형식이 올바르지 않습니다.'));
          return;
        }

        setParaphraseInfo({
          testcaseId,
          result: true,
          isLoading: false,
          items,
        });
      } catch (e) {
        setParaphraseInfo({
          testcaseId,
          result: false,
          isLoading: false,
        });
      }
    });
  };

  const onAcceptParaphraseContent = (testcaseId, testcaseItemId) => {
    const nextContent = { ...content };
    const nextTestcaseItems = nextContent.testcaseItems.slice(0);
    const testcaseItemIndex = nextTestcaseItems.findIndex(d => d.id === testcaseItemId);
    const nextTestcaseItem = { ...nextTestcaseItems[testcaseItemIndex] };

    const nextParaphraseInfo = { ...paraphraseInfo };
    const index = nextParaphraseInfo.items.findIndex(d => d.id === testcaseItemId);

    if (index > -1) {
      if (nextTestcaseItem) {
        if (nextTestcaseItem.type === 'value') {
          nextTestcaseItem.value = nextParaphraseInfo.items[index].text;
        } else if (nextTestcaseItem.type === 'text') {
          nextTestcaseItem.text = nextParaphraseInfo.items[index].text;
        }

        nextTestcaseItems[testcaseItemIndex] = nextTestcaseItem;
        nextContent.testcaseItems = nextTestcaseItems;

        TestcaseService.updateTestcaseItem(spaceCode, projectId, testcaseId, testcaseItemId, nextTestcaseItem, () => {
          setContent(nextContent);
          nextParaphraseInfo.items.splice(index, 1);
          setParaphraseInfo(nextParaphraseInfo);
        });
      }
    }
  };

  const onRemoveParaphraseContent = testcaseItemId => {
    const nextParaphraseInfo = { ...paraphraseInfo };

    const index = nextParaphraseInfo.items.findIndex(d => d.id === testcaseItemId);
    if (index > -1) {
      nextParaphraseInfo.items.splice(index, 1);
    }

    setParaphraseInfo(nextParaphraseInfo);
  };

  return (
    <Page className="project-testcase-info-page-wrapper">
      <PageTitle
        name={t('테스트케이스')}
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
            to: `/spaces/${spaceCode}/projects/${projectId}/testcases`,
            text: t('테스트케이스'),
          },
        ]}
        onListClick={() => {
          navigate(`/spaces/${spaceCode}/projects`);
        }}
      >
        {t('테스트케이스')}
      </PageTitle>
      <PageContent className="page-content">
        {project?.testcaseTemplates && (
          <SplitPane sizes={sizes} onChange={onChangeSize}>
            <Pane className="page-layout" minSize={300}>
              <TestcaseNavigator
                testcaseGroups={testcaseGroups}
                addTestcaseGroup={addTestcaseGroup}
                addTestcase={addTestcase}
                onPositionChange={onPositionChange}
                onChangeTestcaseGroupName={onChangeTestcaseGroupName}
                selectedItemInfo={selectedItemInfo}
                onSelect={setSelectedItemInfo}
                onDelete={onDeleteTestcaseGroup}
                contentChanged={contentChanged}
                copyTestcase={copyTestcase}
              />
            </Pane>
            <Pane className="page-layout" minSize={400}>
              <ContentManager
                getPopupContent={getPopupContent}
                popupContent={popupContent}
                type={selectedItemInfo?.type}
                content={content}
                addTestcase={addTestcase}
                releases={releases}
                testcaseTemplates={project?.testcaseTemplates}
                loading={contentLoading}
                setContentChanged={setContentChanged}
                onSaveTestcase={onSaveTestcase}
                onSaveTestcaseGroup={onSaveTestcaseGroup}
                users={projectUsers}
                createTestcaseImage={createTestcaseImage}
                onChangeTestcaseNameAndDescription={onChangeTestcaseNameAndDescription}
                setPopupContent={setPopupContent}
                tags={tags}
                variables={variables}
                llms={llms}
                onParaphrase={onParaphrase}
                paraphraseInfo={paraphraseInfo}
                onAcceptParaphraseContent={onAcceptParaphraseContent}
                onRemoveParaphraseContent={onRemoveParaphraseContent}
                aiEnabled={project.aiEnabled}
              />
            </Pane>
          </SplitPane>
        )}
      </PageContent>
    </Page>
  );
}

ProjectTestcaseEditPage.defaultProps = {};

ProjectTestcaseEditPage.propTypes = {};

export default ProjectTestcaseEditPage;
