import React, { useEffect, useState } from 'react';
import { Block, Button, Label, Liner, Page, PageButtons, PageContent, PageTitle, SeqId, Table, Tag, Tbody, Td, Text, Th, THead, Title, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import BlockRow from '@/components/BlockRow/BlockRow';
import ProjectService from '@/services/ProjectService';
import TestrunService from '@/services/TestrunService';
import { ITEM_TYPE, MESSAGE_CATEGORY, TESTRUN_RESULT_CODE } from '@/constants/constants';
import dateUtil from '@/utils/dateUtil';
import './TestrunReservationInfoPage.scss';
import dialogUtil from '@/utils/dialogUtil';

const labelMinWidth = '120px';

function TestrunReservationInfoPage() {
  const { t } = useTranslation();
  const { projectId, spaceCode, testrunReservationId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [testrunReservation, setTestrunReservation] = useState({
    id: '',
    name: '',
    description: '',
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
    expired: false,
    deadlineClose: true,
    testcaseGroupCount: 0,
    testcaseCount: 0,
    testrunId: null,
    projectName: '',
    testrunUsers: [],
    testcaseGroups: [],
    selectCreatedTestcase: false,
    selectUpdatedTestcase: false,
  });

  useEffect(() => {
    ProjectService.selectProjectInfo(spaceCode, projectId, info => {
      setProject(info);
      TestrunService.selectTestrunReservationInfo(spaceCode, projectId, testrunReservationId, data => {
        setTestrunReservation({ ...data, startTime: dateUtil.getHourMinuteTime(data.startTime), startDateTime: dateUtil.getTime(data.startDateTime), endDateTime: dateUtil.getTime(data.endDateTime) });
      });
    });
  }, [projectId, testrunReservationId]);

  const onDelete = () => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('예약 테스트런 삭제'),
      <div>{t('예약 테스트런 정보를 삭제합니다. 삭제하시겠습니까?', { name: testrunReservation.name })}</div>,
      () => {
        TestrunService.deleteTestrunReservationInfo(spaceCode, projectId, testrunReservationId, () => {
          navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns/reservations`);
        });
      },
      null,
      t('삭제'),
    );
  };

  return (
    <Page className="testrun-reservation-info-page-wrapper">
      <PageTitle
        links={project?.admin ? [<Link to={`/spaces/${spaceCode}/projects/${projectId}/testruns/reservations/${testrunReservationId}/edit`}>{t('편집')}</Link>] : null}
        control={
          <div>
            <Button size="sm" color="danger" onClick={onDelete}>
              {t('예약 테스트런 삭제')}
            </Button>
          </div>
        }
        onListClick={() => {
          navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns/reservations`);
        }}
      >
        {t('예약 테스트런')}
      </PageTitle>
      <PageContent>
        <Title>{t('테스트런 정보')}</Title>
        <Block>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('프로젝트')}</Label>
            <Text>{project?.name}</Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('이름')}</Label>
            <Text>{testrunReservation?.name}</Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('설명')}</Label>
            <Text>{testrunReservation?.description}</Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('상태')}</Label>
            <Text>{testrunReservation?.expired ? t('완료') : t('예약')}</Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('테스트런')}</Label>
            <Text>{testrunReservation.testrunId && <Link to={`/spaces/${spaceCode}/projects/${projectId}/reports//${testrunReservation.testrunId}`}>{t('리포트')}</Link>}</Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('테스트 기간')}</Label>
            <Text>
              <div className="testrun-range">
                <div>{dateUtil.getDateString(testrunReservation.startDateTime)}</div>
                <Liner display="inline-block" width="10px" height="1px" margin="0 0.5rem" />
                <div>{dateUtil.getDateString(testrunReservation.endDateTime)}</div>
              </div>
            </Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth} tip={t('테스트 종료 기간이 지나면, 모든 테스트가 완료되지 않은 상태라도 테스트를 종료 처리합니다.')}>
              {t('자동 종료')}
            </Label>
            <Text>{testrunReservation.deadlineClose ? 'Y' : 'N'}</Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('테스터')}</Label>
            {testrunReservation.testrunUsers?.length < 1 && <Text className="no-user">{t('선택된 사용자가 없습니다.')}</Text>}
            {testrunReservation.testrunUsers?.length > 0 && (
              <Text>
                {testrunReservation.testrunUsers?.map(d => {
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
            <Label minWidth={labelMinWidth} tip={t('예약 테스트런을 만든 시점부터, 예약 테스트런에 생성될때까지 추가된 테스트케이스를 자동으로 추가합니다.')}>
              {t('자동 추가')}
            </Label>
            <div>
              <Text>
                {testrunReservation.selectCreatedTestcase && testrunReservation.selectUpdatedTestcase ? t('예약 테스트런 생성전까지 생성/변경된 테스트케이스 자동 추가') : ''}
                {testrunReservation.selectCreatedTestcase && !testrunReservation.selectUpdatedTestcase ? t('예약 테스트런 생성전까지 생성된 테스트케이스 자동 추가') : ''}
                {!testrunReservation.selectCreatedTestcase && testrunReservation.selectUpdatedTestcase ? t('예약 테스트런 생성전까지 변경된 테스트케이스 자동 추가') : ''}
              </Text>
            </div>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('테스트케이스')}</Label>
          </BlockRow>
          <BlockRow className="testrun-testcases-content">
            {testrunReservation.testcaseGroups?.length < 1 && <Text className="no-user">{t('선택된 테스트케이스가 없습니다.')}</Text>}
            {testrunReservation.testcaseGroups?.length > 0 && (
              <Table size="sm" cols={['1px', '100%']} border>
                <THead>
                  <Tr>
                    <Th align="left">{t('테스트케이스 그룹')}</Th>
                    <Th align="left">{t('테스트케이스')}</Th>
                    {testrunReservation.creationType === 'CREATE' && (
                      <>
                        <Th align="left">{t('테스터')}</Th>
                        <Th align="center">{t('테스트 결과')}</Th>
                      </>
                    )}
                  </Tr>
                </THead>
                <Tbody>
                  {testrunReservation.testcaseGroups?.map(d => {
                    if (d.testcases?.length > 0) {
                      return (
                        <React.Fragment key={d.id}>
                          {d.testcases?.map((testcase, inx) => {
                            const tester = project.users.find(user => {
                              return user.userId === testcase.testerId;
                            });

                            return (
                              <Tr key={testcase.id}>
                                {inx === 0 && (
                                  <Td rowSpan={d.testcases.length} className="group-info">
                                    <div className="seq-name">
                                      <div>
                                        <SeqId size="sm" type={ITEM_TYPE.TESTCASE_GROUP} copy={false}>
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
                                      <SeqId size="sm" type={ITEM_TYPE.TESTCASE} copy={false}>
                                        {testcase.seqId}
                                      </SeqId>
                                    </div>
                                    <div>{testcase.name}</div>
                                  </div>
                                </Td>
                                {testrunReservation.creationType === 'CREATE' && (
                                  <>
                                    <Td align="left">
                                      <Tag>{tester?.name}</Tag>
                                    </Td>
                                    <Td align="center">
                                      <Tag className={testcase.testResult}>{TESTRUN_RESULT_CODE[testcase.testResult]}</Tag>
                                    </Td>
                                  </>
                                )}
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
                        {testrunReservation.creationType === 'CREATE' && (
                          <>
                            <Td />
                            <Td />
                          </>
                        )}
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            )}
          </BlockRow>
        </Block>
        <PageButtons
          onBack={() => {
            navigate(-1);
          }}
          onEdit={
            project?.admin
              ? () => {
                  navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns/reservations/${testrunReservationId}/edit`);
                }
              : null
          }
          onCancelIcon=""
        />
      </PageContent>
    </Page>
  );
}

TestrunReservationInfoPage.defaultProps = {};

TestrunReservationInfoPage.propTypes = {};

export default TestrunReservationInfoPage;
