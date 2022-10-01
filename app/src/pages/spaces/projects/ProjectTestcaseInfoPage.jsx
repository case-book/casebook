import React, { useEffect, useState } from 'react';
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

    console.log(nextGroups);
    setTestcaseGroups(nextGroups);
  }, [project]);

  const addTestcaseGroup = () => {
    let testcaseGroup = {
      parentId: null,

      name: '그룹',
      testcases: [],
    };

    if (selectedTestcaseGroupId) {
      const selectedGroup = project.testcaseGroups.find(d => d.id === selectedTestcaseGroupId);

      testcaseGroup = {
        parentId: selectedGroup.id,
        name: '그룹',
        testcases: [],
      };
    }

    TestcaseService.createTestcaseGroup(spaceCode, projectId, testcaseGroup, info => {
      const nextProject = { ...project };
      const nextTestcaseGroups = nextProject.testcaseGroups?.slice(0) || [];
      nextTestcaseGroups.push(info);
      nextProject.testcaseGroups = nextTestcaseGroups;
      console.log(nextProject);
      setProject(nextProject);
    });
  };

  const getGroup = group => {
    return (
      <li key={group.id} className={`${group.id === selectedTestcaseGroupId ? 'selected' : ''}`}>
        <div
          className="group-content"
          onClick={() => {
            setSelectedTestcaseGroupId(group.id);
          }}
        >
          <div className="icon">
            <i className="fa-solid fa-folder" />
          </div>
          <div>{group.name}</div>
        </div>
        {group.children && (
          <div className="group-children">
            <ul>
              {group.children.map(d => {
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
              <Button size="sm" onClick={addTestcaseGroup}>
                그룹 추가
              </Button>
            </div>
            <div className="summary">설명</div>
            <div className="trees">
              <div className="content-scroller">
                <ul>
                  {testcaseGroups.map(d => {
                    return getGroup(d);
                  })}
                </ul>
              </div>
            </div>
          </div>
          <div className="testcases">
            <div className="content-scroller">2</div>
          </div>
        </div>
      </PageContent>
    </Page>
  );
}

ProjectTestcaseInfoPage.defaultProps = {};

ProjectTestcaseInfoPage.propTypes = {};

export default ProjectTestcaseInfoPage;
