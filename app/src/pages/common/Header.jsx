import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import useStores from '@/hooks/useStores';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserService from '@/services/UserService';
import { Button, Liner, TargetSelector } from '@/components';
import { MENUS, STATIC_MENUS } from '@/constants/menu';
import './Header.scss';
import { setOption } from '@/utils/storageUtil';
import { useTranslation } from 'react-i18next';
import ProjectService from '@/services/ProjectService';
import { setToken } from '@/utils/request';
import moment from 'moment';

function Header({ className, theme }) {
  const {
    userStore: { isLogin, setUser, user, notificationCount, setNotificationCount },
    controlStore: { hideHeader, setHideHeader },
    contextStore: { spaceCode, projectId, isProjectSelected, isSpaceSelected },
  } = useStores();

  const navigate = useNavigate();

  const notificationScrollerElement = useRef(null);

  const notificationListElement = useRef(null);

  const fetching = useRef(false);

  const location = useLocation();

  const timer = useRef(null);

  const { t } = useTranslation();

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [projectList, setProjectList] = useState([]);

  const [notificationInfo, setNotificationInfo] = useState({
    lastSeen: null,
    notifications: [],
    hasNext: false,
    pageNo: 0,
  });

  const [notificationOpen, setNotificationOpen] = useState(false);

  const getNotificationInfo = pageNo => {
    fetching.current = true;
    UserService.getUserNotificationList(pageNo, info => {
      if (pageNo === 0) {
        fetching.current = false;
      } else {
        setTimeout(() => {
          fetching.current = false;
        }, 500);
      }

      if (info.pageNo > 0) {
        setNotificationInfo({
          ...info,
          lastSeen: notificationInfo.lastSeen,
          notifications: notificationInfo.notifications.concat(info.notifications),
        });
      } else {
        setNotificationCount(0);
        setNotificationInfo(info);
      }
    });
  };

  const openUserNotificationPopup = opened => {
    if (opened) {
      getNotificationInfo(0);
    }

    setNotificationOpen(opened);
  };

  useEffect(() => {
    const spaceCodeRegex = /^[A-Z\d_-]+$/;

    if (spaceCodeRegex.test(spaceCode)) {
      ProjectService.selectProjectList(
        spaceCode,
        list => {
          setProjectList(list);
        },
        () => {
          return true;
        },
        false,
      );
    }
  }, [spaceCode]);

  const [menuAlert, setMenuAlert] = useState({
    inx: null,
    message: '',
  });

  const logout = e => {
    e.preventDefault();
    e.stopPropagation();

    setUserMenuOpen(false);
    setToken('');
    setOption('user', 'info', 'uuid', '');
    UserService.logout(
      () => {
        setUser(null);
        navigate('/');
      },
      () => {
        setUser(null);
        navigate('/');
      },
    );
  };

  const isRoot = location.pathname === '/';

  return (
    <header className={`${className} header-wrapper ${hideHeader ? 'hide' : ''} ${isRoot ? 'is-main' : ''} theme-${theme}`}>
      <div className="header-bg">
        <span>
          <i className="fa-solid fa-chess-rook" />
        </span>
      </div>
      <div className="header-content">
        <div className={`back-navigator ${isRoot ? 'is-root' : ''}`}>
          <div
            onClick={() => {
              navigate(-1);
            }}
          >
            <div>
              <i className="fa-solid fa-chevron-left" />
            </div>
          </div>
        </div>
        <div className="logo">
          <div
            onClick={() => {
              navigate('/');
            }}
          >
            <div>CASEBOOK</div>
          </div>
        </div>
        <div className="spacer">{isLogin && <div />}</div>
        <div className="menu">
          <div>
            <ul>
              {MENUS.filter(d => d.pc)
                .filter(d => d.project === isProjectSelected)
                .filter(d => !d.admin)
                .filter(d => d.login === undefined || d.login === isLogin)
                .map((d, inx) => {
                  let isSelected = false;
                  if (d.project) {
                    isSelected = location.pathname === `/spaces/${spaceCode}/projects/${projectId}${d.to}`;
                  } else if (d.selectedAlias) {
                    isSelected = d.selectedAlias.reduce((p, c) => {
                      return p || c.test(location.pathname);
                    }, false);
                  }

                  if (!isSelected) {
                    isSelected = location.pathname === d.to;
                  }

                  return (
                    <li
                      key={inx}
                      className={isSelected ? 'selected' : ''}
                      style={{
                        animationDelay: `${inx * 0.1}s`,
                      }}
                    >
                      <Link to={d.project ? `/spaces/${spaceCode}/projects/${projectId}${d.to}` : d.to}>
                        <span className="text">
                          {d.name}
                          <span />
                        </span>
                      </Link>
                      <div className="cursor">
                        <div />
                      </div>
                      <Liner className="liner" display="inline-block" width="1px" height="10px" color={theme === 'white' ? 'black' : 'white'} margin="0 10px" />
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
        <div className={`static-menu ${isProjectSelected ? 'project-selected' : ''}`}>
          {isLogin && (
            <div>
              <ul>
                {STATIC_MENUS.filter(d => d.pc)
                  .filter(d => !d.admin || (d.admin && user.systemRole === 'ROLE_ADMIN'))
                  .map((d, inx) => {
                    const isSelected = d.selectedAlias.reduce((p, c) => {
                      return p || c.test(location.pathname);
                    }, false);

                    return (
                      <li
                        key={inx}
                        className={isSelected ? 'selected' : ''}
                        style={{
                          animationDelay: `${inx * 0.1}s`,
                        }}
                      >
                        <Link
                          to={d.project ? `/spaces/${spaceCode}/projects/${projectId}${d.to}` : d.to}
                          onClick={e => {
                            if (d.prefixSpace) {
                              e.preventDefault();

                              if (isSpaceSelected) {
                                navigate(`/spaces/${spaceCode}${d.to}`);
                              } else {
                                setMenuAlert({
                                  inx,
                                  message: '스페이스를 먼저 선택해주세요.',
                                });

                                if (timer.current) {
                                  clearTimeout(timer.current);
                                  timer.current = null;
                                }

                                timer.current = setTimeout(() => {
                                  timer.current = null;
                                  setMenuAlert({
                                    inx: null,
                                    message: '',
                                  });
                                }, 2000);
                              }
                            }
                          }}
                        >
                          <span className="text">{d.name}</span>
                          {menuAlert.inx === inx && <span className="alert-message">{menuAlert.message}</span>}
                        </Link>
                        {d.key === 'space' && isSpaceSelected && (
                          <TargetSelector
                            value={spaceCode}
                            list={user?.spaces?.map(space => {
                              return {
                                key: space.code,
                                value: space.name,
                              };
                            })}
                            onClick={value => {
                              navigate(`/spaces/${value}/projects`);
                            }}
                          />
                        )}
                        {d.key === 'project' && isProjectSelected && (
                          <TargetSelector
                            value={Number(projectId)}
                            list={projectList?.map(project => {
                              return {
                                key: project.id,
                                value: project.name,
                              };
                            })}
                            onClick={value => {
                              navigate(`/spaces/${spaceCode}/projects/${value}`);
                            }}
                          />
                        )}
                        <Liner className="liner" display="inline-block" width="1px" height="10px" color={theme === 'white' ? 'black' : 'white'} margin="0 12px" />
                      </li>
                    );
                  })}
              </ul>
            </div>
          )}
        </div>
        {isLogin && (
          <div className="notification-menu">
            <Button
              rounded
              onClick={e => {
                e.preventDefault();
                openUserNotificationPopup(true);
              }}
            >
              {notificationCount > 0 && (
                <span className="notification-count">
                  <span>{notificationCount > 9 ? '9+' : notificationCount}</span>
                </span>
              )}
              <i className="fa-solid fa-bell" />
            </Button>
          </div>
        )}
        <div className="user-menu">
          {isLogin && (
            <Button
              rounded
              onClick={e => {
                e.preventDefault();
                setUserMenuOpen(true);
              }}
            >
              <div className="icon">
                <i className="fa-solid fa-skull" />
              </div>
            </Button>
          )}
          {!isLogin && <Link to="/users/login">{t('로그인')}</Link>}
          {!isLogin && <Link to="/users/join">{t('회원가입')}</Link>}
        </div>
        <div className="header-toggle">
          <Button
            rounded
            onClick={e => {
              e.preventDefault();
              setHideHeader(!hideHeader);
            }}
          >
            <div className="icon">
              {!hideHeader && <i className="fa-solid fa-turn-up" />}
              {hideHeader && <i className="fa-solid fa-arrow-down" />}
            </div>
          </Button>
        </div>
      </div>
      {notificationOpen && (
        <div
          className="notification-list"
          onClick={() => {
            openUserNotificationPopup(false);
          }}
        >
          <div>
            <div>
              <div className="arrow">
                <div />
              </div>
              <div
                className="notification-list-scroller"
                ref={notificationScrollerElement}
                onClick={e => e.stopPropagation()}
                onScroll={() => {
                  if (notificationScrollerElement.current && notificationListElement.current) {
                    if (
                      !fetching.current &&
                      notificationInfo.hasNext &&
                      notificationListElement.current.offsetHeight - (notificationScrollerElement.current.scrollTop + notificationScrollerElement.current.offsetHeight) < 40
                    ) {
                      getNotificationInfo(notificationInfo.pageNo + 1);
                    }
                  }
                }}
              >
                <ul ref={notificationListElement}>
                  {notificationInfo?.notifications.map(d => {
                    return (
                      <li key={d.id} className={moment(d.creationDate).isAfter(moment(notificationInfo.lastSeen)) ? 'unread' : ''}>
                        <div className="message">
                          {d.url && (
                            <Link
                              to={d.url}
                              onClick={e => {
                                e.stopPropagation();
                                openUserNotificationPopup(false);
                              }}
                            >
                              {d.message}
                            </Link>
                          )}
                          {!d.url && <span>{d.message}</span>}
                        </div>
                        <div className="time">{moment(d.creationDate).format('YYYY-MM-DD HH:mm:ss')}</div>
                      </li>
                    );
                  })}
                  {!notificationInfo.hasNext && <li className="end-list">다음 알림이 없습니다.</li>}
                  {notificationInfo.hasNext && (
                    <li className="has-next">
                      <Button
                        size="sm"
                        color="primary"
                        onClick={() => {
                          if (notificationInfo.hasNext) {
                            getNotificationInfo(notificationInfo.pageNo + 1);
                          }
                        }}
                      >
                        더 보기
                      </Button>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      {userMenuOpen && (
        <div
          className="my-info-menu"
          onClick={() => {
            setUserMenuOpen(false);
          }}
        >
          <div>
            <div>
              <div className="arrow">
                <div />
              </div>
              <ul>
                <li>
                  <Link
                    to="/users/my"
                    onClick={e => {
                      e.stopPropagation();
                      setUserMenuOpen(false);
                    }}
                  >
                    내 정보
                  </Link>
                </li>
                <li>
                  <Link to="/" onClick={logout}>
                    로그아웃
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

Header.defaultProps = {
  className: '',
  theme: 'white',
};

Header.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.string,
};

export default observer(Header);
