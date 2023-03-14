import React, { useState } from 'react';
import { observer } from 'mobx-react';
import useStores from '@/hooks/useStores';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserService from '@/services/UserService';
import { LogoIcon } from '@/components';
import { setOption } from '@/utils/storageUtil';
import { useTranslation } from 'react-i18next';
import { setToken } from '@/utils/request';
import './Header.scss';
import ProjectMenu from '@/pages/common/Header/ProjectMenu';
import MainMenu from '@/pages/common/Header/MainMenu';
import SideControl from '@/pages/common/Header/SideControl';

function Header({ className }) {
  const {
    userStore: { isLogin, setUser },
    controlStore: { hideHeader },
    themeStore: { theme },
  } = useStores();

  const navigate = useNavigate();

  const location = useLocation();

  const { t } = useTranslation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logout = e => {
    e.preventDefault();
    e.stopPropagation();

    setToken('');
    setOption('user', 'info', 'uuid', '');
    UserService.logout(
      () => {
        setUser(null);
        navigate('/');
        setMobileMenuOpen(false);
      },
      () => {
        setUser(null);
        navigate('/');
        setMobileMenuOpen(false);
      },
    );
  };

  const isRoot = location.pathname === '/';

  return (
    <header className={`${className} g-no-select header-wrapper ${hideHeader ? 'hide' : ''} ${isRoot ? 'is-main' : ''} theme-${theme}`}>
      <div className="header-content">
        <div
          className="mobile-menu-button"
          onClick={() => {
            setMobileMenuOpen(!mobileMenuOpen);
          }}
        >
          <span>
            <i className="fa-solid fa-bars" />
          </span>
        </div>
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
            <LogoIcon className="logo-icon" size="md" />
            <div>CASEBOOK</div>
          </div>
        </div>
        <div className="spacer">{isLogin && <div />}</div>
        <ProjectMenu className="project-menu" />
        {isLogin && <MainMenu className="static-menu" />}
        <SideControl />
      </div>
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <ProjectMenu
            closeMobileMenu={() => {
              setMobileMenuOpen(false);
            }}
          />
          <MainMenu
            closeMobileMenu={() => {
              setMobileMenuOpen(false);
            }}
          />
          {isLogin && (
            <ul className="user-menu-list">
              <li>
                <Link
                  to="/users/my"
                  onClick={e => {
                    e.stopPropagation();
                    setMobileMenuOpen(false);
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
          )}
          {!isLogin && (
            <ul className="user-menu-list">
              <li>
                <Link
                  to="/users/login"
                  onClick={() => {
                    setMobileMenuOpen(false);
                  }}
                >
                  {t('로그인')}
                </Link>
              </li>
              <li>
                <Link
                  className="join-link"
                  to="/users/join"
                  onClick={() => {
                    setMobileMenuOpen(false);
                  }}
                >
                  {t('회원 가입')}
                </Link>
              </li>
            </ul>
          )}
          <div className="mobile-other-menu">
            <SideControl />
          </div>
        </div>
      )}
    </header>
  );
}

Header.defaultProps = {
  className: '',
};

Header.propTypes = {
  className: PropTypes.string,
};

export default observer(Header);
