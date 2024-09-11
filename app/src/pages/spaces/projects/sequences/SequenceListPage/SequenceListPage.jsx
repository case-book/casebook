import React, { useEffect, useState } from 'react';
import { EmptyContent, Liner, Page, PageContent, PageTitle, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import dateUtil from '@/utils/dateUtil';
import ProjectService from '@/services/ProjectService';
import './SequenceListPage.scss';
import classNames from 'classnames';
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
      console.log(list);
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
          <ul className="report-list">
            {sequences?.map(sequence => {
              return (
                <li key={sequence.id}>
                  <div className="title">
                    <div className="name">
                      <Link className="hoverable" to={`/spaces/${spaceCode}/projects/${projectId}/reports/${sequence.id}`}>
                        {sequence.name}
                      </Link>
                    </div>
                    <div className="testrun-others">
                      <div className="time-info">
                        <div className="calendar">
                          <i className="fa-regular fa-clock" />
                        </div>
                        {sequence.startDateTime && <div>{dateUtil.getDateString(sequence.startDateTime, 'monthsDaysHoursMinutes')}</div>}
                        <div className={`end-date-info ${!sequence.startDateTime ? 'no-start-time' : ''}`}>
                          {(sequence.startDateTime || sequence.closedDate || sequence.endDateTime) && <Liner width="6px" height="1px" display="inline-block" margin="0 0.5rem" />}
                          {sequence.startDateTime && (sequence.closedDate || sequence.endDateTime) && (
                            <span>{dateUtil.getEndDateString(sequence.startDateTime, sequence.closedDate || sequence.endDateTime)}</span>
                          )}
                          {!sequence.startDateTime && (sequence.closedDate || sequence.endDateTime) && <span>{dateUtil.getDateString(sequence.closedDate || sequence.endDateTime)}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="summary">
                    <div className="testrun-id">
                      <span>{sequence.seqId}</span>
                    </div>
                    <div className="count-summary">
                      <div className="count">
                        <div className="label">{t('진행')}</div>
                        <div>
                          {sequence.progressPercentage}% ({sequence.testedCount}/{sequence.totalTestcaseCount})
                        </div>
                      </div>
                      {sequence.passedTestcaseCount > 0 && (
                        <>
                          <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 0.5rem" />
                          <div
                            className={classNames('count', {
                              success: sequence.passedPercentage > 0,
                            })}
                          >
                            <div className="label">{t('성공')}</div>
                            <div>
                              {sequence.passedPercentage}% ({sequence.passedTestcaseCount}/{sequence.totalTestcaseCount})
                            </div>
                          </div>
                        </>
                      )}
                      {sequence.failedTestcaseCount > 0 && (
                        <>
                          <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 0.5rem" />
                          <div
                            className={classNames('count', {
                              danger: sequence.failedPercentage > 0,
                            })}
                          >
                            <div className="label">{t('실패')}</div>
                            <div>
                              {sequence.failedPercentage}% ({sequence.failedTestcaseCount}/{sequence.totalTestcaseCount})
                            </div>
                          </div>
                        </>
                      )}
                      {sequence.untestableTestcaseCount > 0 && (
                        <>
                          <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 0.5rem" />
                          <div
                            className={classNames('count', {
                              warning: sequence.untestablePercentage > 0,
                            })}
                          >
                            <div className="label">{t('테스트 불가')}</div>
                            <div>
                              {sequence.untestablePercentage}% ({sequence.untestableTestcaseCount}/{sequence.totalTestcaseCount})
                            </div>
                          </div>
                        </>
                      )}
                      {sequence.notTestedCount > 0 && (
                        <>
                          <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 0.5rem" />
                          <div
                            className={classNames('count', {
                              warning: sequence.notTestedPercentage > 0,
                            })}
                          >
                            <div className="label">{t('미수행')}</div>
                            <div>
                              {sequence.notTestedPercentage}% ({sequence.notTestedCount}/{sequence.totalTestcaseCount})
                            </div>
                          </div>
                        </>
                      )}
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

export default SequenceListPage;
