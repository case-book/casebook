import React, { useEffect, useRef, useState } from 'react';
import { ITEM_TYPE, MESSAGE_CATEGORY } from '@/constants/constants';
import dialogUtil from '@/utils/dialogUtil';
import { useParams } from 'react-router';
import { cloneDeep } from 'lodash';
import { Page, PageContent, PageTitle } from '@/components';
import { useTranslation } from 'react-i18next';
import ProjectService from '@/services/ProjectService';
import TestcaseService from '@/services/TestcaseService';
import { getOption, setOption } from '@/utils/storageUtil';
import TestcaseNavigator from '@/pages/spaces/projects/ProjectTestcaseInfoPage/TestcaseNavigator/TestcaseNavigator';
import ContentManager from '@/pages/spaces/projects/ProjectTestcaseInfoPage/ContentManager/ContentManager';
import './ProjectTestcaseInfoPage.scss';
import SpaceService from '@/services/SpaceService';

function ProjectTestcaseInfoPage() {
  const { t } = useTranslation();
  const { projectId, spaceCode } = useParams();
  const [project, setProject] = useState(null);
  const [spaceUsers, setSpaceUsers] = useState([]);
  const [testcaseGroups, setTestcaseGroups] = useState([]);
  const [testcaseGroupWidth, setTestcaseGroupWidth] = useState(() => {
    return getOption('testcase', 'testcase-group-layout', 'width') || 300;
  });

  const testcaseGroupElement = useRef(null);

  const resizeInfo = useRef({
    moving: false,
    startX: null,
    endX: null,
    startWidth: null,
  }).current;

  const [selectedItemInfo, setSelectedItemInfo] = useState({
    id: null,
    type: null,
    time: null,
  });

  const [contentLoading, setContentLoading] = useState(false);
  const [content, setContent] = useState(null);
  const [popupContent, setPopupContent] = useState(null);
  const [contentChanged, setContentChanged] = useState(false);

  const getProject = () => {
    ProjectService.selectProjectInfo(spaceCode, projectId, info => {
      setProject(info);
    });
  };

  const getSpaceUserList = () => {
    SpaceService.selectSpaceUserList(spaceCode, null, users => {
      setSpaceUsers(users);
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

  const [min, setMin] = useState(false);

  const [countSummary, setCountSummary] = useState({
    testcaseGroupCount: 0,
    testcaseCount: 0,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    getProject();
    getSpaceUserList();
  }, [spaceCode, projectId]);

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

  const sort = list => {
    list.sort((a, b) => {
      return a.itemOrder - b.itemOrder;
    });

    list.forEach(item => {
      if (item?.children?.length > 0) {
        sort(item.children);
      }

      if (item?.testcases?.length > 0) {
        sort(item.testcases);
      }
    });
  };

  useEffect(() => {
    let nextGroups = [];
    if (project?.testcaseGroups?.length > 0) {
      const groups = cloneDeep(project?.testcaseGroups);
      const depths = groups.map(d => d.depth) || [];
      const maxDepth = Math.max(...depths);

      for (let i = maxDepth; i >= 0; i -= 1) {
        const targetDepthGroups = groups.filter(d => d.depth === i);
        if (i === 0) {
          nextGroups = nextGroups.concat(targetDepthGroups);
        } else {
          targetDepthGroups.forEach(d => {
            const parentGroup = groups.find(group => group.id === d.parentId);
            if (parentGroup) {
              if (!parentGroup?.children) {
                parentGroup.children = [];
              }

              parentGroup.children.push(d);
            } else {
              console.error(`NO PARENT - ${d.parentId}`);
            }
          });
        }
      }
    }

    setCountSummary({
      testcaseGroupCount: project?.testcaseGroups?.length || 0,
      testcaseCount: project?.testcaseGroups?.reduce((count, next) => {
        return count + (next?.testcases?.length || 0);
      }, 0),
    });

    sort(nextGroups);
    setTestcaseGroups(nextGroups);
  }, [project]);

  useEffect(() => {
    getContent();
  }, [testcaseGroups]);

  const addTestcaseGroup = (focus = true) => {
    const name = '그룹';
    let testcaseGroup = {
      parentId: null,
      name,
      testcases: [],
    };

    if (selectedItemInfo.type === ITEM_TYPE.TESTCASE_GROUP && selectedItemInfo.id) {
      const selectedGroup = project.testcaseGroups.find(d => d.id === selectedItemInfo.id);

      testcaseGroup = {
        parentId: selectedGroup.id,
        name,
        testcases: [],
      };
    }

    TestcaseService.createTestcaseGroup(spaceCode, projectId, testcaseGroup, info => {
      const nextProject = { ...project };
      const nextTestcaseGroups = nextProject.testcaseGroups?.slice(0) || [];
      nextTestcaseGroups.push(info);
      nextProject.testcaseGroups = nextTestcaseGroups;
      setProject(nextProject);

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
      group = project.testcaseGroups.find(d => d.id === selectedItemInfo.id);
    } else if (selectedItemInfo.type === ITEM_TYPE.TESTCASE && selectedItemInfo.id) {
      group = project.testcaseGroups.find(d => {
        return d.testcases.findIndex(item => item.id === selectedItemInfo.id) > -1;
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
      const nextProject = { ...project };
      const nextTestcaseGroup = nextProject.testcaseGroups.find(d => d.id === group.id);
      if (!nextTestcaseGroup.testcases) {
        nextTestcaseGroup.testcases = [];
      }
      nextTestcaseGroup.testcases.push(info);
      setProject(nextProject);

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

  const onPositionChange = changeInfo => {
    if (changeInfo.targetType === ITEM_TYPE.TESTCASE_GROUP && changeInfo.destinationType === ITEM_TYPE.TESTCASE_GROUP) {
      TestcaseService.updateTestcaseGroupOrders(spaceCode, projectId, changeInfo, () => {
        getProject();
      });
    } else if (changeInfo.targetType === ITEM_TYPE.TESTCASE && changeInfo.destinationType === ITEM_TYPE.TESTCASE_GROUP) {
      TestcaseService.updateTestcaseTestcaseGroup(spaceCode, projectId, changeInfo.targetId, changeInfo, () => {
        getProject();
      });
    } else if (changeInfo.targetType === ITEM_TYPE.TESTCASE && changeInfo.destinationType === ITEM_TYPE.TESTCASE) {
      TestcaseService.updateTestcaseOrder(spaceCode, projectId, changeInfo.targetId, changeInfo, () => {
        getProject();
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

            getProject();
          });
        } else if (type === ITEM_TYPE.TESTCASE) {
          TestcaseService.deleteTestcase(spaceCode, projectId, id, () => {
            setSelectedItemInfo({
              id: null,
              type: null,
              time: null,
            });

            getProject();
          });
        }
      },
      null,
      t('삭제'),
    );
  };

  const onChangeTestcaseGroupName = (type, id, name) => {
    if (type === ITEM_TYPE.TESTCASE_GROUP) {
      TestcaseService.updateTestcaseGroupName(spaceCode, projectId, id, name, info => {
        const nextProject = { ...project };
        const inx = project?.testcaseGroups.findIndex(d => d.id === info.id);
        if (inx > -1) {
          nextProject.testcaseGroups[inx] = info;
          setProject(nextProject);
        }
      });
    } else if (type === ITEM_TYPE.TESTCASE) {
      TestcaseService.updateTestcaseName(spaceCode, projectId, id, name, info => {
        const nextProject = { ...project };
        const nextGroup = project?.testcaseGroups.find(d => d.id === info.testcaseGroupId);
        const inx = nextGroup.testcases.findIndex(d => d.id === info.id);
        if (inx > -1) {
          nextGroup.testcases[inx] = info;
          setProject(nextProject);
        }
      });
    }
  };

  const onChangeTestcaseNameAndDescription = (id, name, description, handler) => {
    TestcaseService.updateTestcaseNameAndDescription(spaceCode, projectId, id, name, description, info => {
      const nextProject = { ...project };
      const nextGroup = project?.testcaseGroups.find(d => d.id === info.testcaseGroupId);
      const inx = nextGroup.testcases.findIndex(d => d.id === info.id);
      if (inx > -1) {
        nextGroup.testcases[inx] = info;
        setProject(nextProject);

        setContent({ ...nextGroup });

        if (handler) {
          handler(info);
        }
      }
    });
  };

  const onGrabMouseMove = e => {
    if (resizeInfo.moving) {
      const distanceX = e.clientX - resizeInfo.startX;
      resizeInfo.endX = e.clientX;
      if (testcaseGroupElement.current) {
        testcaseGroupElement.current.style.width = `${resizeInfo.startWidth + distanceX}px`;
      }
    }
  };

  const onGrabMouseUp = () => {
    if (resizeInfo.moving) {
      document.removeEventListener('mousemove', onGrabMouseMove);
      document.removeEventListener('mouseup', onGrabMouseUp);
      const width = resizeInfo.startWidth + (resizeInfo.endX - resizeInfo.startX);
      setTestcaseGroupWidth(width);
      resizeInfo.moving = false;
      resizeInfo.startX = null;
      resizeInfo.startWidth = null;

      setOption('testcase', 'testcase-group-layout', 'width', width);
    }
  };

  const onGrabMouseDown = e => {
    if (!testcaseGroupElement.current) {
      return;
    }

    const rects = testcaseGroupElement.current.getClientRects();

    if (rects?.length < 1) {
      return;
    }

    document.addEventListener('mousemove', onGrabMouseMove);
    document.addEventListener('mouseup', onGrabMouseUp);

    resizeInfo.moving = true;
    resizeInfo.startX = e.clientX;
    resizeInfo.startWidth = rects[0].width;
  };

  const onSaveTestcase = (info, handler) => {
    setContentLoading(true);

    TestcaseService.updateTestcase(
      spaceCode,
      projectId,
      info.id,
      info,
      result => {
        setTimeout(() => {
          setContentLoading(false);
        }, 200);
        const nextProject = { ...project };
        const nextGroup = nextProject.testcaseGroups.find(g => g.id === result.testcaseGroupId);
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

        setProject(nextProject);
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

  const onSaveTestcaseGroup = (groupInfo, handler) => {
    TestcaseService.updateTestcaseGroup(spaceCode, projectId, groupInfo.id, groupInfo, info => {
      const nextProject = { ...project };
      const inx = project?.testcaseGroups.findIndex(d => d.id === info.id);
      if (inx > -1) {
        nextProject.testcaseGroups[inx] = info;
        setProject(nextProject);
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

  return (
    <Page className="project-testcase-info-page-wrapper" list wide>
      <PageTitle>{t('테스트케이스')}</PageTitle>
      <PageContent className="page-content">
        <div className="page-layout">
          <div
            className={`testcase-groups ${min ? 'min' : ''}`}
            ref={testcaseGroupElement}
            style={{
              width: `${testcaseGroupWidth || 300}px`,
            }}
          >
            <TestcaseNavigator
              testcaseGroups={testcaseGroups}
              addTestcaseGroup={addTestcaseGroup}
              addTestcase={addTestcase}
              onPositionChange={onPositionChange}
              onChangeTestcaseGroupName={onChangeTestcaseGroupName}
              selectedItemInfo={selectedItemInfo}
              onSelect={setSelectedItemInfo}
              onDelete={onDeleteTestcaseGroup}
              min={min}
              setMin={setMin}
              countSummary={countSummary}
              contentChanged={contentChanged}
            />
          </div>
          <div className="border-line" onMouseDown={onGrabMouseDown} onMouseUp={onGrabMouseUp} onMouseMove={onGrabMouseMove} />
          <div className="testcases">
            <ContentManager
              getPopupContent={getPopupContent}
              popupContent={popupContent}
              type={selectedItemInfo?.type}
              content={content}
              addTestcase={addTestcase}
              testcaseTemplates={project?.testcaseTemplates}
              loading={contentLoading}
              setContentChanged={setContentChanged}
              onSaveTestcase={onSaveTestcase}
              onSaveTestcaseGroup={onSaveTestcaseGroup}
              users={spaceUsers}
              createTestcaseImage={createTestcaseImage}
              onChangeTestcaseNameAndDescription={onChangeTestcaseNameAndDescription}
              setPopupContent={setPopupContent}
            />
          </div>
        </div>
      </PageContent>
    </Page>
  );
}

ProjectTestcaseInfoPage.defaultProps = {};

ProjectTestcaseInfoPage.propTypes = {};

export default ProjectTestcaseInfoPage;
