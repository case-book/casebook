import React from 'react';
import { Page, PageContent, PageTitle } from '@/components';
import { useTranslation } from 'react-i18next';

function ProjectTestrunInfoPage() {
  const { t } = useTranslation();

  return (
    <Page className="project-overview-info-page-wrapper" list>
      <PageTitle>{t('테스트런')}</PageTitle>
      <PageContent />
    </Page>
  );
}

ProjectTestrunInfoPage.defaultProps = {};

ProjectTestrunInfoPage.propTypes = {};

export default ProjectTestrunInfoPage;
