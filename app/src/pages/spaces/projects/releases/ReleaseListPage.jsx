import { EmptyContent, Page, PageContent, PageTitle, Title, Card, CardHeader, CardContent, Button } from '@/components';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';
import React, { useState, useEffect } from 'react';
import ProjectService from '@/services/ProjectService';
import ReleaseService from '@/services/ReleaseService';
import './ReleaseListPage.scss';

function ReleaseListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { spaceCode, projectId } = useParams();
  const [project, setProject] = useState(null);
  const [releases, setReleases] = useState([]);

  useEffect(() => {
    ProjectService.selectProjectName(spaceCode, projectId, info => {
      setProject(info);
    });
    ReleaseService.selectReleaseList(spaceCode, projectId, list => {
      setReleases(list);
    });
  }, [spaceCode, projectId]);

  return (
    <Page className="release-list-page-wrapper">
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
        ]}
        links={[
          {
            to: `/spaces/${spaceCode}/projects/${projectId}/releases/new`,
            text: t('릴리즈'),
            color: 'primary',
            icon: <i className="fa-solid fa-plus" />,
          },
        ]}
      >
        {t('릴리즈')}
      </PageTitle>
      <PageContent>
        <Title>{t('릴리즈')}</Title>
        {releases.length <= 0 && <EmptyContent fill>{t('조회된 릴리즈가 없습니다.')}</EmptyContent>}
        {releases.length > 0 && (
          <div className="release-cards">
            {releases.map(release => (
              <Card key={release.id} shadow border className="release-card" point>
                <CardHeader
                  className="release-card-header"
                  control={
                    <div className="release-card-header-control">
                      <Button rounded onClick={() => navigate(`./../testruns/new?releaseId=${release.id}`)}>
                        <i className="fa-solid fa-play" />
                      </Button>
                      <Button rounded onClick={() => navigate(`${release.id}`)}>
                        <i className="fa-solid fa-gear" />
                      </Button>
                    </div>
                  }
                >
                  {release.name}
                </CardHeader>
                <CardContent>{release.description ?? t('릴리즈 설명이 없습니다.')}</CardContent>
              </Card>
            ))}
          </div>
        )}
      </PageContent>
    </Page>
  );
}

ReleaseListPage.propTypes = {};

ReleaseListPage.defaultProps = {};

export default ReleaseListPage;
