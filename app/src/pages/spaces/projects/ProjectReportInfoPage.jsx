import React from 'react';
import { Page, PageContent, PageTitle } from '@/components';
import { useTranslation } from 'react-i18next';

function ProjectReportInfoPage() {
  const { t } = useTranslation();

  return (
    <Page className="project-overview-info-page-wrapper" list>
      <PageTitle>{t('리포트')}</PageTitle>
      <PageContent />
    </Page>
  );
}

ProjectReportInfoPage.defaultProps = {};

ProjectReportInfoPage.propTypes = {};

export default ProjectReportInfoPage;
