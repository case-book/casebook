import { Button, Card, CardContent, CardHeader, EmptyContent, Page, PageContent, PageTitle } from '@/components';
import { useTranslation } from 'react-i18next';

import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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

  const createNextReleaseButtonClick = useCallback(name => {
    let nextVersion = '';
    try {
      const version3Pattern = /^(.*?)(v|V)(\d+)\.(\d+)\.(\d+)$/;
      const match3 = name.match(version3Pattern);

      if (match3) {
        const prefix = match3[1];
        const v = match3[2];
        const major = parseInt(match3[3], 10);
        const minor = parseInt(match3[4], 10);
        const patch = 0;

        // minor 버전을 1 증가시킨 새로운 버전 문자열 생성
        const newMinor = minor + 1;
        nextVersion = `${prefix}${v}${major}.${newMinor}.${patch}`;
      }

      const version2Pattern = /^(.*?)(v|V)(\d+)\.(\d+)$/;
      const match2 = name.match(version2Pattern);

      if (match2) {
        const prefix = match2[1];
        const v = match2[2];
        const major = parseInt(match2[3], 10);
        const minor = parseInt(match2[4], 10);

        // minor 버전을 1 증가시킨 새로운 버전 문자열 생성
        const newMinor = minor + 1;
        nextVersion = `${prefix}${v}${major}.${newMinor}`;
      }

      const version1Pattern = /^(.*?)(v|V)(\d+)$/;
      const match1 = name.match(version1Pattern);

      if (match1) {
        const prefix = match1[1];
        const v = match1[2];
        const major = parseInt(match1[3], 10);

        // minor 버전을 1 증가시킨 새로운 버전 문자열 생성
        const newMajor = major + 1;
        nextVersion = `${prefix}${v}${newMajor}`;
      }
    } catch (e) {
      console.error(e);
    }

    if (!nextVersion) {
      nextVersion = name;
    }

    navigate(`/spaces/${spaceCode}/projects/${projectId}/releases/new?name=${nextVersion}`);
  }, []);

  return (
    <Page className="release-list-page-wrapper">
      <PageTitle
        borderBottom={false}
        marginBottom={false}
        breadcrumbs={[
          { to: '/', text: t('HOME') },
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
            text: t('릴리스 목록'),
          },
        ]}
        links={[
          {
            to: `/spaces/${spaceCode}/projects/${projectId}/releases/new`,
            text: t('릴리스'),
            color: 'primary',
            icon: <i className="fa-solid fa-plus" />,
          },
        ]}
        onListClick={() => {
          navigate(`/spaces/${spaceCode}/projects`);
        }}
      >
        {t('릴리스')}
      </PageTitle>
      <PageContent className="page-content">
        {releases.length <= 0 && (
          <EmptyContent border fill>
            <div>
              <div>{t('조회된 릴리스가 없습니다.')}</div>
              <div>
                <Button
                  outline
                  color="primary"
                  onClick={() => {
                    navigate(`/spaces/${spaceCode}/projects/${projectId}/releases/new`);
                  }}
                >
                  <i className="fa-solid fa-plus" /> {t('릴리스 생성')}
                </Button>
              </div>
            </div>
          </EmptyContent>
        )}
        {releases.length > 0 && (
          <div className="release-cards">
            {releases.map(release => (
              <Card key={release.id} border className="release-card">
                <CardHeader className="release-card-header">
                  <Link to={`/spaces/${spaceCode}/projects/${projectId}/releases/${release.id}`}>{release.name}</Link>
                  {release.isTarget && (
                    <div className="target">
                      <div className="triangle" />
                      <div className="text">TARGET</div>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="description">
                    <div>{release.description ?? t('릴리스 설명이 없습니다.')}</div>
                  </div>
                  <div className="release-content">
                    <div className="testcase-count">
                      <div className="icon">
                        <span>
                          <i className="fa-solid fa-vial-virus" />
                        </span>
                      </div>
                      <div className="count">
                        <span>{release.testcases?.length || 0}</span>
                      </div>
                    </div>
                    <div className="buttons">
                      <Button className="create-next-release-button" tip={t('다음 릴리스 생성')} onClick={() => createNextReleaseButtonClick(release.name)}>
                        <i className="fa-solid fa-plus" />
                        <i className="fa-solid fa-code-branch" />
                      </Button>
                      <Button className="create-testrun-button" tip={t('테스트런 만들기')} onClick={() => navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns/new?releaseId=${release.id}`)}>
                        <i className="fa-solid fa-plus" />
                        <i className="fa-solid fa-scale-unbalanced-flip" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
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
