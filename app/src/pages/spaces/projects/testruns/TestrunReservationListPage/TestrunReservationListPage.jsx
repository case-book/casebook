import React, { useEffect, useState } from 'react';
import { Button, EmptyContent, Page, PageContent, PageTitle, Radio, Table, Tag, Tbody, Td, Th, THead, Title, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import TestrunService from '@/services/TestrunService';
import './TestrunReservationListPage.scss';
import dateUtil from '@/utils/dateUtil';
import ProjectService from '@/services/ProjectService';

function TestrunReservationListPage() {
  const { t } = useTranslation();

  const { spaceCode, projectId } = useParams();
  const navigate = useNavigate();
  const [testrunReservations, setTestrunReservations] = useState([]);
  const [project, setProject] = useState(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    TestrunService.selectProjectTestrunReservationList(spaceCode, projectId, expired, list => {
      setTestrunReservations(list);
    });

    ProjectService.selectProjectName(spaceCode, projectId, info => {
      setProject(info);
    });
  }, [expired, spaceCode, projectId]);

  return (
    <Page className="testrun-reservation-list-page-wrapper" list>
      <PageTitle
        breadcrumbs={[
          {
            to: '/',
            text: t('HOME'),
          },
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
            to: `/spaces/${spaceCode}/projects/${projectId}/testruns/reservations`,
            text: t('예약 테스트런 목록'),
          },
        ]}
        links={[
          {
            to: `/spaces/${spaceCode}/projects/${projectId}/testruns/reservations/new`,
            text: t('예약 테스트런'),
            color: 'primary',
            icon: <i className="fa-solid fa-plus" />,
          },
        ]}
        onListClick={() => {
          navigate(`/spaces/${spaceCode}/projects`);
        }}
      >
        {t('예약 테스트런')}
      </PageTitle>
      <PageContent className="page-content">
        <Title
          border={false}
          marginBottom={false}
          control={
            <div>
              <Radio
                type="inline"
                size="xs"
                value={false}
                checked={expired === false}
                onChange={() => {
                  setExpired(!expired);
                }}
                label={t('예약')}
              />
              <Radio
                type="inline"
                size="xs"
                value
                checked={expired}
                onChange={() => {
                  setExpired(!expired);
                }}
                label={t('완료')}
              />
            </div>
          }
        >
          {t('예약 테스트런 리스트')}
        </Title>
        {testrunReservations?.length <= 0 && (
          <EmptyContent border fill>
            {expired && <div>{t('검색된 테스트런이 없습니다.')}</div>}
            {!expired && (
              <div>
                {t('예약된 테스트런이 없습니다.')}
                <div>
                  <Button
                    outline
                    color="primary"
                    onClick={() => {
                      navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns/reservations/new`);
                    }}
                  >
                    <i className="fa-solid fa-plus" /> {t('예약 테스트런')}
                  </Button>
                </div>
              </div>
            )}
          </EmptyContent>
        )}
        {testrunReservations?.length > 0 && (
          <div className="testrun-reservation-list">
            <Table className="testrun-table" cols={['1px', '100%', '1px', '1px', '1px', '1px']}>
              <THead>
                <Tr>
                  <Th align="left">{t('상태')}</Th>
                  <Th align="left">{t('이름')}</Th>
                  <Th align="left">{t('테스트 시작일시')}</Th>
                  <Th align="left">{t('테스트 종료일시')}</Th>
                  <Th align="center">{t('테스트케이스 그룹')}</Th>
                  <Th align="center">{t('테스트케이스')}</Th>
                  {expired && <Th align="center">{t('테스트런')}</Th>}
                </Tr>
              </THead>
              <Tbody>
                {testrunReservations?.map(testrunReservation => {
                  return (
                    <Tr key={testrunReservation.id}>
                      <Td>
                        <Tag border uppercase>
                          {t(testrunReservation.expired ? '완료' : '예약')}
                        </Tag>
                      </Td>
                      <Td className="name">
                        <Link to={`/spaces/${spaceCode}/projects/${projectId}/testruns/reservations/${testrunReservation.id}/info`}>{testrunReservation.name}</Link>
                      </Td>
                      <Td align="center" className="date">
                        {dateUtil.getDateString(testrunReservation.startDateTime)}
                      </Td>
                      <Td align="center" className="date">
                        {dateUtil.getDateString(testrunReservation.endDateTime)}
                      </Td>
                      <Td className="testcase-count" align="right">
                        {testrunReservation.testcaseGroupCount}
                      </Td>
                      <Td className="testcase-count" align="right">
                        {testrunReservation.testcaseCount}
                      </Td>
                      {expired && (
                        <Td className="testcase-count" align="center">
                          {testrunReservation.testrunId && <Link to={`/spaces/${spaceCode}/projects/${projectId}/reports/${testrunReservation.testrunId}`}>{t('리포트')}</Link>}
                        </Td>
                      )}
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </div>
        )}
      </PageContent>
    </Page>
  );
}

export default TestrunReservationListPage;
