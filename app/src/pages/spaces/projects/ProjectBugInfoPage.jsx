import React from 'react';
import { Page, PageContent, PageTitle } from '@/components';
import { useTranslation } from 'react-i18next';

function ProjectBugInfoPage() {
  const { t } = useTranslation();

  return (
    <Page className="project-overview-info-page-wrapper" list>
      <PageTitle>{t('버그')}</PageTitle>
      <PageContent flex>
        <div className="g-empty-message">
          <div>
            <div className="icon">
              <i className="fa-solid fa-circle-info" />
            </div>
            <div className="message">[ 아직 개발되지 않은 페이지입니다 ]</div>
          </div>
        </div>
      </PageContent>
    </Page>
  );
}

ProjectBugInfoPage.defaultProps = {};

ProjectBugInfoPage.propTypes = {};

export default ProjectBugInfoPage;
