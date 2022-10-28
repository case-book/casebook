import React, { useMemo, useState } from 'react';
import { Button, EmptyContent, PageContent, PageTitle, Radio, Tag } from '@/components';
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
        return '참여 요청';
      }

      case 'REQUEST_AGAIN': {
        return '재요청';
      }

      case 'APPROVAL': {
        return '승인됨';
      }

      case 'REJECTED': {
        return '거절됨';
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
        <div className="row general-info-row">
          <div className="col general-info">
            <div className="box">
              <div className="box-title">
                <span>스페이스 정보</span>
              </div>
              <div className="box-content">
                <div className="data-row">
                  <div className="data-row-label">{t('이름')}</div>
                  <div className="data-row-value">{space?.name}</div>
                </div>
                <div className="data-row">
                  <div className="data-row-label">{t('코드')}</div>
                  <div className="data-row-value">{space?.code}</div>
                </div>
                <div className="data-row">
                  <div className="data-row-label">{t('설명')}</div>
                  <div className="data-row-value">{space?.description}</div>
                </div>
                <div className="data-row">
                  <div className="data-row-label">{t('사용 여부')}</div>
                  <div className="data-row-value">{space?.activated ? 'Y' : 'N'}</div>
                </div>
                <div className="data-row">
                  <div className="data-row-label">{t('검색 허용')}</div>
                  <div className="data-row-value">{space?.allowSearch ? 'Y' : 'N'}</div>
                </div>
                <div className="data-row">
                  <div className="data-row-label">{t('자동 가입')}</div>
                  <div className="data-row-value">{space?.allowAutoJoin ? 'Y' : 'N'}</div>
                </div>
                <div className="data-row">
                  <div className="data-row-label">{t('토큰')}</div>
                  <div className="data-row-value token">
                    <Tag>{space?.token}</Tag>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col member-info">
            <div className="box">
              <div className="box-title">
                <span>스페이스 사용자</span>
                <span>
                  {userRoles.map(option => {
                    return (
                      <Radio
                        key={option.key}
                        type="inline"
                        size="xs"
                        value={option.key}
                        checked={userRole === option.key}
                        label={option.value}
                        onChange={val => {
                          setUserRole(val);
                        }}
                      />
                    );
                  })}
                </span>
              </div>
              <div className="box-content">
                <div className="scroller">
                  {users?.length < 1 && (
                    <EmptyContent className="empty-content">
                      <div>프로젝트가 없습니다.</div>
                    </EmptyContent>
                  )}
                  {users?.length > 0 && (
                    <table className="user-list">
                      <tbody>
                        {users?.map(user => {
                          return (
                            <tr key={user.id}>
                              <td className="user-info">
                                <div className="name">{user.name}</div>
                                <div className="email">{user.email}</div>
                              </td>
                              <td className={`role ${user.role}`}>
                                <Tag className="tag">
                                  <span className="icon">{user.role === 'ADMIN' ? <i className="fa-solid fa-crown" /> : <i className="fa-solid fa-user" />}</span>{' '}
                                  {user.role === 'ADMIN' ? '관리자' : '사용자'}
                                </Tag>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {space.admin && (
          <div className="row project-row">
            <div className="col project-info">
              <div className="box">
                <div className="box-title">
                  <span>프로젝트</span>
                </div>
                <div className="box-content">
                  <div className="scroller">
                    {space?.projects?.length < 1 && (
                      <EmptyContent className="empty-content">
                        <div>프로젝트가 없습니다.</div>
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
                  </div>
                </div>
              </div>
            </div>
            <div className="col member-info">
              <div className="box">
                <div className="box-title">
                  <span>스페이스 참여 요청</span>
                  <span>
                    {statusOptions.map(option => {
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
                  </span>
                </div>
                <div className="box-content">
                  <div className="scroller">
                    {applicants?.length < 1 && (
                      <EmptyContent className="empty-content">
                        <div>참여 요청이 없습니다.</div>
                      </EmptyContent>
                    )}
                    {applicants?.length > 0 && (
                      <table className="applicant-list">
                        <tbody>
                          {applicants?.map(applicant => {
                            return (
                              <tr key={applicant.id}>
                                <td className={`request-status ${applicant.approvalStatusCode}`}>
                                  <Tag>{getApprovalStatusName(applicant.approvalStatusCode)}</Tag>
                                </td>
                                <td className="user-info">
                                  <div className="name">{applicant.userName}</div>
                                  <div className="email">{applicant.userEmail}</div>
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
                                      <i className="fa-regular fa-envelope" /> 메세지
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
                                        승인
                                      </Button>
                                      <Button
                                        size="xs"
                                        color="danger"
                                        onClick={() => {
                                          reject(applicant.id);
                                        }}
                                      >
                                        거절
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
                  </div>
                </div>
              </div>
            </div>
          </div>
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
