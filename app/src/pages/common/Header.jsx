import React, { useState } from 'react';
import { observer } from 'mobx-react';
import useStores from '@/hooks/useStores';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserService from '@/services/UserService';
import { Button, Liner, Logo } from '@/components';
import { MENUS } from '@/constants/menu';
import './Header.scss';
import { setOption } from '@/utils/storageUtil';
import { useTranslation } from 'react-i18next';

function Header({ className, theme }) {
  const {
    userStore: { isLogin, setUser },
    controlStore: { hideHeader, setMobileMenuOpen },
  } = useStores();

  const navigate = useNavigate();

  const location = useLocation();

  const { t } = useTranslation();

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const logout = e => {
    e.preventDefault();
    e.stopPropagation();
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setOption('user', 'info', 'uuid', '');
    UserService.logout(
      info => {
        setUser({
          ...info,
          id: null,
          uuid: null,
          roleCode: null,
          email: null,
          name: null,
        });

        navigate('/');
      },
      () => {
        setUser({
          id: null,
          uuid: null,
          roleCode: null,
          email: null,
          name: null,
        });

        navigate('/');
      },
    );
  };

  console.log(userMenuOpen, logout);

  return (
    <header className={`${className} header-wrapper ${hideHeader ? 'hide' : ''} ${location.pathname === '/' ? 'is-main' : ''} theme-${theme}`}>
      <div>
        <div className="logo">
          <Logo
            animate
            onClick={() => {
              navigate('/');
            }}
          />
        </div>
        <div className="spacer" />
        <div className="menu">
          <div>
            <ul>
              {MENUS.filter(d => d.pc)
                .filter(d => !d.admin)
                .filter(d => d.login === undefined || d.login === isLogin)
                .map((d, inx, row) => {
                  return (
                    <React.Fragment key={inx}>
                      <li
                        className={location.pathname === d.to ? 'selected' : ''}
                        style={{
                          animationDelay: `${inx * 0.1}s`,
                        }}
                      >
                        <Link
                          to={d.to}
                          onClick={() => {
                            setMobileMenuOpen(false);
                          }}
                        >
                          <div>
                            <div className="icon">
                              <span>{d.icon}</span>
                            </div>
                            <div className="text">{d.name}</div>
                          </div>
                        </Link>
                        <div className="cursor">
                          <div />
                        </div>
                      </li>
                      {inx + 1 !== row.length && (
                        <li
                          className="separator"
                          style={{
                            animationDelay: `${inx * 0.1}s`,
                          }}
                        >
                          <Liner display="inline-block" width="1px" height="10px" color={theme === 'white' ? 'black' : 'white'} margin="0 10px" />
                        </li>
                      )}
                    </React.Fragment>
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
        </div>
      </div>
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
