import React from 'react';
import { Page, PageContent, PageTitle } from '@/components';
import { useTranslation } from 'react-i18next';

function ProjectBugInfoPage() {
  const { t } = useTranslation();

  return (
    <Page className="project-overview-info-page-wrapper" list>
      <PageTitle>{t('버그')}</PageTitle>
      <PageContent />
    </Page>
  );
}

ProjectBugInfoPage.defaultProps = {};

ProjectBugInfoPage.propTypes = {};

export default ProjectBugInfoPage;
