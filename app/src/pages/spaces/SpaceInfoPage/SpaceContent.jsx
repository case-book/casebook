import React, { useMemo, useState } from 'react';
import { Button, Card, CardContent, CardHeader, Col, Dd, Dl, Dt, EmptyContent, PageContent, PageTitle, Radio, Row, Table, Tag, Tbody, Td, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import SpaceService from '@/services/SpaceService';
import { SpacePropTypes } from '@/proptypes';
import PropTypes from 'prop-types';
import './SpaceContent.scss';
import dialogUtil from '@/utils/dialogUtil';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import MemberManager from '@/components/MemberManager/MemberManager';

function SpaceContent({ space, onRefresh }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const [status, setStatus] = useState('REQUEST');
  const [userRole, setUserRole] = useState('ALL');
  const [tooltipId, setTooltipId] = useState(null);
  const [statusOptions] = useState([
    { key: 'ALL', value: '전체' },
    { key: 'REQUEST', value: '요청' },
  ]);
  const [userRoles] = useState([
    { key: 'ALL', value: '전체' },
    { key: 'ADMIN', value: '관리자' },
    { key: 'USER', value: '사용자' },
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

  const getApprovalStatusName = code => {
    switch (code) {
      case 'REQUEST': {
        return '요청';
      }

      case 'REQUEST_AGAIN': {
        return '재요청';
      }

      case 'APPROVAL': {
        return '승인';
      }

      case 'REJECTED': {
        return '거절';
      }

      default: {
        return 'NONE';
      }
    }
  };

  return (
    <>
      <PageTitle
        links={space?.admin ? [<Link to={`/spaces/${id}/edit`}>{t('스페이스 변경')}</Link>] : null}
        control={
          <div>
            <Button size="sm" color="danger" onClick={withdraw}>
              {t('스페이스 탈퇴')}
            </Button>
          </div>
        }
      >
        {t('스페이스')}
      </PageTitle>
      <PageContent className="space-info-content">
        <Row minHeight="400px" flexGrow="auto">
          <Col className="general-info">
            <Card>
              <CardHeader>스페이스 정보</CardHeader>
              <CardContent scroll>
                <Dl>
                  <Dt>{t('이름')}</Dt>
                  <Dd>{space?.name}</Dd>
                </Dl>
                <Dl>
                  <Dt>{t('코드')}</Dt>
                  <Dd>{space?.code}</Dd>
                </Dl>
                <Dl>
                  <Dt>{t('설명')}</Dt>
                  <Dd>{space?.description}</Dd>
                </Dl>
                <Dl>
                  <Dt>{t('사용 여부')}</Dt>
                  <Dd>{space?.activated ? 'Y' : 'N'}</Dd>
                </Dl>
                <Dl>
                  <Dt>{t('검색 허용')}</Dt>
                  <Dd>{space?.allowSearch ? 'Y' : 'N'}</Dd>
                </Dl>
                <Dl>
                  <Dt>{t('자동 가입')}</Dt>
                  <Dd>{space?.allowAutoJoin ? 'Y' : 'N'}</Dd>
                </Dl>
                <Dl>
                  <Dt>{t('토큰')}</Dt>
                  <Dd>{space?.token}</Dd>
                </Dl>
              </CardContent>
            </Card>
          </Col>
          <Col className="member-info">
            <Card>
              <CardHeader
                control={userRoles.map(option => {
                  return (
                    <Radio
                      key={option.key}
                      type="line"
                      size="sm"
                      value={option.key}
                      checked={userRole === option.key}
                      label={option.value}
                      onChange={val => {
                        setUserRole(val);
                      }}
                    />
                  );
                })}
              >
                {t('스페이스 사용자')}
              </CardHeader>
              <CardContent scroll>
                {users?.length < 1 && (
                  <EmptyContent className="empty-content">
                    <div>{t('프로젝트가 없습니다.')}</div>
                  </EmptyContent>
                )}
                {users?.length > 0 && <MemberManager users={users} />}
              </CardContent>
            </Card>
          </Col>
        </Row>
        <Row minHeight="400px" flexGrow="1">
          <Col className={`project-info ${space.admin ? 'is-admin' : 'is-user'}`}>
            <Card className="card">
              <CardHeader>{t('프로젝트')}</CardHeader>
              <CardContent scroll>
                {space?.projects?.length < 1 && (
                  <EmptyContent className="empty-content">
                    <div>{t('프로젝트가 없습니다.')}</div>
                  </EmptyContent>
                )}
                {space?.projects.length > 0 && (
                  <Table className="project-list" cols={['100%', '1px', '1px']}>
                    <Tbody>
                      {space?.projects?.map(project => {
                        return (
                          <Tr key={project.id}>
                            <Td className="project-name">
                              <Link to={`/spaces/${space.code}/projects/${project.id}`}>{project.name}</Link>
                            </Td>
                            <Td className="activated">
                              <Tag uppercase>{project.activated ? 'activated' : 'disabled'}</Tag>
                            </Td>
                            <Td className="testcase-count">
                              <div>
                                <span>{project.testcaseCount}</span>
                              </div>
                            </Td>
                            <Td className="bug-count">
                              <div>
                                <span>{project.bugCount}</span>
                              </div>
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </Col>
          {space.admin && (
            <Col className="member-info">
              <Card className="card">
                <CardHeader
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
                >
                  {t('스페이스 참여 요청')}
                </CardHeader>
                <CardContent scroll>
                  {applicants?.length < 1 && (
                    <EmptyContent className="empty-content">
                      <div>{t('참여 요청이 없습니다.')}</div>
                    </EmptyContent>
                  )}
                  {applicants?.length > 0 && (
                    <Table className="applicant-list" cols={['1px', '1px', '100%', '1px', '1px']}>
                      <Tbody>
                        {applicants?.map(applicant => {
                          return (
                            <Tr key={applicant.id}>
                              <Td className={`request-status ${applicant.approvalStatusCode}`}>
                                <Tag rounded={false}>{getApprovalStatusName(applicant.approvalStatusCode)}</Tag>
                              </Td>
                              <Td className="user-info">{applicant.userName}</Td>
                              <Td className="user-email">
                                <Tag className="tag" border={false} uppercase>
                                  {applicant.userEmail}
                                </Tag>
                              </Td>
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
                                      size="xs"
                                      color="primary"
                                      onClick={() => {
                                        approve(applicant.id);
                                      }}
                                    >
                                      {t('승인')}
                                    </Button>
                                    <Button
                                      size="xs"
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
                  )}
                </CardContent>
              </Card>
            </Col>
          )}
        </Row>
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
