import React, { useEffect, useState } from 'react';
import { Button, Card, Page, PageContent, PageTitle } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import './TestrunListPage.scss';
import TestrunService from '@/services/TestrunService';
import dateUtil from '@/utils/dateUtil';

function TestrunListPage() {
  const { t } = useTranslation();
  const { spaceCode, projectId } = useParams();
  const navigate = useNavigate();
  const [testruns, setTestruns] = useState([]);

  useEffect(() => {
    TestrunService.selectProjectTestrunList(spaceCode, projectId, list => {
      console.log(list);
      setTestruns(list);
    });
  }, [spaceCode]);

  return (
    <Page className="testrun-list-page-wrapper" list wide>
      <PageTitle
        className="page-title"
        links={[
          <Link to={`/spaces/${spaceCode}/projects/${projectId}/testruns/new`}>
            <i className="fa-solid fa-plus" /> {t('테스트 런')}
          </Link>,
        ]}
      >
        {t('테스트 런')}
      </PageTitle>
      <PageContent className="content">
        {testruns?.length <= 0 && (
          <div className="no-project">
            <div>
              <div>아직 실행된 테스트런이 없습니다.</div>
              <div>
                <Button
                  size="lg"
                  outline
                  onClick={() => {
                    navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns/new`);
                  }}
                >
                  <i className="fa-solid fa-plus" /> 테스트 런
                </Button>
              </div>
            </div>
          </div>
        )}
        {testruns?.length > 0 && (
          <ul className="testrun-list">
            {testruns?.map(testrun => {
              return (
                <li key={testrun.id}>
                  <Card className="testrun-card" circle>
                    <div>{testrun.name}</div>
                    <div>{testrun.seqId}</div>
                    <div>{testrun.description}</div>
                    <div>{testrun.opened ? 'OPENED' : 'CLOSED'}</div>
                    <div>
                      <div>{dateUtil.getDateString(testrun.startDateTime)}</div>
                      <div>{dateUtil.getDateString(testrun.endDateTime)}</div>
                    </div>
                    <div>{testrun.passedTestcaseCount}</div>
                    <div>{testrun.totalTestcaseCount}</div>
                    <div>{testrun.totalTestcaseCount}</div>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </PageContent>
    </Page>
  );
}

export default TestrunListPage;
