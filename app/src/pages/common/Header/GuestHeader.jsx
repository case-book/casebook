import React from 'react';
import { observer } from 'mobx-react';
import useStores from '@/hooks/useStores';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import './GuestHeader.scss';
import { Liner, Logo } from '@/components';
import { THEMES } from '@/constants/constants';
import UserHeaderControl from '@/pages/common/Header/UserHeaderControl';

function GuestHeader({ className }) {
  const {
    userStore: { isLogin },
    themeStore: { theme, setTheme },
  } = useStores();

  const navigate = useNavigate();
  const location = useLocation();

  const { t } = useTranslation();

  return (
    <header className={`${className} g-no-select guest-header-wrapper theme-${theme}`}>
      <div className="header-content">
        <div className="left">
          <div className="theme-selector">
            <span
              className={theme === THEMES.LIGHT ? 'selected' : ''}
              onClick={() => {
                setTheme(THEMES.LIGHT);
              }}
            >
              <i className="fa-solid fa-lightbulb" /> LIGHT
            </span>
            <span
              className={theme === THEMES.DARK ? 'selected' : ''}
              onClick={() => {
                setTheme(THEMES.DARK);
              }}
            >
              <i className="fa-solid fa-moon" /> DARK
            </span>
          </div>
        </div>
        <div className="center">
          <Logo
            className="logo"
            onClick={() => {
              navigate('/');
            }}
          />
        </div>
        <div className="right">
          <UserHeaderControl className="user-header-control" />
          {!isLogin && location.pathname.indexOf('/links/') !== 0 && (
            <>
              <Link to="/users/login">
                <span>
                  {t('로그인')} <i className="fa-solid fa-circle-right" />
                </span>
              </Link>
              <Liner className="liner" display="inline-block" width="1px" height="10px" color={theme === THEMES.LIGHT ? 'gray' : 'white'} margin="0 6px 0 7px" />
              <Link className="join-link" to="/users/join">
                <span>
                  {t('회원 가입')} <i className="fa-solid fa-circle-right" />
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

GuestHeader.defaultProps = {
  className: '',
};

GuestHeader.propTypes = {
  className: PropTypes.string,
};

export default observer(GuestHeader);
