import React, { useEffect, useState } from 'react';
import './ProjectConfig.scss';
import { Page, PageButtons, PageContent, PageTitle, Title } from '@/components';
import { useTranslation } from 'react-i18next';

import ProjectService from '@/services/ProjectService';
import { useParams } from 'react-router';
import ConfigService from '@/services/ConfigService';
import { useNavigate } from 'react-router-dom';

function ProjectConfig() {
  const { t } = useTranslation();
  const { id, spaceCode } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [testcaseItemTypes, setTestcaseItemTypes] = useState([]);

  useEffect(() => {
    ConfigService.selectTestcaseItemTypes(list => {
      setTestcaseItemTypes(list);
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    ProjectService.selectProjectInfo(spaceCode, id, info => {
      setProject(info);
    });
  }, [spaceCode, id]);

  console.log(testcaseItemTypes, project);

  return (
    <Page className="edit-space-wrapper">
      <PageTitle>
        {project?.name} {t('CONFIG')}
      </PageTitle>
      <PageContent>
        <Title type="h2">테스트케이스 템플릿</Title>
        CONFIG
        <PageButtons
          onBack={() => {
            navigate('/');
          }}
          onEdit={() => {
            navigate(`/spaces/${spaceCode}/projects/${project.id}/config/edit`);
          }}
          onCancelIcon=""
        />
      </PageContent>
    </Page>
  );
}

ProjectConfig.defaultProps = {};

ProjectConfig.propTypes = {};

export default ProjectConfig;
