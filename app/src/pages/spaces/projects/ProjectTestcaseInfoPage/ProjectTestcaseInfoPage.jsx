import React, { useCallback, useEffect, useState } from 'react';
import { Page, PageContent, PageTitle } from '@/components';
import { useTranslation } from 'react-i18next';
import ProjectService from '@/services/ProjectService';
import { useParams } from 'react-router';
import './ProjectTestcaseInfoPage.scss';
import TestcaseService from '@/services/TestcaseService';
import { cloneDeep } from 'lodash';
import TestcaseGroup from '@/pages/spaces/projects/ProjectTestcaseInfoPage/TestcaseGroup';

function ProjectTestcaseInfoPage() {
  const { t } = useTranslation();
  const { projectId, spaceCode } = useParams();
  const [project, setProject] = useState(null);
  const [testcaseGroups, setTestcaseGroups] = useState([]);
  const [selectedTestcaseGroupId, setSelectedTestcaseGroupId] = useState(null);

  const getProject = useCallback(() => {
    ProjectService.selectProjectInfo(spaceCode, projectId, info => {
      setProject(info);
    });
  }, [spaceCode, projectId]);

  useEffect(() => {
    window.scrollTo(0, 0);
    getProject();
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
            if (parentGroup) {
              if (!parentGroup?.children) {
                parentGroup.children = [];
              }

              parentGroup.children.push(d);
            } else {
              console.log(`NO PARENT - ${d.parentId}`);
            }
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

  const onChangeTestcaseOrderChange = orderChangeInfo => {
    TestcaseService.updateTestcaseGroupOrders(spaceCode, projectId, orderChangeInfo, info => {
      setProject(info);
    });
  };

  const onDeleteTestcaseGroup = id => {
    TestcaseService.deleteTestcaseGroup(spaceCode, projectId, id, () => {
      setSelectedTestcaseGroupId(null);
      getProject();
    });
  };

  return (
    <Page className="project-testcase-info-page-wrapper" list wide>
      <PageTitle>{t('테스트케이스')}</PageTitle>
      <PageContent className="page-content">
        <div className="page-layout">
          <TestcaseGroup
            testcaseGroups={testcaseGroups}
            addTestcaseGroup={addTestcaseGroup}
            onChangeTestcaseOrderChange={onChangeTestcaseOrderChange}
            selectedId={selectedTestcaseGroupId}
            onSelect={setSelectedTestcaseGroupId}
            onDelete={onDeleteTestcaseGroup}
          />

          <div className="testcases">
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
