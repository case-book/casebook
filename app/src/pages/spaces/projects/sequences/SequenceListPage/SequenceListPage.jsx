import React, { useEffect, useState } from 'react';
import { EmptyContent, Page, PageContent, PageTitle, Table, Tbody, Td, Th, THead, Title, Tr } from '@/components';
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
            text: t('케이스 시퀀스'),
          },
        ]}
        links={[
          {
            to: `/spaces/${spaceCode}/projects/${projectId}/sequences/new`,
            text: t('케이스 시퀀스'),
            icon: <i className="fa-solid fa-plus" />,
          },
        ]}
        onListClick={() => {
          navigate(`/spaces/${spaceCode}/projects`);
        }}
      >
        {t('케이스 시퀀스')}
      </PageTitle>
      <PageContent className="page-content" flex>
        <Title border={false} marginBottom={false}>
          {t('케이스 시퀀스')}
        </Title>
        {sequences?.length <= 0 && (
          <EmptyContent fill border>
            {t('조회된 케이스 시퀀스가 없습니다.')}
          </EmptyContent>
        )}
        {sequences?.length > 0 && (
          <Table className="table" cols={['300px', '']} border>
            <THead>
              <Tr>
                <Th align="left">{t('이름')}</Th>
                <Th align="left">{t('설명')}</Th>
              </Tr>
            </THead>
            <Tbody>
              {sequences.map(sequence => {
                return (
                  <Tr key={sequence.id}>
                    <Td>
                      <Link className="g-text-link" to={`/spaces/${spaceCode}/projects/${projectId}/sequences/${sequence.id}`}>
                        {sequence.name}
                      </Link>
                    </Td>
                    <Td>{sequence.description}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        )}
      </PageContent>
    </Page>
  );
}

export default SequenceListPage;
