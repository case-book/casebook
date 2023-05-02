import React, { useEffect, useState } from 'react';
import { Button, Page, PageContent, PageTitle, Radio, Table, Tag, Tbody, Td, Th, THead, Title, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import TestrunService from '@/services/TestrunService';
import './TestrunReservationListPage.scss';
import dateUtil from '@/utils/dateUtil';

function TestrunReservationListPage() {
  const { t } = useTranslation();

  const { spaceCode, projectId } = useParams();
  const navigate = useNavigate();
  const [testrunReservations, setTestrunReservations] = useState([]);

  const [expired, setExpired] = useState(false);

  useEffect(() => {
    TestrunService.selectProjectTestrunReservationList(spaceCode, projectId, expired, list => {
      setTestrunReservations(list);
    });
  }, [expired, spaceCode, projectId]);

  return (
    <Page className="testrun-reservation-list-page-wrapper">
      <PageTitle
        className="page-title"
        links={[
          <Link to={`/spaces/${spaceCode}/projects/${projectId}/testruns/reservations/new`}>
            <i className="fa-solid fa-plus" /> {t('예약 테스트런')}
          </Link>,
        ]}
        control={
          <div>
            <Radio
              size="sm"
              value={false}
              checked={expired === false}
              onChange={() => {
                setExpired(!expired);
              }}
              label={t('유효')}
            />
            <Radio
              size="sm"
              value
              checked={expired}
              onChange={() => {
                setExpired(!expired);
              }}
              label={t('완료')}
            />
          </div>
        }
        onListClick={() => {
          navigate(`/spaces/${spaceCode}/projects`);
        }}
      >
        {t('예약 테스트런')}
      </PageTitle>
      <PageContent className="page-content">
        {testrunReservations?.length <= 0 && (
          <div className="no-project">
            <div>
              <div>{t('예약된 테스트런이 없습니다.')}</div>
              <div>
                <Button
                  outline
                  onClick={() => {
                    navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns/reservations/new`);
                  }}
                >
                  <i className="fa-solid fa-plus" /> {t('예약 테스트런')}
                </Button>
              </div>
            </div>
          </div>
        )}
        {testrunReservations?.length > 0 && (
          <>
            <Title border={false}>{t('예약 테스트런 리스트')}</Title>
            <div className="testrun-reservation-list">
              <Table className="testrun-table" cols={['1px', '100%', '1px', '1px', '1px', '1px']}>
                <THead>
                  <Tr>
                    <Th align="left">{t('타입')}</Th>
                    <Th align="left">{t('이름')}</Th>
                    <Th align="center">{t('테스트 시작일시')}</Th>
                    <Th align="center">{t('테스트 종료일시')}</Th>
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
                          <Tag uppercase>{t(testrunReservation.expired ? '완료' : '예약')}</Tag>
                        </Td>
                        <Td className="name">
                          <Link to={`/spaces/${spaceCode}/projects/${projectId}/testruns/reservations/${testrunReservation.id}/info`}>{testrunReservation.name}</Link>
                        </Td>
                        <Td align="center">
                          <Tag className="tag" uppercase>
                            {dateUtil.getDateString(testrunReservation.startDateTime)}
                          </Tag>
                        </Td>
                        <Td align="center">
                          <Tag className="tag" uppercase>
                            {dateUtil.getDateString(testrunReservation.endDateTime)}
                          </Tag>
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
          </>
        )}
      </PageContent>
    </Page>
  );
}

export default TestrunReservationListPage;
