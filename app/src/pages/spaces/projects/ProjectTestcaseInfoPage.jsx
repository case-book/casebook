import React, { useEffect, useRef, useState } from 'react';
import { Button, Page, PageContent, PageTitle } from '@/components';
import { useTranslation } from 'react-i18next';
import ProjectService from '@/services/ProjectService';
import { useParams } from 'react-router';
import './ProjectTestcaseInfoPage.scss';
import TestcaseService from '@/services/TestcaseService';
import { cloneDeep } from 'lodash';

function ProjectTestcaseInfoPage() {
  const { t } = useTranslation();
  const { projectId, spaceCode } = useParams();
  const [project, setProject] = useState(null);
  const [testcaseGroups, setTestcaseGroups] = useState([]);
  const [selectedTestcaseGroupId, setSelectedTestcaseGroupId] = useState(null);

  const [dragChange, setDragChange] = useState(null);

  const dragInfo = useRef({}).current;

  useEffect(() => {
    window.scrollTo(0, 0);

    ProjectService.selectProjectInfo(spaceCode, projectId, info => {
      setProject(info);
    });
  }, [spaceCode, projectId]);

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
            if (!parentGroup.children) {
              parentGroup.children = [];
            }

            parentGroup.children.push(d);
          });
        }
      }
    }

    setTestcaseGroups(nextGroups);
  }, [project]);

  const addTestcaseGroup = () => {
    const name = `그룹-${(testcaseGroups?.length || 0) + 1}`;
    let testcaseGroup = {
      parentId: null,
      name,
      testcases: [],
    };

    if (selectedTestcaseGroupId) {
      const selectedGroup = project.testcaseGroups.find(d => d.id === selectedTestcaseGroupId);

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
    });
  };

  const setDragInfo = info => {
    setDragChange(Date.now());

    Object.keys(info).forEach(key => {
      dragInfo[key] = info[key];
    });
  };

  const onDrop = e => {
    e.stopPropagation();
    if (dragInfo.destinationId) {
      TestcaseService.updateTestcaseGroupOrders(spaceCode, projectId, dragInfo, info => {
        setProject(info);
      });
    }
  };

  const getGroup = group => {
    return (
      <li key={group.id} className={`${group.id === selectedTestcaseGroupId ? 'selected' : ''}`}>
        <div
          className={`group-content 
          ${dragInfo.targetId === group.id ? 'drag-target' : ''} 
          ${dragInfo.destinationId === group.id ? 'drag-destination' : ''} 
          ${dragInfo.toChildren ? 'to-children' : ''}`}
          onClick={() => {
            setSelectedTestcaseGroupId(group.id);
          }}
          onDragEnter={() => {
            if (dragInfo.targetId !== group.id) {
              setDragInfo({
                destinationId: group.id,
              });
            } else {
              setDragInfo({
                destinationId: null,
              });
            }
          }}
          onDragLeave={() => {
            setDragInfo({
              destinationId: null,
            });
          }}
          onDragOver={e => {
            e.preventDefault();
          }}
          onDrop={onDrop}
        >
          <div className="icon">
            <i className="fa-solid fa-book" />
          </div>
          <div
            className="name"
            onDragLeave={e => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            {group.name}
          </div>
          <div
            draggable
            className="grab"
            onDragStart={() => {
              setDragInfo({
                targetId: group.id,
                destinationId: null,
              });
            }}
            onDragEnd={() => {
              setDragChange(Date.now());
              setDragInfo({
                targetId: null,
                destinationId: null,
              });
            }}
            onDragLeave={e => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <i className="fa-solid fa-grip-vertical" />
          </div>
          <div
            className="bar"
            onDrop={onDrop}
            onDragEnter={() => {
              if (dragInfo.targetId !== group.id) {
                setDragInfo({
                  destinationId: group.id,
                  toChildren: true,
                });
              } else {
                setDragInfo({
                  destinationId: null,
                });
              }
            }}
            onDragLeave={e => {
              e.stopPropagation();
              e.preventDefault();
              if (dragInfo.targetId !== group.id) {
                setDragInfo({
                  toChildren: false,
                });
              } else {
                setDragInfo({
                  destinationId: null,
                });
              }
            }}
          />
        </div>
        {group.children && (
          <div className="group-children">
            <ul>
              {group.children
                .sort((a, b) => {
                  return a.itemOrder - b.itemOrder;
                })
                .map(d => {
                  return getGroup(d);
                })}
            </ul>
          </div>
        )}
      </li>
    );
  };

  return (
    <Page className="project-testcase-info-page-wrapper" list>
      <PageTitle>{t('테스트케이스')}</PageTitle>
      <PageContent className="page-content">
        <div className="page-layout">
          <div className="testcase-groups">
            <div className="buttons">
              <Button size="xs" onClick={addTestcaseGroup}>
                그룹 추가
              </Button>
            </div>
            <div className="summary">설명</div>
            <div className="trees">
              <div className={`content-scroller ${dragChange}`}>
                <ul>
                  {testcaseGroups
                    .sort((a, b) => {
                      return a.itemOrder - b.itemOrder;
                    })
                    .map(d => {
                      return getGroup(d);
                    })}
                </ul>
              </div>
            </div>
          </div>
          <div
            className="testcases"
            onDrop={() => {}}
            onDragEnter={e => {
              e.stopPropagation();
              e.preventDefault();
              setDragInfo({
                destinationId: null,
              });
            }}
          >
            <div className="content-scroller" />
          </div>
        </div>
      </PageContent>
    </Page>
  );
}

ProjectTestcaseInfoPage.defaultProps = {};

ProjectTestcaseInfoPage.propTypes = {};

export default ProjectTestcaseInfoPage;
