import React, { useMemo, useState } from 'react';
import { Button, Card, CardContent, CardHeader, Col, Dd, Dl, Dt, EmptyContent, PageContent, PageTitle, Radio, Row, Tag } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import SpaceService from '@/services/SpaceService';
import { SpacePropTypes } from '@/proptypes';
import PropTypes from 'prop-types';
import './SpaceContent.scss';

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
      <PageTitle links={space?.admin ? [<Link to={`/spaces/${id}/edit`}>{t('스페이스 변경')}</Link>] : null}>{t('스페이스')}</PageTitle>
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
                {users?.length > 0 && (
                  <table className="user-list">
                    <tbody>
                      {users?.map(user => {
                        return (
                          <tr key={user.id}>
                            <td className="user-info">{user.name}</td>
                            <td className="user-email">
                              <Tag className="tag" border={false}>
                                {user.email}
                              </Tag>
                            </td>
                            <td className={`role ${user.role}`}>
                              <Tag className="tag" border={false}>
                                <span className="icon">{user.role === 'ADMIN' ? <i className="fa-solid fa-crown" /> : <i className="fa-solid fa-user" />}</span>{' '}
                                {user.role === 'ADMIN' ? t('관리자') : t('사용자')}
                              </Tag>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          </Col>
        </Row>

        {space.admin && (
          <Row minHeight="400px" flexGrow="1">
            <Col className="project-info">
              <Card className="card">
                <CardHeader>{t('프로젝트')}</CardHeader>
                <CardContent scroll>
                  {space?.projects?.length < 1 && (
                    <EmptyContent className="empty-content">
                      <div>{t('프로젝트가 없습니다.')}</div>
                    </EmptyContent>
                  )}
                  {space?.projects.length > 0 && (
                    <table className="project-list">
                      <tbody>
                        {space?.projects?.map(project => {
                          return (
                            <tr key={project.id}>
                              <td className="project-name">
                                <Link to={`/spaces/${space.code}/projects/${project.id}`}>{project.name}</Link>
                              </td>
                              <td className="activated">
                                <Tag>{project.activated ? 'activated' : 'disabled'}</Tag>
                              </td>
                              <td className="testcase-count">
                                <div>
                                  <span>{project.testcaseCount}</span>
                                </div>
                              </td>
                              <td className="bug-count">
                                <div>
                                  <span>{project.bugCount}</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </CardContent>
              </Card>
            </Col>
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
                    <table className="applicant-list">
                      <tbody>
                        {applicants?.map(applicant => {
                          return (
                            <tr key={applicant.id}>
                              <td className={`request-status ${applicant.approvalStatusCode}`}>
                                <Tag rounded={false}>{getApprovalStatusName(applicant.approvalStatusCode)}</Tag>
                              </td>
                              <td className="user-info">{applicant.userName}</td>
                              <td className="user-email">
                                <Tag className="tag" border={false}>
                                  {applicant.userEmail}
                                </Tag>
                              </td>
                              <td className="message">
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
                              </td>
                              <td className="role">
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
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </CardContent>
              </Card>
            </Col>
          </Row>
        )}
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
