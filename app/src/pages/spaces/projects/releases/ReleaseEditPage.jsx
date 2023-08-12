import React, { useState, useEffect, useMemo } from 'react';
import { Page, PageContent, PageTitle, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import ProjectService from '@/services/ProjectService';
import PropTypes from 'prop-types';

function ReleaseEditPage({ type }) {
  const { t } = useTranslation();
  const { spaceCode, projectId, releaseId } = useParams();
  const [project, setProject] = useState(null);

  const isEdit = useMemo(() => {
    return type === 'edit';
  }, [type]);

  useEffect(() => {
    ProjectService.selectProjectName(spaceCode, projectId, info => {
      setProject(info);
    });
  }, [spaceCode, projectId]);

  return (
    <Page>
      <PageTitle
        breadcrumbs={[
          { to: '/', text: t('HOME') },
          {
            to: '/',
            text: t('스페이스 목록'),
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
            to: `/spaces/${spaceCode}/projects/${projectId}/releases`,
            text: t('릴리즈 목록'),
          },
          {
            to: isEdit ? `/spaces/${spaceCode}/projects/${projectId}/releases/${releaseId}/edit` : `/spaces/${spaceCode}/projects/${projectId}/testruns/new`,
            text: isEdit ? t('편집') : t('생성'),
          },
        ]}
      >
        {t('새 릴리즈')}
      </PageTitle>
      <PageContent>
        <Title>{t('릴리즈 정보')}</Title>
      </PageContent>
    </Page>
  );
}

ReleaseEditPage.defaultProps = {
  type: 'new',
};

ReleaseEditPage.propTypes = {
  type: PropTypes.string,
};

export default ReleaseEditPage;
