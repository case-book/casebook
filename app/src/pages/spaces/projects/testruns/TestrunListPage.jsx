import React, { useEffect, useState } from 'react';
import { Button, Card, Page, PageContent, PageTitle, Radio, Tag } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import TestrunService from '@/services/TestrunService';
import dateUtil from '@/utils/dateUtil';
import moment from 'moment';
import './TestrunListPage.scss';

function TestrunListPage() {
  const { t } = useTranslation();
  const { spaceCode, projectId } = useParams();
  const navigate = useNavigate();
  const [testruns, setTestruns] = useState([]);
  const [status, setStatus] = useState('OPENED');

  useEffect(() => {
    TestrunService.selectProjectTestrunList(spaceCode, projectId, status, list => {
      setTestruns(list);
    });
  }, [spaceCode, status]);

  return (
    <Page className="testrun-list-page-wrapper" list wide>
      <PageTitle
        className="page-title"
        links={[
          <Link to={`/spaces/${spaceCode}/projects/${projectId}/testruns/new`}>
            <i className="fa-solid fa-plus" /> {t('테스트 런')}
          </Link>,
        ]}
        control={
          <div>
            <Radio
              size="sm"
              value="ALL"
              type="line"
              checked={status === 'ALL'}
              onChange={val => {
                setStatus(val);
              }}
              label="ALL"
            />
            <Radio
              size="sm"
              value="OPENED"
              type="line"
              checked={status === 'OPENED'}
              onChange={val => {
                setStatus(val);
              }}
              label="OPENED"
            />
            <Radio
              size="sm"
              value="CLOSED"
              type="line"
              checked={status === 'CLOSED'}
              onChange={val => {
                setStatus(val);
              }}
              label="CLOSED"
            />
          </div>
        }
      >
        {t('테스트 런')}
      </PageTitle>
      <PageContent className="content">
        {testruns?.length <= 0 && (
          <div className="no-project">
            <div>
              <div>{t('아직 실행된 테스트런이 없습니다.')}</div>
              <div>
                <Button
                  outline
                  onClick={() => {
                    navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns/new`);
                  }}
                >
                  <i className="fa-solid fa-plus" /> {t('테스트 런')}
                </Button>
              </div>
            </div>
          </div>
        )}
        {testruns?.length > 0 && (
          <ul className="testrun-list">
            {testruns?.map(testrun => {
              const span = dateUtil.getSpan(moment.utc(), moment.utc(testrun.endDateTime));

              return (
                <li key={testrun.id}>
                  <Card className="testrun-card" circle={false}>
                    <div className="testrun-name">
                      <div className="seq-id">
                        <Tag>{testrun.seqId}</Tag>
                      </div>
                      <div className="name">
                        <Link to={`/spaces/${spaceCode}/projects/${projectId}/testruns/${testrun.id}`}>{testrun.name}</Link>
                      </div>
                      <div className="status">
                        <Tag className={`tag ${testrun.opened ? 'OPENED' : 'CLOSED'}`}>{testrun.opened ? 'OPENED' : 'CLOSED'}</Tag>
                      </div>
                    </div>
                    <div className="date-range">
                      {testrun.startDateTime && <div className="start-date">{dateUtil.getDateString(testrun.startDateTime)}</div>}
                      {(testrun.startDateTime || testrun.endDateTime) && (
                        <div className="dash">
                          <div />
                        </div>
                      )}
                      {testrun.startDateTime && testrun.endDateTime && <div className="end-date">{dateUtil.getEndDateString(testrun.startDateTime, testrun.endDateTime)}</div>}
                      {!testrun.startDateTime && testrun.endDateTime && <div className="end-date">{dateUtil.getDateString(testrun.endDateTime)}</div>}
                      {!testrun.startDateTime && !testrun.endDateTime && <div className="no-date">{t('설정된 테스트런 기간이 없습니다.')}</div>}
                      {testrun.opened && span.days > 0 && (
                        <div className="span-info">
                          {span.days}
                          {t('일 남음')}
                        </div>
                      )}
                      {testrun.opened && span.days <= 0 && span.hours > 0 && (
                        <div className="span-info">
                          {span.hours}
                          {t('시간 남음')}
                        </div>
                      )}
                      {testrun.opened && span.days <= 0 && span.hours <= 0 && <div className="span-info time-passed">{t('기간 지남')}</div>}
                    </div>
                    <div className="count-info">
                      <div className="bar">
                        <div
                          className={`passed ${testrun.failedTestcaseCount > 0 ? 'has-failed' : ''}`}
                          style={{
                            width: `${(testrun.passedTestcaseCount / testrun.totalTestcaseCount) * 100}%`,
                          }}
                        />
                        <div
                          className={`failed ${testrun.passedTestcaseCount > 0 ? 'has-passed' : ''}`}
                          style={{
                            width: `${(testrun.failedTestcaseCount / testrun.totalTestcaseCount) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="total-count passed">
                        <span>
                          <span>{testrun.passedTestcaseCount}</span>
                        </span>
                      </div>
                      <div className="slash">
                        <div />
                      </div>
                      <div className="total-count failed">
                        <span>
                          <span>{testrun.failedTestcaseCount}</span>
                        </span>
                      </div>
                      <div className="slash">
                        <div />
                      </div>
                      <div className="total-count total">
                        <span>
                          <span>{testrun.totalTestcaseCount}</span>
                        </span>
                      </div>
                    </div>
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
