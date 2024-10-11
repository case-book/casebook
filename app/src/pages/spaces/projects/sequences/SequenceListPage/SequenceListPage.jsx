import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, EmptyContent, Page, PageContent, PageTitle, Tag } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import ProjectService from '@/services/ProjectService';
import './SequenceListPage.scss';
import SequenceService from '@/services/SequenceService';

function SequenceListPage() {
  const { t } = useTranslation();
  const { spaceCode, projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [sequences, setSequences] = useState([]);

  useEffect(() => {
    ProjectService.selectProjectName(spaceCode, projectId, info => {
      setProject(info);
    });
    SequenceService.selectSequenceList(spaceCode, projectId, list => {
      setSequences(list);
    });
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
            to: `/spaces/${spaceCode}/projects/${projectId}/sequences`,
            text: t('케이스시퀀스'),
          },
        ]}
        links={[
          {
            to: `/spaces/${spaceCode}/projects/${projectId}/sequences/new`,
            text: t('케이스시퀀스'),
            icon: <i className="fa-solid fa-plus" />,
          },
        ]}
        onListClick={() => {
          navigate(`/spaces/${spaceCode}/projects`);
        }}
      >
        {t('케이스시퀀스')}
      </PageTitle>
      <PageContent className="page-content" flex>
        {sequences?.length <= 0 && (
          <EmptyContent fill border>
            {t('조회된 케이스시퀀스가 없습니다.')}
          </EmptyContent>
        )}
        {sequences.length > 0 && (
          <div className="sequence-list">
            {sequences.map(sequence => (
              <Card key={sequence.id} border className="release-card">
                <CardHeader className="sequence-card-header">
                  <Link to={`/spaces/${spaceCode}/projects/${projectId}/sequences/${sequence.id}`}>{sequence.name}</Link>
                </CardHeader>
                <CardContent>
                  <div className="description">
                    <div>{sequence.description}</div>
                  </div>
                  <div className="node-count">
                    <Tag border>{t('@ 테스트케이스', { count: sequence.nodeCount })}</Tag>
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

export default SequenceListPage;
