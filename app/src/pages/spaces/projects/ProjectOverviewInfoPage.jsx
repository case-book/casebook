import React from 'react';
import { Page, PageContent, PageTitle } from '@/components';
import { useTranslation } from 'react-i18next';
import './ProjectOverviewInfoPage.scss';

function ProjectOverviewInfoPage() {
  const { t } = useTranslation();

  return (
    <Page className="project-overview-info-page-wrapper" list>
      <PageTitle>{t('OVERVIEW')}</PageTitle>
      <PageContent />
    </Page>
  );
}

ProjectOverviewInfoPage.defaultProps = {};

ProjectOverviewInfoPage.propTypes = {};

export default ProjectOverviewInfoPage;
