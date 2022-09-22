import React, { useState } from 'react';
import { observer } from 'mobx-react';
import useStores from '@/hooks/useStores';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserService from '@/services/UserService';
import { Button, Liner } from '@/components';
import { MENUS } from '@/constants/menu';
import './Header.scss';
import { setOption } from '@/utils/storageUtil';
import { useTranslation } from 'react-i18next';

function Header({ className, theme }) {
  const {
    userStore: { isLogin, setUser },
    controlStore: { hideHeader },
    contextStore: { spaceCode, projectId, isProjectSelected },
  } = useStores();

  const navigate = useNavigate();

  const location = useLocation();

  const { t } = useTranslation();

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const logout = e => {
    e.preventDefault();
    e.stopPropagation();

    setUserMenuOpen(false);
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
                  } else {
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
                      <Link to={d.project ? `/spaces/${spaceCode}/projects/${projectId}${d.to}` : d.to} onClick={() => {}}>
                        <span>{d.name}</span>
                      </Link>
                      <div className="cursor">
                        <div />
                      </div>
                      <Liner className="liner" display="inline-block" width="1px" height="10px" color={theme === 'white' ? 'black' : 'white'} margin="0 16px" />
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
        <div className="user-menu">
          {isLogin && (
            <Button
              rounded
              outline
              onClick={e => {
                e.preventDefault();
                setUserMenuOpen(true);
              }}
            >
              <div className="user-icon">
                <i className="fa-solid fa-skull" />
              </div>
            </Button>
          )}
          {!isLogin && <Link to="/users/login">{t('로그인')}</Link>}
          {!isLogin && <Link to="/users/login">{t('회원가입')}</Link>}
        </div>
      </div>
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
