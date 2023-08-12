import { EmptyContent, Page, PageContent, PageTitle, THead, Table, Tbody, Th, Title, Tr, Td } from '@/components';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import React, { useState, useEffect } from 'react';
import ProjectService from '@/services/ProjectService';
import ReleaseService from '@/services/ReleaseService';
import './ReleaseListPage.scss';

function ReleaseListPage() {
  const { t } = useTranslation();
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
      >
        {t('릴리즈')}
      </PageTitle>
      <PageContent>
        <Title>{t('릴리즈')}</Title>
        {releases.length <= 0 && <EmptyContent fill>{t('조회된 릴리즈가 없습니다.')}</EmptyContent>}
        {releases.length > 0 && (
          <div>
            <Table>
              <THead>
                <Tr>
                  <Th>{t('릴리즈 이름')}</Th>
                  <Th>{t('테스트케이스 히스토리')}</Th>
                </Tr>
              </THead>
              <Tbody>
                {releases.map(release => (
                  <Tr key={release.id}>
                    <Td>{release.name}</Td>
                    <Td>test</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
        )}
      </PageContent>
    </Page>
  );
}

ReleaseListPage.propTypes = {};

ReleaseListPage.defaultProps = {};

export default ReleaseListPage;
