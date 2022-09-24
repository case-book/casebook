import React, { useEffect, useState } from 'react';
import { Page, PageButtons, PageContent, PageTitle, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import ProjectService from '@/services/ProjectService';
import { useParams } from 'react-router';
import ConfigService from '@/services/ConfigService';
import { useNavigate } from 'react-router-dom';
import './ProjectConfigInfoPage.scss';

function ProjectConfigInfoPage() {
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
    <Page className="project-config-info-page-wrapper">
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

ProjectConfigInfoPage.defaultProps = {};

ProjectConfigInfoPage.propTypes = {};

export default ProjectConfigInfoPage;
