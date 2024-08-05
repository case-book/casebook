import React, { useMemo, useState } from 'react';
import { Block, BlockRow, Button, EmptyContent, Label, PageButtons, PageContent, PageTitle, Radio, Table, Tag, Tbody, Td, Text, Th, THead, Title, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import SpaceService from '@/services/SpaceService';
import { SpacePropTypes } from '@/proptypes';
import PropTypes from 'prop-types';
import dialogUtil from '@/utils/dialogUtil';
import {
  APPROVAL_STATUS_INFO,
  CHANNEL_TYPE_CODE,
  COUNTRIES,
  DATE_FORMATS,
  HOLIDAY_CONDITION_DAY_LIST,
  HOLIDAY_CONDITION_MONTH_LIST,
  HOLIDAY_CONDITION_WEEK_LIST,
  HOLIDAY_TYPE_CODE,
  MESSAGE_CATEGORY,
} from '@/constants/constants';
import MemberCardManager from '@/components/MemberManager/MemberCardManager';
import useStores from '@/hooks/useStores';
import './SpaceContent.scss';
import moment from 'moment';
import dateUtil from '@/utils/dateUtil';
import MessageChannelViewerPopup from '@/pages/spaces/MessageChannelEditPopup/MessageChannelViewerPopup';

function SpaceContent({ space, onRefresh }) {
  const { t } = useTranslation();

  const {
    userStore: { removeSpace, isAdmin },
  } = useStores();

  const navigate = useNavigate();

  const { spaceCode } = useParams();
  const [status, setStatus] = useState('REQUEST');
  const [userRole, setUserRole] = useState('ALL');
  const [statusOptions] = useState([
    { key: 'ALL', value: t('전체') },
    { key: 'REQUEST', value: t('요청') },
  ]);
  const [userRoles] = useState([
    { key: 'ALL', value: t('전체') },
    { key: 'ADMIN', value: t('관리자') },
    { key: 'USER', value: t('사용자') },
  ]);

  const [selectedMessageChannel, setSelectedMessageChannel] = useState(null);

  const approve = applicantId => {
    SpaceService.approveSpaceJoinRequest(spaceCode, applicantId, () => {
      onRefresh();
    });
  };

  const reject = applicantId => {
    SpaceService.rejectSpaceJoinRequest(spaceCode, applicantId, () => {
      onRefresh();
    });
  };

  const withdraw = () => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('스페이스 탈퇴'),
      <div>{t('스페이스를 탈퇴하면, 스페이스 및 스페이스 하위 프로젝트들에 더 이상 접근할 수 없습니다. 탈퇴하시겠습니까?')}</div>,
      () => {
        SpaceService.withdrawSpace(spaceCode, () => {
          onRefresh();
        });
      },
      null,
      t('탈퇴'),
      null,
      'danger',
    );
  };

  const applicants = useMemo(() => {
    return space?.applicants?.filter(applicant => {
      if (status === 'ALL') {
        return true;
      }

      if (status === 'REQUEST') {
        return applicant.approvalStatusCode === 'REQUEST' || applicant.approvalStatusCode === 'REQUEST_AGAIN';
      }

      return applicant.approvalStatusCode === status;
    });
  }, [space, status]);

  const users = useMemo(() => {
    return space?.users?.filter(user => {
      if (userRole === 'ALL') {
        return true;
      }

      return user.role === userRole;
    });
  }, [space, userRole]);

  const onDelete = () => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('스페이스 삭제'),
      <div>{t('@ 스페이스 및 스페이스에 포함된 프로젝트를 비롯한 모든 정보가 삭제됩니다. 삭제하시겠습니까?', { spaceName: space.name })}</div>,
      () => {
        SpaceService.deleteSpace(space.id, () => {
          removeSpace(space.id);
          navigate('/spaces');
        });
      },
      null,
      t('삭제'),
      null,
      'danger',
    );
  };

  return (
    <>
      <PageTitle
        name={t('스페이스 정보')}
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
            text: space?.name,
          },
        ]}
        links={
          isAdmin || space?.admin
            ? [
                {
                  to: `/spaces/${spaceCode}/variables`,
                  text: t('스페이스 변수 관리'),
                },
                {
                  to: `/spaces/${spaceCode}/edit`,
                  text: t('변경'),
                },
              ]
            : null
        }
        onListClick={() => {
          navigate('/');
        }}
      >
        {space?.name}
      </PageTitle>
      <PageContent className="space-info-content">
        <Title>{t('스페이스 정보')}</Title>
        <Block>
          <BlockRow>
            <Label>{t('이름')}</Label>
            <Text>{space?.name}</Text>
          </BlockRow>
          <BlockRow>
            <Label>{t('코드')}</Label>
            <Text>{space?.code}</Text>
          </BlockRow>
          <BlockRow>
            <Label>{t('설명')}</Label>
            <Text>{space?.description}</Text>
          </BlockRow>
          <BlockRow>
            <Label>{t('사용 여부')}</Label>
            <Text>{space?.activated ? 'Y' : 'N'}</Text>
          </BlockRow>
          <BlockRow>
            <Label>{t('검색 허용')}</Label>
            <Text>{space?.allowSearch ? 'Y' : 'N'}</Text>
          </BlockRow>
          <BlockRow>
            <Label>{t('자동 가입')}</Label>
            <Text>{space?.allowAutoJoin ? 'Y' : 'N'}</Text>
          </BlockRow>
          <BlockRow>
            <Label>{t('타임존')}</Label>
            <Text>{space?.timeZone || 'N/A'}</Text>
          </BlockRow>
          <BlockRow>
            <Label>{t('지역')}</Label>
            <Text>{COUNTRIES[space?.country] || 'N/A'}</Text>
          </BlockRow>
        </Block>
        <Title
          control={userRoles.map(option => {
            return (
              <Radio
                key={option.key}
                type="inline"
                size="xs"
                value={option.key}
                checked={userRole === option.key}
                label={t(option.value)}
                onChange={val => {
                  setUserRole(val);
                }}
              />
            );
          })}
        >
          {t('스페이스 사용자')}
        </Title>
        <Block>
          <MemberCardManager users={users} />
        </Block>
        <Title>{t('메세지 채널')}</Title>
        <Block>
          {!(space.messageChannels?.length > 0) && (
            <EmptyContent className="empty-content" border>
              <div>{t('등록된 메세지 채널이 없습니다.')}</div>
            </EmptyContent>
          )}
          {space.messageChannels?.length > 0 && (
            <ul className="message-channels">
              {space.messageChannels.map((messageChannel, inx) => {
                return (
                  <li key={inx}>
                    <div>
                      <Tag size="sm" color="white" border>
                        {CHANNEL_TYPE_CODE[messageChannel.messageChannelType]}
                      </Tag>
                    </div>
                    <div>
                      <Link
                        to={`/spaces/${space.code}/message-channels/${messageChannel.id}`}
                        onClick={e => {
                          e.preventDefault();
                          setSelectedMessageChannel(messageChannel);
                        }}
                      >
                        {messageChannel.name}
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Block>
        <Title>{t('LLM API 설정')}</Title>
        <Block>
          {!(space.llms?.length > 0) && (
            <EmptyContent className="empty-content" border>
              <div>{t('등록된 API 설정이 없습니다.')}</div>
            </EmptyContent>
          )}
          {space.llms?.length > 0 && (
            <ul className="llms">
              {space.llms.map((llm, inx) => {
                return (
                  <li key={inx}>
                    <div>
                      <Tag size="sm" color="white" border>
                        {llm.llmTypeCode}
                      </Tag>
                    </div>
                    <div>{llm?.openAi.name}</div>
                    <div>{llm.activated ? <Tag border>ACTIVE</Tag> : null}</div>
                  </li>
                );
              })}
            </ul>
          )}
        </Block>
        <Title>{t('LLM 프롬프트 설정')}</Title>
        <Block>
          {!(space.llmPrompts?.length > 0) && <EmptyContent border>{t('등록된 프롬프트가 없습니다.')}</EmptyContent>}
          {space.llmPrompts?.length > 0 && (
            <ul className="prompts">
              {space.llmPrompts?.map((prompt, inx) => {
                return (
                  <li key={inx}>
                    <div>
                      <div>{prompt.name}</div>
                      <div>{prompt.activated ? <Tag border>ACTIVE</Tag> : null}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Block>
        {(isAdmin || space?.admin) && (
          <>
            <Title
              control={statusOptions.map(option => {
                return (
                  <Radio
                    key={option.key}
                    type="inline"
                    size="xs"
                    value={option.key}
                    checked={status === option.key}
                    label={option.value}
                    onChange={val => {
                      setStatus(val);
                    }}
                  />
                );
              })}
              paddingBottom={false}
              border={false}
            >
              {t('스페이스 참여 요청')}
            </Title>
            <Block>
              {(!applicants || applicants?.length < 1) && (
                <EmptyContent className="empty-content" border>
                  <div>{t('참여 요청이 없습니다.')}</div>
                </EmptyContent>
              )}
              {applicants?.length > 0 && (
                <div className="applicant-list-content">
                  <Table className="applicant-list" cols={['1px', '1px', '1px', '100%', '1px']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="center">{t('상태')}</Th>
                        <Th align="left">{t('이메일')}</Th>
                        <Th align="left">{t('메세지')}</Th>
                        <Th />
                      </Tr>
                    </THead>
                    <Tbody>
                      {applicants?.map(applicant => {
                        return (
                          <Tr key={applicant.id}>
                            <Td className="user-info">{applicant.userName}</Td>
                            <Td className={`request-status ${applicant.approvalStatusCode}`}>
                              <Tag>{APPROVAL_STATUS_INFO[applicant.approvalStatusCode]}</Tag>
                            </Td>
                            <Td className="user-email">{applicant.userEmail}</Td>
                            <Td className="message">
                              {applicant.message && (
                                <Button
                                  size="xs"
                                  onClick={() => {
                                    dialogUtil.setMessage(MESSAGE_CATEGORY.WARNING, t('참여 요청 메세지'), applicant.message, () => {});
                                  }}
                                >
                                  <i className="fa-regular fa-envelope" /> {t('메세지')}
                                </Button>
                              )}
                            </Td>
                            <Td className="role">
                              {(applicant.approvalStatusCode === 'REQUEST' || applicant.approvalStatusCode === 'REQUEST_AGAIN') && (
                                <>
                                  <Button
                                    size="sm"
                                    color="primary"
                                    onClick={() => {
                                      approve(applicant.id);
                                    }}
                                  >
                                    {t('승인')}
                                  </Button>
                                  <Button
                                    size="sm"
                                    color="danger"
                                    onClick={() => {
                                      reject(applicant.id);
                                    }}
                                  >
                                    {t('거절')}
                                  </Button>
                                </>
                              )}
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </div>
              )}
            </Block>
          </>
        )}
        <Title paddingBottom={false} border={false}>
          {t('휴일 관리')}
        </Title>
        <Block className="space-project-block">
          {space.holidays?.length < 1 && (
            <EmptyContent className="empty-content" border>
              <div>{t('등록된 휴일이 없습니다.')}</div>
            </EmptyContent>
          )}
          {space.holidays?.length > 0 && (
            <div className="holiday-list-content">
              <Table cols={['1px', '1px', '100%']} border>
                <THead>
                  <Tr>
                    <Th align="center">{t('타입')}</Th>
                    <Th align="left">{t('이름')}</Th>
                    <Th align="left">{t('조건')}</Th>
                  </Tr>
                </THead>
                <Tbody>
                  {space.holidays.map((holiday, inx) => {
                    return (
                      <Tr key={inx}>
                        <Td align="center">
                          <Tag size="sm" color="white" border>
                            {HOLIDAY_TYPE_CODE[holiday.holidayType] || 'N/A'}
                          </Tag>
                        </Td>
                        <Td>{holiday.name}</Td>
                        {(holiday.holidayType === 'YEARLY' || holiday.holidayType === 'SPECIFIED_DATE') && (
                          <Td className="date-condition">
                            {holiday.holidayType === 'YEARLY'
                              ? moment(holiday.date, 'MMDD').format(DATE_FORMATS[dateUtil.getUserLocale()].days.moment)
                              : moment(holiday.date, 'YYYYMMDD').format(DATE_FORMATS[dateUtil.getUserLocale()].yearsDays.moment)}
                          </Td>
                        )}
                        {holiday.holidayType === 'CONDITION' && (
                          <Td className="condition">
                            <Tag size="sm" color="white" border>
                              {HOLIDAY_CONDITION_MONTH_LIST.find(d => d.key === holiday.month)?.value || ''}
                            </Tag>
                            <Tag size="sm" color="white" border>
                              {HOLIDAY_CONDITION_WEEK_LIST.find(d => d.key === holiday.week)?.value || ''}
                            </Tag>
                            <Tag size="sm" color="white" border>
                              {HOLIDAY_CONDITION_DAY_LIST.find(d => d.key === holiday.day)?.value || ''}
                            </Tag>
                          </Td>
                        )}
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </div>
          )}
        </Block>
        <Title paddingBottom={false} border={false}>
          {t('프로젝트 목록')}
        </Title>
        <Block className="space-project-block">
          {space?.projects?.length < 1 && (
            <EmptyContent className="empty-content" border>
              <div>{t('프로젝트가 없습니다.')}</div>
            </EmptyContent>
          )}
          {space?.projects.length > 0 && (
            <div className="project-list-content">
              <Table className="project-list" cols={['100%', '1px', '1px']} border>
                <THead>
                  <Tr>
                    <Th align="left">{t('프로젝트 명')}</Th>
                    <Th align="center">{t('테스트런')}</Th>
                    <Th align="center">{t('테스트케이스')}</Th>
                    <Th align="center">{t('상태')}</Th>
                  </Tr>
                </THead>
                <Tbody>
                  {space?.projects?.map(project => {
                    return (
                      <Tr key={project.id}>
                        <Td className="project-name">
                          <Link to={`/spaces/${space.code}/projects/${project.id}`}>{project.name}</Link>
                        </Td>
                        <Td align="center" className="testcase-count">
                          <div>
                            <span>{project.testrunCount}</span>
                          </div>
                        </Td>
                        <Td align="center" className="testcase-count">
                          <div>
                            <span>{project.testcaseCount}</span>
                          </div>
                        </Td>
                        <Td align="center" className="activated">
                          <Tag border uppercase>
                            {project.activated ? 'activated' : 'disabled'}
                          </Tag>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </div>
          )}
        </Block>
        <Title paddingBottom={false} border={false} marginBottom={false}>
          {t('관리')}
        </Title>
        <Block className="danger-box">
          <BlockRow>
            <Label>{t('스페이스 탈퇴')}</Label>
            <Button size="sm" color="warning" onClick={withdraw}>
              {t('스페이스 탈퇴')}
            </Button>
          </BlockRow>
          <BlockRow>
            <Label>{t('스페이스 삭제')}</Label>
            <Button size="sm" color="danger" onClick={onDelete}>
              {t('스페이스 삭제')}
            </Button>
          </BlockRow>
        </Block>
        <PageButtons
          onBack={() => {
            navigate(-1);
          }}
          onEdit={
            isAdmin || space?.admin
              ? () => {
                  navigate(`/spaces/${spaceCode}/edit`);
                }
              : null
          }
          onCancelIcon=""
        />
      </PageContent>
      {selectedMessageChannel && <MessageChannelViewerPopup messageChannel={selectedMessageChannel} setOpened={() => setSelectedMessageChannel(null)} />}
    </>
  );
}

SpaceContent.defaultProps = {
  space: {},
};

SpaceContent.propTypes = {
  space: SpacePropTypes,
  onRefresh: PropTypes.func.isRequired,
};

export default SpaceContent;
