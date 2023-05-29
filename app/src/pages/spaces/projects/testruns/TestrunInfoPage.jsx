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
import './TestrunInfoPage.scss';
import dialogUtil from '@/utils/dialogUtil';

const labelMinWidth = '120px';

function TestrunInfoPage() {
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
    days: '1111100',
    excludeHoliday: false,
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

  const onOpened = () => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('테스트런 오픈'),
      <div>{t('종료된 @ 테스트런을 다시 오픈합니다. 계속하시겠습니까?', { name: testrun.name })}</div>,
      () => {
        TestrunService.updateTestrunStatusOpened(spaceCode, projectId, testrunId, () => {
          navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns`);
        });
      },
      null,
      t('재오픈'),
    );
  };

  return (
    <Page className="testrun-info-page-wrapper">
      <PageTitle
        links={project?.admin ? [<Link to={`/spaces/${spaceCode}/projects/${projectId}/testruns/${testrunId}/edit`}>{t('편집')}</Link>] : null}
        control={
          <div>
            {testrun.opened && (
              <Button size="sm" color="warning" onClick={onClosed}>
                {t('테스트런 종료')}
              </Button>
            )}
            {!testrun.opened && (
              <Button size="sm" color="warning" onClick={onOpened}>
                {t('테스트런 오픈')}
              </Button>
            )}
            <Button size="sm" color="danger" onClick={onDelete}>
              {t('테스트런 삭제')}
            </Button>
          </div>
        }
        onListClick={() => {
          navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns`);
        }}
      >
        {t('테스트런')}
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
            <Text>{testrun?.name}</Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('설명')}</Label>
            <Text>{testrun?.description}</Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('테스트 기간')}</Label>
            <Text>
              <div className="testrun-range">
                <div>{dateUtil.getDateString(testrun.startDateTime)}</div>
                <Liner display="inline-block" width="10px" height="1px" margin="0 0.5rem" />
                <div>{dateUtil.getDateString(testrun.endDateTime)}</div>
              </div>
            </Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth} tip={t('테스트 종료 기간이 지나면, 모든 테스트가 완료되지 않은 상태라도 테스트를 종료 처리합니다.')}>
              {t('자동 종료')}
            </Label>
            <Text>{testrun.deadlineClose ? 'Y' : 'N'}</Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('테스터')}</Label>
            {testrun.testrunUsers?.length < 1 && <Text className="no-user">{t('선택된 사용자가 없습니다.')}</Text>}
            {testrun.testrunUsers?.length > 0 && (
              <Text>
                {testrun.testrunUsers?.map(d => {
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
            <Label minWidth={labelMinWidth}>{t('테스트케이스')}</Label>
          </BlockRow>
          <BlockRow className="testrun-testcases-content">
            {testrun.testcaseGroups?.length < 1 && <Text className="no-user">{t('선택된 테스트케이스가 없습니다.')}</Text>}
            {testrun.testcaseGroups?.length > 0 && (
              <Table size="sm" cols={['1px', '100%']} border>
                <THead>
                  <Tr>
                    <Th align="left">{t('테스트케이스 그룹')}</Th>
                    <Th align="left">{t('테스트케이스')}</Th>
                    <Th align="left">{t('테스터')}</Th>
                    <Th align="center">{t('테스트 결과')}</Th>
                  </Tr>
                </THead>
                <Tbody>
                  {testrun.testcaseGroups?.map(d => {
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

                                <Td align="left">
                                  <Tag>{tester?.name}</Tag>
                                </Td>
                                <Td align="center">
                                  <Tag className={testcase.testResult}>{TESTRUN_RESULT_CODE[testcase.testResult]}</Tag>
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
                        <Td />
                        <Td />
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

TestrunInfoPage.defaultProps = {};

TestrunInfoPage.propTypes = {};

export default TestrunInfoPage;
