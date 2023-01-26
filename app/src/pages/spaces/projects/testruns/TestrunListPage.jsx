import React, { useEffect, useState } from 'react';
import { Button, Card, Liner, Page, PageContent, PageTitle, Radio, Table, Tag, Tbody, Td, Th, THead, Title, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import TestrunService from '@/services/TestrunService';
import dateUtil from '@/utils/dateUtil';
import moment from 'moment';
import { DURATIONS } from '@/constants/constants';
import useQueryString from '@/hooks/useQueryString';
import './TestrunListPage.scss';

function TestrunListPage() {
  const { t } = useTranslation();
  const { spaceCode, projectId } = useParams();
  const navigate = useNavigate();
  const [testruns, setTestruns] = useState([]);
  const [status, setStatus] = useState('OPENED');
  const { query, setQuery } = useQueryString();
  const { type = 'CREATE' } = query;

  useEffect(() => {
    if (type === 'CREATE') {
      TestrunService.selectProjectTestrunList(spaceCode, projectId, status, 'CREATE', list => {
        setTestruns(list);
      });
    } else {
      TestrunService.selectProjectTestrunList(spaceCode, projectId, '', type, list => {
        setTestruns(list);
      });
    }
  }, [type, spaceCode, status]);

  const onChangeSearchTestrunCreationType = value => {
    if (value) {
      setStatus('OPENED');
    }
    setQuery({ type: value });
  };

  return (
    <Page className="testrun-list-page-wrapper" wide>
      <PageTitle
        className="page-title"
        links={[
          <Link to={`/spaces/${spaceCode}/projects/${projectId}/testruns/new`}>
            <i className="fa-solid fa-plus" /> {t('테스트 런')}
          </Link>,
        ]}
        control={
          <div className="options">
            {type === 'CREATE' && (
              <>
                <div>
                  <Radio
                    size="sm"
                    value="ALL"
                    type="line"
                    checked={status === 'ALL'}
                    onChange={val => {
                      setStatus(val);
                    }}
                    label={t('전체')}
                  />
                  <Radio
                    size="sm"
                    value="OPENED"
                    type="line"
                    checked={status === 'OPENED'}
                    onChange={val => {
                      setStatus(val);
                    }}
                    label={t('진행 중인 테스트런')}
                  />
                  <Radio
                    size="sm"
                    value="CLOSED"
                    type="line"
                    checked={status === 'CLOSED'}
                    onChange={val => {
                      setStatus(val);
                    }}
                    label={t('종료된 테스트런')}
                  />
                </div>
                <Liner className="dash" width="1px" height="10px" display="inline-block" color="black" margin="0 0.75rem 0 0.5rem" />
              </>
            )}

            <div>
              <Radio
                size="sm"
                value="CREATE"
                checked={type === 'CREATE'}
                onChange={val => {
                  onChangeSearchTestrunCreationType(val);
                }}
                label="테스트런"
              />
              <Radio
                size="sm"
                value="RESERVE"
                checked={type === 'RESERVE'}
                onChange={val => {
                  onChangeSearchTestrunCreationType(val);
                }}
                label="예약"
              />
              <Radio
                size="sm"
                value="ITERATION"
                checked={type === 'ITERATION'}
                onChange={val => {
                  onChangeSearchTestrunCreationType(val);
                }}
                label="반복"
              />
            </div>
          </div>
        }
      >
        {t('테스트 런')}
      </PageTitle>
      <PageContent className="page-content">
        {testruns?.length <= 0 && (
          <div className="no-project">
            <div>
              <div>{t('조회된 테스트런이 없습니다.')}</div>
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
        {type === 'RESERVE' && testruns?.length > 0 && (
          <>
            <Title border={false}>{t('예약 테스트런 리스트')}</Title>
            <div className="table-content">
              <Table className="testrun-table" cols={['1px', '100%', '1px', '1px', '1px', '1px']}>
                <THead>
                  <Tr>
                    <Th align="left">{t('타입')}</Th>
                    <Th align="left">{t('이름')}</Th>
                    <Th align="center">{t('테스트 시작일시')}</Th>
                    <Th align="center">{t('테스트 종료일시')}</Th>
                    <Th align="center">{t('테스트케이스 개수')}</Th>
                    <Th align="center">{t('처리 상태')}</Th>
                  </Tr>
                </THead>
                <Tbody>
                  {testruns?.map(testrun => {
                    return (
                      <Tr key={testrun.id}>
                        <Td>
                          <Tag uppercase>{t(testrun.creationType)}</Tag>
                        </Td>
                        <Td className="name">
                          <Link to={`/spaces/${spaceCode}/projects/${projectId}/testruns/${testrun.id}/edit`}>{testrun.name}</Link>
                        </Td>
                        <Td align="center">
                          <Tag className="tag" uppercase>
                            {dateUtil.getDateString(testrun.startDateTime)}
                          </Tag>
                        </Td>
                        <Td align="center">
                          <Tag className="tag" uppercase>
                            {dateUtil.getDateString(testrun.endDateTime)}
                          </Tag>
                        </Td>
                        <Td className="testcase-count" align="right">
                          {t('@ 테스트케이스', { count: testrun.totalTestcaseCount })}
                        </Td>
                        <Td align="center">
                          {testrun.creationType === 'RESERVE' && (
                            <Tag className="tag" uppercase>
                              {testrun.reserveExpired ? t('생성 완료') : t('미처리')}
                            </Tag>
                          )}
                          {testrun.creationType === 'ITERATION' && (
                            <Tag className="tag" uppercase>
                              {testrun.reserveExpired ? t('만료') : t('반복중')}
                            </Tag>
                          )}
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </div>
          </>
        )}
        {type === 'ITERATION' && testruns?.length > 0 && (
          <>
            <Title border={false}>{t('반복 테스트런 리스트')}</Title>
            <div className="table-content">
              <Table className="testrun-table" cols={['1px', '100%', '1px', '1px', '1px', '1px', '1px', '1px', '1px']}>
                <THead>
                  <Tr>
                    <Th align="center">{t('타입')}</Th>
                    <Th align="left">{t('이름')}</Th>
                    <Th align="center">{t('반복 시작 일시')}</Th>
                    <Th align="center">{t('반복 종료 일시')}</Th>
                    <Th align="left">{t('반복 정보')}</Th>
                    <Th align="center">{t('시작 시간')}</Th>
                    <Th align="center">{t('테스트 기간')}</Th>
                    <Th align="center">{t('테스트케이스 개수')}</Th>
                    <Th align="center">{t('처리 상태')}</Th>
                  </Tr>
                </THead>
                <Tbody>
                  {testruns?.map(testrun => {
                    return (
                      <Tr key={testrun.id}>
                        <Td align="center">
                          <Tag uppercase>{t(testrun.creationType)}</Tag>
                        </Td>
                        <Td className="name">
                          <Link to={`/spaces/${spaceCode}/projects/${projectId}/testruns/${testrun.id}/edit`}>{testrun.name}</Link>
                        </Td>
                        <Td align="center">
                          <Tag className="tag" uppercase>
                            {dateUtil.getDateString(testrun.startDateTime)}
                          </Tag>
                        </Td>
                        <Td align="center">
                          <Tag className="tag" uppercase>
                            {dateUtil.getDateString(testrun.endDateTime)}
                          </Tag>
                        </Td>
                        <Td>
                          {testrun.creationType === 'ITERATION' &&
                            [t('월'), t('화'), t('수'), t('목'), t('금'), t('토'), t('일')].map((day, jnx) => {
                              if (testrun.days[jnx] === '1') {
                                return (
                                  <Tag key={jnx} className="day" uppercase border color="transparent">
                                    {day}
                                  </Tag>
                                );
                              }

                              return undefined;
                            })}
                          {testrun.creationType === 'ITERATION' && (
                            <Tag className={`day ${testrun.onHoliday ? 'selected' : ''}`} uppercase border color="transparent">
                              {testrun.onHoliday ? t('휴일 포함') : t('휴일 제외')}
                            </Tag>
                          )}
                        </Td>
                        <Td className="start-time" align="center">
                          {dateUtil.getHourMinute(testrun.startTime)}
                        </Td>
                        <Td className="duration" align="right">
                          {DURATIONS.find(d => d.key === testrun.durationHours)?.value || t('@ 시간', { hours: testrun.durationHours })}
                        </Td>
                        <Td className="testcase-count" align="right">
                          {t('@ 테스트케이스', { count: testrun.totalTestcaseCount })}
                        </Td>
                        <Td align="center">
                          {testrun.creationType === 'RESERVE' && (
                            <Tag className="tag" uppercase>
                              {testrun.reserveExpired ? '생성됨' : '미처리'}
                            </Tag>
                          )}
                          {testrun.creationType === 'ITERATION' && (
                            <Tag className="tag" uppercase>
                              {testrun.reserveExpired ? '만료' : '반복중'}
                            </Tag>
                          )}
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </div>
          </>
        )}
        {type === 'CREATE' && testruns?.length > 0 && (
          <ul className="testrun-list">
            {testruns?.map(testrun => {
              const span = dateUtil.getSpan(moment.utc(), moment.utc(testrun.endDateTime));

              const isCreateType = testrun.creationType === 'CREATE';

              return (
                <li key={testrun.id}>
                  <Card className="testrun-card" circle={false}>
                    <div className="testrun-info">
                      <div className="testrun-name">
                        {isCreateType && (
                          <div className="seq-id">
                            <Tag size="xs" border>
                              {testrun.seqId}
                            </Tag>
                          </div>
                        )}
                        <div className="name">
                          <Link to={`/spaces/${spaceCode}/projects/${projectId}/testruns/${testrun.id}`}>{testrun.name}</Link>
                        </div>
                      </div>
                      {isCreateType && (
                        <div className="testrun-status-and-date">
                          <div className="status">
                            <Tag className={`tag ${testrun.opened ? 'OPENED' : 'CLOSED'}`}>{testrun.opened ? 'OPENED' : 'CLOSED'}</Tag>
                          </div>
                          <Liner className="status-liner" display="inline-block" width="1px" height="12px" margin="0 0.5rem" />
                          {testrun.startDateTime && <div className="start-date">{dateUtil.getDateString(testrun.startDateTime)}</div>}
                          {(testrun.startDateTime || testrun.endDateTime) && (
                            <div className="dash">
                              <div />
                            </div>
                          )}
                          {testrun.startDateTime && testrun.endDateTime && <div className="end-date">{dateUtil.getEndDateString(testrun.startDateTime, testrun.endDateTime)}</div>}
                          {!testrun.startDateTime && testrun.endDateTime && <div className="end-date">{dateUtil.getDateString(testrun.endDateTime)}</div>}
                          {!testrun.startDateTime && !testrun.endDateTime && <div className="no-date">{t('설정된 테스트런 기간이 없습니다.')}</div>}
                          {testrun.opened && <Liner className="range-liner" display="inline-block" width="1px" height="12px" margin="0 0.5rem" />}
                          {testrun.opened && span.days > 0 && <div className="span-info">{t('@ 일 남음', { days: span.days })}</div>}
                          {testrun.opened && span.days <= 0 && span.hours > 0 && <div className="span-info">{t('@ 시간 남음', { hours: span.hours })}</div>}
                          {testrun.opened && span.days <= 0 && span.hours <= 0 && <div className="span-info time-passed">{t('기간 지남')}</div>}
                        </div>
                      )}
                      {!isCreateType && (
                        <div className="testrun-status-and-date">
                          {testrun.startDateTime && <div className="start-date">{dateUtil.getDateString(testrun.startDateTime)}</div>}
                          {(testrun.startDateTime || testrun.endDateTime) && (
                            <div className="dash">
                              <div />
                            </div>
                          )}
                          {testrun.startDateTime && testrun.endDateTime && <div className="end-date">{dateUtil.getEndDateString(testrun.startDateTime, testrun.endDateTime)}</div>}
                          {!testrun.startDateTime && testrun.endDateTime && <div className="end-date">{dateUtil.getDateString(testrun.endDateTime)}</div>}
                          {!testrun.startDateTime && !testrun.endDateTime && <div className="no-date">{t('설정된 테스트런 기간이 없습니다.')}</div>}
                        </div>
                      )}
                    </div>
                    {isCreateType && (
                      <div className="testrun-summary">
                        <div className="summary-box">
                          <div className="percentage passed">
                            <div
                              className={`passed-bar ${testrun.failedTestcaseCount > 0 ? 'has-failed' : ''}`}
                              style={{
                                height: `${(testrun.passedTestcaseCount / testrun.totalTestcaseCount) * 100}%`,
                              }}
                            />
                            <div className="count-info">
                              <div className="number">{Math.round((testrun.passedTestcaseCount / testrun.totalTestcaseCount) * 1000) / 10}%</div>
                              <div>
                                <Tag border color="white">
                                  PASSED
                                </Tag>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="summary-box">
                          <div className="percentage failed">
                            <div
                              className={`failed-bar ${testrun.passedTestcaseCount > 0 ? 'has-passed' : ''}`}
                              style={{
                                height: `${(testrun.failedTestcaseCount / testrun.totalTestcaseCount) * 100}%`,
                              }}
                            />
                            <div className="count-info">
                              <div className="number">{Math.round((testrun.failedTestcaseCount / testrun.totalTestcaseCount) * 1000) / 10}%</div>
                              <div>
                                <Tag border color="white">
                                  FAILED
                                </Tag>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="summary-box">
                          <div
                            className={`passed-bar ${testrun.failedTestcaseCount > 0 ? 'has-failed' : ''}`}
                            style={{
                              height: `${(testrun.passedTestcaseCount / testrun.totalTestcaseCount) * 100}%`,
                            }}
                          />
                          <div
                            className={`failed-bar ${testrun.passedTestcaseCount > 0 ? 'has-passed' : ''}`}
                            style={{
                              top: `${(testrun.passedTestcaseCount / testrun.totalTestcaseCount) * 100}%`,
                              height: `${(testrun.failedTestcaseCount / testrun.totalTestcaseCount) * 100}%`,
                            }}
                          />
                          <div className="pass-fail-count">
                            <div>
                              <div className="pass-failed">
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
                              </div>
                              <div className="h-bar">
                                <div />
                              </div>
                              <div className="total">
                                <div className="total-count total">
                                  <span>
                                    <span>{testrun.totalTestcaseCount}</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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
