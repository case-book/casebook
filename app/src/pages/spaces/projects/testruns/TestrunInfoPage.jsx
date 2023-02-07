import React, { useEffect, useState } from 'react';
import { Block, Button, Label, Liner, Page, PageButtons, PageContent, PageTitle, SeqId, Table, Tag, Tbody, Td, Text, Th, THead, Title, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import BlockRow from '@/components/BlockRow/BlockRow';
import ProjectService from '@/services/ProjectService';
import TestrunService from '@/services/TestrunService';
import { DURATIONS, ITEM_TYPE, MESSAGE_CATEGORY, TESTRUN_RESULT_CODE } from '@/constants/constants';
import dateUtil from '@/utils/dateUtil';
import './TestrunInfoPage.scss';
import dialogUtil from '@/utils/dialogUtil';

const labelMinWidth = '120px';

function TestrunEditPage() {
  const { t } = useTranslation();
  const { projectId, spaceCode, testrunId } = useParams();

  const navigate = useNavigate();

  const [project, setProject] = useState(null);

  const [testrun, setTestrun] = useState({
    seqId: '',
    name: '',
    description: '',
    testrunUsers: [],
    testcaseGroups: [],
    startDateTime: (() => {
      const start = new Date();
      start.setHours(10);
      start.setMinutes(0);
      start.setSeconds(0);
      start.setMilliseconds(0);

      return start.getTime();
    })(),
    endDateTime: (() => {
      const end = new Date();
      end.setDate(end.getDate() + 2);
      end.setHours(19);
      end.setMinutes(0);
      end.setSeconds(0);
      end.setMilliseconds(0);

      return end.getTime();
    })(),
    opened: false,
    totalTestcaseCount: true,
    passedTestcaseCount: true,
    failedTestcaseCount: true,
    creationType: 'CREATE',
    days: '1111100',
    onHoliday: false,
    startTime: (() => {
      const startTime = new Date();
      startTime.setHours(9);
      startTime.setMinutes(0);
      return startTime.getTime();
    })(),
    durationHours: 24,
  });

  useEffect(() => {
    ProjectService.selectProjectInfo(spaceCode, projectId, info => {
      setProject(info);
      TestrunService.selectTestrunInfo(spaceCode, projectId, testrunId, data => {
        setTestrun({ ...data, startTime: dateUtil.getHourMinuteTime(data.startTime), startDateTime: dateUtil.getTime(data.startDateTime), endDateTime: dateUtil.getTime(data.endDateTime) });
      });
    });
  }, [projectId, testrunId]);

  const onDelete = () => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('테스트런 삭제'),
      <div>{t('@ 테스트런 및 테스트런에 입력된 모든 정보가 삭제됩니다. 삭제하시겠습니까?', { name: testrun.name })}</div>,
      () => {
        TestrunService.deleteTestrunInfo(spaceCode, projectId, testrunId, () => {
          navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns`);
        });
      },
      null,
      t('삭제'),
    );
  };

  const onClosed = () => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('테스트런 종료'),
      <div>{t('@ 테스트런을 종료합니다. 계속하시겠습니까?', { name: testrun.name })}</div>,
      () => {
        TestrunService.updateTestrunStatusClosed(spaceCode, projectId, testrunId, () => {
          navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns`);
        });
      },
      null,
      t('종료'),
    );
  };

  console.log(project);

  return (
    <Page className="testrun-info-page-wrapper">
      <PageTitle links={project?.admin ? [<Link to={`/spaces/${spaceCode}/projects/${projectId}/testruns/${testrunId}/edit`}>{t('테스트 런 변경')}</Link>] : null}>{t('테스트 런')}</PageTitle>
      <PageContent>
        <Title>{t('테스트 런 정보')}</Title>
        <Block>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('프로젝트')}</Label>
            <Text>{project?.name}</Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth} required>
              {t('이름')}
            </Label>
            <Text>{testrun?.name}</Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('설명')}</Label>
            <Text>{testrun?.description}</Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth} required>
              {t('생성 타입')}
            </Label>
            <Text>{t(testrun.creationType)}</Text>
          </BlockRow>
          {(testrun.creationType === 'CREATE' || testrun.creationType === 'RESERVE') && (
            <BlockRow className="testrun-range-type-row">
              <Label minWidth={labelMinWidth} required>
                {t('테스트 기간')}
              </Label>
              <Text>
                <div className="testrun-range">
                  <div>{dateUtil.getDateString(testrun.startDateTime)}</div>
                  <Liner display="inline-block" width="10px" height="1px" margin="0 0.5rem" />
                  <div>{dateUtil.getDateString(testrun.endDateTime)}</div>
                </div>
              </Text>
            </BlockRow>
          )}
          {!(testrun.creationType === 'CREATE' || testrun.creationType === 'RESERVE') && (
            <>
              <BlockRow>
                <Label minWidth={labelMinWidth} required>
                  {t('반복 기간')}
                </Label>
                <Text>
                  <div className="iteration-period">
                    <div className="testrun-range">
                      <div>{dateUtil.getDateString(testrun.startDateTime)}</div>
                      <Liner display="inline-block" width="10px" height="1px" margin="0 0.5rem" />
                      <div>{dateUtil.getDateString(testrun.endDateTime)}</div>
                    </div>
                  </div>
                </Text>
              </BlockRow>
              <BlockRow>
                <Label minWidth={labelMinWidth} />
                <div className="day-of-weeks">
                  {[t('월'), t('화'), t('수'), t('목'), t('금'), t('토'), t('일')]
                    .filter((day, jnx) => {
                      return testrun.days[jnx] === '1' ? 'selected' : '';
                    })
                    .map(day => {
                      return (
                        <div key={day} className="day">
                          <span>{day}</span>
                        </div>
                      );
                    })}
                  <Liner display="inline-block" width="1px" height="10px" color="light" margin="0 1rem" />
                  <div>{testrun.onHoliday ? t('휴일 제외') : t('휴일 포함')}</div>
                  <Liner display="inline-block" width="1px" height="10px" color="light" margin="0 1rem" />
                  <div className="label">{t('시작 시간')}</div>
                  <div>{dateUtil.getDateString(testrun.startTime, 'hoursMinutes')}</div>
                  <Liner display="inline-block" width="1px" height="10px" color="light" margin="0 1rem" />
                  <div className="label">{t('테스트 기간')}</div>
                  <div>{DURATIONS.find(d => d.key === testrun.durationHours)?.value || testrun.durationHours}</div>
                </div>
              </BlockRow>
            </>
          )}
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('테스터')}</Label>
            {testrun.testrunUsers?.length < 1 && <Text className="no-user">{t('선택된 사용자가 없습니다.')}</Text>}
            {testrun.testrunUsers?.length > 0 && (
              <ul className="testrun-users g-no-select">
                {testrun.testrunUsers?.map(d => {
                  return (
                    <li key={d.userId}>
                      <div>{d.name}</div>
                    </li>
                  );
                })}
              </ul>
            )}
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('테스트케이스')}</Label>
          </BlockRow>
          <BlockRow className="testrun-testcases-content">
            {testrun.testcaseGroups?.length < 1 && <Text className="no-user">{t('선택된 테스트케이스가 없습니다.')}</Text>}
            {testrun.testcaseGroups?.length > 0 && (
              <Table cols={['1px', '100%']} border>
                <THead>
                  <Tr>
                    <Th align="left">{t('테스트케이스 그룹')}</Th>
                    <Th align="left">{t('테스트 케이스')}</Th>
                    <Th align="left">{t('테스터')}</Th>
                    <Th align="center">{t('테스트 결과')}</Th>
                  </Tr>
                </THead>
                <Tbody>
                  {testrun.testcaseGroups?.map(d => {
                    console.log(d);

                    return (
                      // eslint-disable-next-line react/jsx-no-useless-fragment
                      <>
                        {d.testcases?.map(testcase => {
                          const tester = project.users.find(user => {
                            return user.userId === testcase.testerId;
                          });

                          return (
                            <Tr>
                              <Td>
                                <div className="seq-name">
                                  <div>
                                    <SeqId size="sm" type={ITEM_TYPE.TESTCASE_GROUP} copy={false}>
                                      {d.seqId}
                                    </SeqId>
                                  </div>
                                  <div>{d.name}</div>
                                </div>
                              </Td>
                              <Td>
                                <div className="seq-name">
                                  <div>
                                    <SeqId size="sm" type={ITEM_TYPE.TESTCASE} copy={false}>
                                      {testcase.seqId}
                                    </SeqId>
                                  </div>
                                  <div>{testcase.name}</div>
                                </div>
                              </Td>
                              <Td align="left">
                                <Tag>{tester?.name}</Tag>
                              </Td>
                              <Td align="center">
                                <Tag className={testcase.testResult}>{TESTRUN_RESULT_CODE[testcase.testResult]}</Tag>
                              </Td>
                            </Tr>
                          );
                        })}
                      </>
                    );
                  })}
                </Tbody>
              </Table>
            )}
          </BlockRow>
          {(testrun.creationType === 'RESERVE' || testrun.creationType === 'ITERATION') && (
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('테스트케이스')}</Label>
              <Text>
                {testrun.creationType === 'RESERVE' && (
                  <Tag className="tag" size="md" uppercase>
                    {testrun.reserveExpired ? t('생성 완료') : t('미처리')}
                  </Tag>
                )}
                {testrun.creationType === 'ITERATION' && (
                  <Tag className="tag" size="md" uppercase>
                    {testrun.reserveExpired ? t('만료') : t('반복중')}
                  </Tag>
                )}
              </Text>
            </BlockRow>
          )}
        </Block>
        <Title>{t('테스트 런 관리')}</Title>
        <Block className="space-control">
          <Button color="warning" onClick={onClosed}>
            {t('테스트런 종료')}
          </Button>
          {project?.admin && (
            <>
              <Liner width="1px" height="10px" display="inline-block" color="gray" margin="0 1rem" />
              <Button color="danger" onClick={onDelete}>
                {t('테스트런 삭제')}
              </Button>
            </>
          )}
        </Block>
        <PageButtons
          outline
          onBack={() => {
            navigate(-1);
          }}
          onEdit={
            project?.admin
              ? () => {
                  navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns/${testrunId}/edit`);
                }
              : null
          }
          onCancelIcon=""
        />
      </PageContent>
    </Page>
  );
}

TestrunEditPage.defaultProps = {};

TestrunEditPage.propTypes = {};

export default TestrunEditPage;
