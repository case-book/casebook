import React from 'react';
import './ProjectOverview.scss';
import { Page, PageContent, PageTitle } from '@/components';
import { useTranslation } from 'react-i18next';

function ProjectOverview() {
  const { t } = useTranslation();

  return (
    <Page className="edit-project-wrapper">
      <PageTitle>{t('OVERVIEW')}</PageTitle>
      <PageContent>OVER</PageContent>
    </Page>
  );
}

ProjectOverview.defaultProps = {};

ProjectOverview.propTypes = {};

export default ProjectOverview;
