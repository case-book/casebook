import React, { useEffect, useState } from 'react';
import { Block, Button, Label, Liner, Page, PageButtons, PageContent, PageTitle, SeqId, Table, Tag, Tbody, Td, Text, Th, THead, Title, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import BlockRow from '@/components/BlockRow/BlockRow';
import ProjectService from '@/services/ProjectService';
import TestrunService from '@/services/TestrunService';
import {
  DURATIONS,
  HOLIDAY_CONDITION_DAY_LIST,
  HOLIDAY_CONDITION_WEEK_LIST,
  ITEM_TYPE,
  MESSAGE_CATEGORY,
  TESTRUN_ITERATION_MONTHLY_DATES,
  TESTRUN_ITERATION_USER_FILTER_SELECT_RULE,
  TESTRUN_ITERATION_USER_FILTER_TYPE_CODE,
} from '@/constants/constants';
import dateUtil from '@/utils/dateUtil';
import dialogUtil from '@/utils/dialogUtil';
import './TestrunIterationInfoPage.scss';

const labelMinWidth = '120px';

function TestrunIterationInfoPage() {
  const { t } = useTranslation();
  const { projectId, spaceCode, testrunIterationId } = useParams();

  const navigate = useNavigate();

  const [project, setProject] = useState(null);

  const [testrunIteration, setTestrunIteration] = useState({
    id: null,
    name: '',
    description: '',
    testrunUsers: [],
    testcaseGroups: [],
    projectId,
    reserveStartDateTime: (() => {
      const start = new Date();
      start.setHours(10);
      start.setMinutes(0);
      start.setSeconds(0);
      start.setMilliseconds(0);

      return start.getTime();
    })(),
    reserveEndDateTime: (() => {
      const end = new Date();
      end.setDate(end.getDate() + 2);
      end.setHours(19);
      end.setMinutes(0);
      end.setSeconds(0);
      end.setMilliseconds(0);

      return end.getTime();
    })(),
    testrunIterationTimeType: 'WEEKLY', // MONTHLY, WEEKLY, MONTHLY_WEEKLY
    excludeHoliday: false,
    durationHours: 24,
    days: '1111100',
    startTime: (() => {
      const startTime = new Date();
      startTime.setHours(9);
      startTime.setMinutes(0);
      return startTime.getTime();
    })(),
    deadlineClose: true,
    date: null,
    week: null,
    day: null,
    testrunIterationUserFilterType: 'NONE', // NONE, TESTRUN, WEEKLY, MONTHLY
    testrunIterationUserFilterSelectRule: 'SEQ', // RANDOM, SEQ
    filteringUserCount: null,
  });

  useEffect(() => {
    ProjectService.selectProjectInfo(spaceCode, projectId, info => {
      setProject(info);
      TestrunService.selectTestrunIterationInfo(spaceCode, projectId, testrunIterationId, data => {
        setTestrunIteration({ ...data, startTime: dateUtil.getHourMinuteTime(data.startTime), startDateTime: dateUtil.getTime(data.startDateTime), endDateTime: dateUtil.getTime(data.endDateTime) });
      });
    });
  }, [projectId, testrunIterationId]);

  const onDelete = () => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('반복 테스트런 삭제'),
      <div>{t('@ 반복 테스트런 및 테스트런에 입력된 모든 정보가 삭제됩니다. 삭제하시겠습니까?', { name: testrunIteration.name })}</div>,
      () => {
        TestrunService.deleteTestrunIterationInfo(spaceCode, projectId, testrunIterationId, () => {
          navigate(-1);
        });
      },
      null,
      t('삭제'),
      null,
      'danger',
    );
  };

  return (
    <Page className="testrun-Iteration-info-page-wrapper">
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
            to: `/spaces/${spaceCode}/projects/${projectId}/testruns/iterations`,
            text: t('반복 테스트런 목록'),
          },
          {
            to: `/spaces/${spaceCode}/projects/${projectId}/testruns/iterations/${testrunIterationId}/info`,
            text: testrunIteration?.name,
          },
        ]}
        links={[
          {
            to: `/spaces/${spaceCode}/projects/${projectId}/testruns/iterations/${testrunIterationId}/edit`,
            text: t('편집'),
            color: 'primary',
          },
        ]}
        onListClick={() => {
          navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns/iterations`);
        }}
      >
        {t('테스트런')}
      </PageTitle>
      <PageContent>
        <Title border={false} marginBottom={false}>
          {t('테스트런 정보')}
        </Title>
        <Block>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('프로젝트')}</Label>
            <Text>{project?.name}</Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('이름')}</Label>
            <Text>{testrunIteration?.name}</Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('설명')}</Label>
            <Text>{testrunIteration?.description}</Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('생성 여부')}</Label>
            <Text>
              <Tag className="tag" size="md" uppercase>
                {testrunIteration.expired ? t('만료') : t('반복중')}
              </Tag>
            </Text>
          </BlockRow>

          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('반복 기간')}</Label>
            <Text>
              <div className="iteration-period">
                <div className="testrun-range">
                  <div>{dateUtil.getDateString(testrunIteration.reserveStartDateTime)}</div>
                  <Liner display="inline-block" width="10px" height="1px" margin="0 0.5rem" />
                  <div>{dateUtil.getDateString(testrunIteration.reserveEndDateTime)}</div>
                </div>
              </div>
            </Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth} />
            <div className="day-of-weeks">
              {testrunIteration.testrunIterationTimeType === 'WEEKLY' &&
                [t('월'), t('화'), t('수'), t('목'), t('금'), t('토'), t('일')]
                  .filter((day, jnx) => {
                    return testrunIteration.days[jnx] === '1' ? 'selected' : '';
                  })
                  .map(day => {
                    return (
                      <div key={day} className="day">
                        <span>{day}</span>
                      </div>
                    );
                  })}
              {testrunIteration.testrunIterationTimeType === 'MONTHLY' && (
                <Tag uppercase border color="transparent">
                  {TESTRUN_ITERATION_MONTHLY_DATES.find(d => d.key === testrunIteration.date)?.value}
                </Tag>
              )}
              {testrunIteration.testrunIterationTimeType === 'MONTHLY_WEEKLY' && (
                <Tag uppercase border color="transparent">
                  {HOLIDAY_CONDITION_WEEK_LIST.find(d => d.key === testrunIteration.week)?.value}
                </Tag>
              )}
              {testrunIteration.testrunIterationTimeType === 'MONTHLY_WEEKLY' && (
                <Tag uppercase border color="transparent">
                  {HOLIDAY_CONDITION_DAY_LIST.find(d => d.key === testrunIteration.day)?.value}
                </Tag>
              )}
              <Liner display="inline-block" width="1px" height="10px" color="light" margin="0 1rem" />
              {!(testrunIteration.testrunIterationTimeType === 'MONTHLY' && testrunIteration.date === -2) && <div>{testrunIteration.excludeHoliday ? t('휴일 제외') : t('휴일 포함')}</div>}
              <Liner display="inline-block" width="1px" height="10px" color="light" margin="0 1rem" />
              <div className="label">{t('시작 시간')}</div>
              <div>{dateUtil.getDateString(testrunIteration.startTime, 'hoursMinutes')}</div>
              <Liner display="inline-block" width="1px" height="10px" color="light" margin="0 1rem" />
              <div className="label">{t('테스트 기간')}</div>
              <div>{DURATIONS.find(d => d.key === testrunIteration.durationHours)?.value || testrunIteration.durationHours}</div>
            </div>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth} tip={t('테스트 종료 기간이 지나면, 모든 테스트가 완료되지 않은 상태라도 테스트를 종료 처리합니다.')}>
              {t('자동 종료')}
            </Label>
            <Text>{testrunIteration.deadlineClose ? 'Y' : 'N'}</Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('테스터')}</Label>
            {testrunIteration.testrunUsers?.length < 1 && <Text className="no-user">{t('선택된 사용자가 없습니다.')}</Text>}
            {testrunIteration.testrunUsers?.length > 0 && (
              <Text>
                {testrunIteration.testrunUsers?.map(d => {
                  return (
                    <Tag className="tester" size="sm" key={d.userId} color="white" border>
                      {d.name}
                    </Tag>
                  );
                })}
              </Text>
            )}
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('테스터 필터')}</Label>
            <Text>
              {testrunIteration.testrunIterationUserFilterType === 'NONE' && <div>{t('필터 없음')}</div>}
              {testrunIteration.testrunIterationUserFilterType !== 'NONE' && (
                <>
                  <span>{t('@ 명', { count: testrunIteration.testrunUserCount })}</span>
                  <span>{t('중')}</span>
                  <span>{TESTRUN_ITERATION_USER_FILTER_TYPE_CODE.find(d => d.key === testrunIteration.testrunIterationUserFilterType)?.value}</span>
                  <span>{TESTRUN_ITERATION_USER_FILTER_SELECT_RULE.find(d => d.key === testrunIteration.testrunIterationUserFilterSelectRule)?.value}</span>
                  <span>{t('@ 명', { count: testrunIteration.filteringUserCount })}</span>
                </>
              )}
            </Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('테스트케이스')}</Label>
          </BlockRow>
          <BlockRow className="testrun-testcases-content">
            {testrunIteration.testcaseGroups?.length < 1 && <Text className="no-user">{t('선택된 테스트케이스가 없습니다.')}</Text>}
            {testrunIteration.testcaseGroups?.length > 0 && (
              <Table size="sm" cols={['1px', '100%']} border>
                <THead>
                  <Tr>
                    <Th align="left">{t('테스트케이스 그룹')}</Th>
                    <Th align="left">{t('테스트케이스')}</Th>
                  </Tr>
                </THead>
                <Tbody>
                  {testrunIteration.testcaseGroups?.map(d => {
                    if (d.testcases?.length > 0) {
                      return (
                        <React.Fragment key={d.id}>
                          {d.testcases?.map((testcase, inx) => {
                            return (
                              <Tr key={testcase.id}>
                                {inx === 0 && (
                                  <Td rowSpan={d.testcases.length} className="group-info">
                                    <div className="seq-name">
                                      <div>
                                        <SeqId className="seq-id" size="sm" type={ITEM_TYPE.TESTCASE_GROUP} copy={false}>
                                          {d.seqId}
                                        </SeqId>
                                      </div>
                                      <div>{d.name}</div>
                                    </div>
                                  </Td>
                                )}
                                <Td>
                                  <div className="seq-name">
                                    <div>
                                      <SeqId className="seq-id" size="sm" type={ITEM_TYPE.TESTCASE} copy={false}>
                                        {testcase.seqId}
                                      </SeqId>
                                    </div>
                                    <div>{testcase.name}</div>
                                  </div>
                                </Td>
                              </Tr>
                            );
                          })}
                        </React.Fragment>
                      );
                    }

                    return (
                      <Tr key={d.seqId}>
                        <Td className="group-info">
                          <div className="seq-name">
                            <div>
                              <SeqId size="sm" type={ITEM_TYPE.TESTCASE_GROUP} copy={false}>
                                {d.seqId}
                              </SeqId>
                            </div>
                            <div>{d.name}</div>
                          </div>
                        </Td>
                        <Td />
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            )}
          </BlockRow>
        </Block>
        <Title paddingBottom={false} border={false} marginBottom={false}>
          {t('관리')}
        </Title>
        <Block>
          <BlockRow>
            <Label>{t('예약 테스트런 삭제')}</Label>
            <Text>
              <Button size="sm" color="danger" onClick={onDelete}>
                {t('반복 테스트런 삭제')}
              </Button>
            </Text>
          </BlockRow>
        </Block>
        <PageButtons
          onBack={() => {
            navigate(-1);
          }}
          onEdit={
            project?.admin
              ? () => {
                  navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns/iterations/${testrunIterationId}/edit`);
                }
              : null
          }
          onCancelIcon=""
        />
      </PageContent>
    </Page>
  );
}

TestrunIterationInfoPage.defaultProps = {};

TestrunIterationInfoPage.propTypes = {};

export default TestrunIterationInfoPage;
