import React, { useEffect, useState } from 'react';
import { Block, Label, Page, PageButtons, PageContent, PageTitle, Text, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import BlockRow from '@/components/BlockRow/BlockRow';
import './ProjectInfoPage.scss';
import ProjectService from '@/services/ProjectService';

function ProjectInfoPage() {
  const { t } = useTranslation();
  const { spaceCode, projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    ProjectService.selectProjectInfo(spaceCode, projectId, info => {
      setProject(info);
    });
  }, [projectId]);

  return (
    <Page className="project-info-page-wrapper">
      <PageTitle>{t('프로젝트')}</PageTitle>
      <PageContent>
        <Title>{t('프로젝트 정보')}</Title>
        <Block>
          <BlockRow>
            <Label>{t('스페이스')}</Label>
            <Text>{project?.spaceName}</Text>
          </BlockRow>
          <BlockRow>
            <Label>{t('이름')}</Label>
            <Text>{project?.name}</Text>
          </BlockRow>
          <BlockRow>
            <Label>{t('설명')}</Label>
            <Text>{project?.description}</Text>
          </BlockRow>
          <BlockRow>
            <Label>{t('활성화')}</Label>
            <Text>{project?.activated ? 'Y' : 'N'}</Text>
          </BlockRow>
          <BlockRow>
            <Label>{t('토큰')}</Label>
            <Text>{project?.token}</Text>
          </BlockRow>
        </Block>
        <PageButtons
          onBack={() => {
            navigate(-1);
          }}
          onEdit={() => {
            navigate(`/spaces/${spaceCode}/projects/${project.id}/edit`);
          }}
          onCancelIcon=""
        />
      </PageContent>
    </Page>
  );
}

ProjectInfoPage.defaultProps = {};

ProjectInfoPage.propTypes = {};

export default ProjectInfoPage;
