import React, { useEffect, useState } from 'react';
import { EmptyContent, Page, PageContent, PageTitle, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import ProjectService from '@/services/ProjectService';
import './OpenLinkListPage.scss';
import OpenLinkService from '@/services/OpenLinkService';

function OpenLinkListPage() {
  const { t } = useTranslation();
  const { spaceCode, projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [openLinks, setOpenLinks] = useState([]);

  useEffect(() => {
    ProjectService.selectProjectName(spaceCode, projectId, info => {
      setProject(info);
    });
  }, [spaceCode, projectId]);

  const selectOpenLinkList = () => {
    OpenLinkService.selectOpenLinkList(spaceCode, projectId, list => {
      setOpenLinks(list);
    });
  };

  useEffect(() => {
    selectOpenLinkList();
  }, [spaceCode, projectId]);

  return (
    <Page className="report-list-page-wrapper">
      <PageTitle
        breadcrumbs={[
          {
            to: '/',
            text: t('HOME'),
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
            to: `/spaces/${spaceCode}/projects/${projectId}/reports`,
            text: t('리포트'),
          },
        ]}
        links={[
          {
            to: `/spaces/${spaceCode}/projects/${projectId}/links/new`,
            text: t('오픈 링크'),
            icon: <i className="fa-solid fa-plus" />,
          },
        ]}
        onListClick={() => {
          navigate(`/spaces/${spaceCode}/projects`);
        }}
      >
        {t('오픈 링크')}
      </PageTitle>
      <PageContent className="page-content" flex>
        <Title border={false} marginBottom={false}>
          {t('오픈 링크')}
        </Title>
        {openLinks?.length <= 0 && (
          <EmptyContent fill border>
            {t('조회된 오픈 링크가 없습니다.')}
          </EmptyContent>
        )}
        {openLinks?.length > 0 && (
          <ul className="report-list">
            {openLinks?.map(testrun => {
              return (
                <li key={testrun.id}>
                  <div className="title">
                    <div className="name">
                      <Link className="hoverable" to={`/spaces/${spaceCode}/projects/${projectId}/links/${testrun.id}`}>
                        {testrun.name}
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </PageContent>
    </Page>
  );
}

export default OpenLinkListPage;
