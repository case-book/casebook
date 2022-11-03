import React, { useEffect, useState } from 'react';
import { Block, Label, Page, PageContent, PageTitle, Text, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import BlockRow from '@/components/BlockRow/BlockRow';
import './ProjectInfoPage.scss';
import ProjectService from '@/services/ProjectService';
import MemberManager from '@/components/MemberManager/MemberManager';

function ProjectInfoPage() {
  const { t } = useTranslation();
  const { spaceCode, projectId } = useParams();

  const [project, setProject] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    ProjectService.selectProjectInfo(spaceCode, projectId, info => {
      setProject(info);
    });
  }, [projectId]);

  return (
    <Page className="project-info-page-wrapper">
      <PageTitle links={project?.admin ? [<Link to={`/spaces/${spaceCode}/projects/${project.id}/edit`}>{t('프로젝트 변경')}</Link>] : null}>{t('프로젝트')}</PageTitle>
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
        <Title>프로젝트 사용자</Title>
        <Block>
          <MemberManager className="member-manager" users={project?.users} />
        </Block>
      </PageContent>
    </Page>
  );
}

ProjectInfoPage.defaultProps = {};

ProjectInfoPage.propTypes = {};

export default ProjectInfoPage;
