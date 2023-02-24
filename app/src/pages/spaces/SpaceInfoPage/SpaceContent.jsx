import React, { useMemo, useState } from 'react';
import { Block, BlockRow, Button, EmptyContent, Label, PageButtons, PageContent, PageTitle, Radio, Table, Tag, Tbody, Td, Text, Th, THead, Title, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import SpaceService from '@/services/SpaceService';
import { SpacePropTypes } from '@/proptypes';
import PropTypes from 'prop-types';
import dialogUtil from '@/utils/dialogUtil';
import { APPROVAL_STATUS_INFO, DATE_FORMATS, MESSAGE_CATEGORY } from '@/constants/constants';
import MemberCardManager from '@/components/MemberManager/MemberCardManager';
import useStores from '@/hooks/useStores';
import './SpaceContent.scss';
import moment from 'moment';
import dateUtil from '@/utils/dateUtil';

function SpaceContent({ space, onRefresh }) {
  const { t } = useTranslation();

  const {
    userStore: { removeSpace, isAdmin },
  } = useStores();

  const navigate = useNavigate();

  const { id } = useParams();
  const [status, setStatus] = useState('REQUEST');
  const [userRole, setUserRole] = useState('ALL');
  const [tooltipId, setTooltipId] = useState(null);
  const [statusOptions] = useState([
    { key: 'ALL', value: t('전체') },
    { key: 'REQUEST', value: t('요청') },
  ]);
  const [userRoles] = useState([
    { key: 'ALL', value: t('전체') },
    { key: 'ADMIN', value: t('관리자') },
    { key: 'USER', value: t('사용자') },
  ]);

  const approve = applicantId => {
    SpaceService.approveSpaceJoinRequest(id, applicantId, () => {
      onRefresh();
    });
  };

  const reject = applicantId => {
    SpaceService.rejectSpaceJoinRequest(id, applicantId, () => {
      onRefresh();
    });
  };

  const withdraw = () => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('스페이스 탈퇴'),
      <div>{t('스페이스를 탈퇴하면, 스페이스 및 스페이스 하위 프로젝트들에 더 이상 접근할 수 없습니다. 탈퇴하시겠습니까?')}</div>,
      () => {
        SpaceService.withdrawSpace(id, () => {
          onRefresh();
        });
      },
      null,
      t('탈퇴'),
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
    );
  };

  return (
    <>
      <PageTitle
        links={isAdmin || space?.admin ? [<Link to={`/spaces/${id}/edit`}>{t('편집')}</Link>] : null}
        control={
          <div>
            <Button size="sm" color="warning" onClick={withdraw}>
              {t('스페이스 탈퇴')}
            </Button>
            {(isAdmin || space?.admin) && (
              <Button size="sm" color="danger" onClick={onDelete}>
                {t('스페이스 삭제')}
              </Button>
            )}
          </div>
        }
        onListClick={() => {
          navigate('/spaces');
        }}
      >
        {t('스페이스')}
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
            <Label>{t('토큰')}</Label>
            <Text>{space?.token}</Text>
          </BlockRow>
        </Block>
        <Title
          control={userRoles.map(option => {
            return (
              <Radio
                key={option.key}
                type="line"
                size="sm"
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
        {isAdmin && space?.admin && (
          <>
            <Title
              control={statusOptions.map(option => {
                return (
                  <Radio
                    key={option.key}
                    type="line"
                    size="sm"
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
              {applicants?.length < 1 && (
                <EmptyContent className="empty-content">
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
                              <Tag border rounded={false}>
                                {APPROVAL_STATUS_INFO[applicant.approvalStatusCode]}
                              </Tag>
                            </Td>
                            <Td className="user-email">{applicant.userEmail}</Td>
                            <Td className="message">
                              {tooltipId === applicant.id && (
                                <>
                                  <div
                                    className="message-tooltip-overlay"
                                    onClick={() => {
                                      setTooltipId(null);
                                    }}
                                  />
                                  <div className="message-tooltip">
                                    <div className="arrow">
                                      <div />
                                    </div>
                                    <div className="message-content">{applicant.message}</div>
                                  </div>
                                </>
                              )}
                              {applicant.message && (
                                <Button
                                  size="xs"
                                  onClick={() => {
                                    if (applicant.id !== tooltipId) {
                                      setTooltipId(applicant.id);
                                    } else {
                                      setTooltipId(null);
                                    }
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
          {!(space.holidays?.length > 0) && (
            <EmptyContent className="empty-content">
              <div>{t('등록된 휴일이 없습니다.')}</div>
            </EmptyContent>
          )}
          {space.holidays?.length > 0 && (
            <div className="holiday-list-content">
              <Table cols={['1px', '1px', '100%']} border>
                <THead>
                  <Tr>
                    <Th align="center">{t('타입')}</Th>
                    <Th align="left">{t('날짜')}</Th>
                    <Th align="left">{t('이름')}</Th>
                  </Tr>
                </THead>
                <Tbody>
                  {space.holidays.map((holiday, inx) => {
                    return (
                      <Tr key={inx}>
                        <Td align="center">
                          <Tag size="sm" color="white" border>
                            {holiday.isRegular ? t('정기 휴일') : t('지정 휴일')}
                          </Tag>
                        </Td>
                        <Td>
                          {holiday.isRegular
                            ? moment(holiday.date, 'MMDD').format(DATE_FORMATS[dateUtil.getUserLocale()].days.moment)
                            : moment(holiday.date, 'YYYYMMDD').format(DATE_FORMATS[dateUtil.getUserLocale()].yearsDays.moment)}
                        </Td>
                        <Td>{holiday.name}</Td>
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
            <EmptyContent className="empty-content">
              <div>{t('프로젝트가 없습니다.')}</div>
            </EmptyContent>
          )}
          {space?.projects.length > 0 && (
            <div className="project-list-content">
              <Table className="project-list" cols={['100%', '1px', '1px']} border>
                <THead>
                  <Tr>
                    <Th align="left">{t('프로젝트 명')}</Th>
                    <Th align="center">{t('상태')}</Th>
                    <Th align="center">{t('테스트케이스')}</Th>
                    <Th align="center">{t('버그')}</Th>
                  </Tr>
                </THead>
                <Tbody>
                  {space?.projects?.map(project => {
                    return (
                      <Tr key={project.id}>
                        <Td className="project-name">
                          <Link to={`/spaces/${space.code}/projects/${project.id}`}>{project.name}</Link>
                        </Td>
                        <Td align="center" className="activated">
                          <Tag uppercase>{project.activated ? 'activated' : 'disabled'}</Tag>
                        </Td>
                        <Td align="center" className="testcase-count">
                          <div>
                            <span>{project.testcaseCount}</span>
                          </div>
                        </Td>
                        <Td align="center" className="bug-count">
                          <div>
                            <span>{project.bugCount}</span>
                          </div>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </div>
          )}
        </Block>
        <PageButtons
          outline
          onBack={() => {
            navigate(-1);
          }}
          onEdit={
            isAdmin && space?.admin
              ? () => {
                  navigate(`/spaces/${id}/edit`);
                }
              : null
          }
          onCancelIcon=""
        />
      </PageContent>
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
