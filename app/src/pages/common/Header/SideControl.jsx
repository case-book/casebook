import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import useStores from '@/hooks/useStores';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import UserService from '@/services/UserService';
import { Button, Loader, Switch } from '@/components';
import { setOption } from '@/utils/storageUtil';
import { useTranslation } from 'react-i18next';
import { setToken } from '@/utils/request';
import { THEMES } from '@/constants/constants';
import './SideControl.scss';
import NotificationList from '@/components/NotificationList/NotificationList';

function SideControl({ className }) {
  const {
    userStore: { isLogin, isAdmin, setUser, notificationCount, setNotificationCount },
    themeStore: { theme, setTheme },
  } = useStores();

  const navigate = useNavigate();

  const notificationScrollerElement = useRef(null);

  const notificationListElement = useRef(null);

  const fetching = useRef(false);

  const { t } = useTranslation();

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [notificationLoading, setNotificationLoading] = useState(false);

  const [notificationInfo, setNotificationInfo] = useState({
    lastSeen: null,
    notifications: [],
    hasNext: false,
    pageNo: 0,
  });

  const [notificationOpen, setNotificationOpen] = useState(false);

  const [notificationChangeEffect, setNotificationChangeEffect] = useState(false);

  useEffect(() => {
    if (notificationCount > 0) {
      setNotificationChangeEffect(true);
      setTimeout(() => {
        setNotificationChangeEffect(false);
      }, 1000);
    }
  }, [notificationCount]);

  const getNotificationInfo = pageNo => {
    setNotificationLoading(true);
    fetching.current = true;
    UserService.getUserNotificationList(
      pageNo,
      info => {
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

        setTimeout(() => {
          setNotificationLoading(false);
        }, 200);
      },
      () => {
        setTimeout(() => {
          setNotificationLoading(false);
        }, 200);
      },
    );
  };

  const openUserNotificationPopup = opened => {
    if (opened) {
      getNotificationInfo(0);
    }

    setNotificationOpen(opened);
  };

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

  return (
    <div className={`side-control-wrapper ${className} ${isLogin ? 'is-login' : 'is-not-login'}`}>
      <div className="theme-selector side-menu-item">
        <div>
          <Switch
            value={theme === THEMES.DARK}
            onClick={() => {
              setTheme(theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK);
            }}
          />
        </div>
      </div>
      <div className="notification-menu side-menu-item">
        {isLogin && (
          <Button
            outline
            rounded
            className={notificationChangeEffect ? 'effect' : ''}
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
        )}
      </div>
      <div className="user-menu side-menu-item">
        {isLogin && (
          <Button
            outline
            rounded
            onClick={e => {
              e.preventDefault();
              setUserMenuOpen(true);
            }}
          >
            {isAdmin && <div className="admin-flag">ADMIN</div>}
            <div className="icon">
              <i className="fa-solid fa-skull" />
            </div>
          </Button>
        )}
        {!isLogin && <Link to="/users/login">{t('로그인')}</Link>}
        {!isLogin && (
          <Link className="join-link" to="/users/join">
            {t('회원 가입')}
          </Link>
        )}
      </div>
      <div className="header-toggle side-menu-item">
        <Button
          outline
          rounded
          onClick={e => {
            e.preventDefault();
          }}
        >
          1
        </Button>
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
              <div className={`notification-loader ${notificationLoading ? 'loading' : ''}`}>
                <Loader color="primary" />
              </div>
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
                <NotificationList
                  elementRef={notificationListElement}
                  notificationList={notificationInfo?.notifications}
                  lastSeen={notificationInfo.lastSeen}
                  hasNext={notificationInfo.hasNext}
                  onLinkClick={() => {
                    openUserNotificationPopup(false);
                  }}
                  onMoreClick={() => {
                    if (notificationInfo.hasNext) {
                      getNotificationInfo(notificationInfo.pageNo + 1);
                    }
                  }}
                />
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
                    {t('내 정보')}
                  </Link>
                </li>
                <li>
                  <Link to="/" onClick={logout}>
                    {t('로그아웃')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

SideControl.defaultProps = {
  className: '',
};

SideControl.propTypes = {
  className: PropTypes.string,
};

export default observer(SideControl);
