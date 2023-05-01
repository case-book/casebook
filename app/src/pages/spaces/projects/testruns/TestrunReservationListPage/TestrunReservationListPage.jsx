import React, { useEffect, useState } from 'react';
import { Button, Page, PageContent, PageTitle, Radio, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import TestrunService from '@/services/TestrunService';
import ReserveTestrunList from './ReserveTestrunList';
import './TestrunReservationListPage.scss';

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
  }, [expired, spaceCode]);

  return (
    <Page className="testrun0reservation-list-page-wrapper">
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
            <ReserveTestrunList projectId={projectId} spaceCode={spaceCode} testrunReservations={testrunReservations} expired={expired} />
          </>
        )}
      </PageContent>
    </Page>
  );
}

export default TestrunReservationListPage;
