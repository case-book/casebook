import { Button, Card, CardContent, CardHeader, EmptyContent, Page, PageContent, PageTitle, Table, Tag, Tbody, Td, Th, THead, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import React, { useEffect, useState } from 'react';
import ProjectService from '@/services/ProjectService';
import ReleaseService from '@/services/ReleaseService';
import './ReleaseListPage.scss';
import { Link } from 'react-router-dom';
import dateUtil from '@/utils/dateUtil';

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
        borderBottom={false}
        marginBottom={false}
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
        {releases?.length > 0 && (
          <div className="release-table">
            <Table cols={['', '120px', '240px']}>
              <THead>
                <Tr>
                  <Th align="left">{t('이름')}</Th>
                  <Th align="right">{t('테스트케이스')}</Th>
                  <Th align="center" className="creation-date">
                    {t('생성 일시')}
                  </Th>
                </Tr>
              </THead>
              <Tbody>
                {releases?.map(release => {
                  return (
                    <Tr key={release.id}>
                      <Td className="name">
                        <Link to={`/spaces/${spaceCode}/projects/${projectId}/releases/${release.id}`}>
                          {release.name}
                          {release.isTarget && (
                            <Tag size="xs" color="secondary" className="target">
                              {t('타겟 릴리즈')}
                            </Tag>
                          )}
                        </Link>
                      </Td>
                      <Td align="right">{release.testcases?.length || 0}</Td>
                      <Td className="creation-date" align="center">
                        {dateUtil.getDateString(release.creationDate)}
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </div>
        )}
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
                <CardContent>
                  <div className="description">
                    <div>{release.description ?? t('릴리스 설명이 없습니다.')}</div>
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
