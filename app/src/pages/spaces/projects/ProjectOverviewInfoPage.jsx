import React, { useEffect, useState } from 'react';
import { Page, PageContent, PageTitle, Title } from '@/components';
import { useTranslation } from 'react-i18next';

import TestrunService from '@/services/TestrunService';
import { useParams } from 'react-router';
import './ProjectOverviewInfoPage.scss';

function ProjectOverviewInfoPage() {
  const { t } = useTranslation();
  const { spaceCode, projectId } = useParams();
  const [testruns, setTestruns] = useState([]);

  useEffect(() => {
    TestrunService.selectProjectTestrunList(spaceCode, projectId, 'ALL', list => {
      setTestruns(list);
    });
  }, [spaceCode]);

  console.log(testruns);

  return (
    <Page className="project-overview-info-page-wrapper" list wide>
      <PageTitle>{t('진행중인 테스트런')}</PageTitle>
      <PageContent flex>
        <Title>{t('진행중인 테스트런')}</Title>
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

ProjectOverviewInfoPage.defaultProps = {};

ProjectOverviewInfoPage.propTypes = {};

export default ProjectOverviewInfoPage;
