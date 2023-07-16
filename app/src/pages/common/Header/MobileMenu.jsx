import React from 'react';
import { observer } from 'mobx-react';
import useStores from '@/hooks/useStores';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MENUS } from '@/constants/menu';
import { useTranslation } from 'react-i18next';
import './MobileMenu.scss';
import { CloseIcon, Liner, Logo } from '@/components';
import { setToken } from '@/utils/request';
import { setOption } from '@/utils/storageUtil';
import UserService from '@/services/UserService';

function MobileMenu({ className, setOpen }) {
  const {
    userStore: { isLogin, setUser },
    contextStore: { spaceCode, projectId, isProjectSelected },
  } = useStores();

  const location = useLocation();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const logout = e => {
    e.preventDefault();
    e.stopPropagation();
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

  const list = MENUS.filter(d => d.pc)
    .filter(d => d.project === isProjectSelected)
    .filter(d => !d.admin)
    .filter(d => d.login === undefined || d.login === isLogin);

  return (
    <div className={`mobile-menu-wrapper ${className}`}>
      <div className="close-button">
        <CloseIcon
          onClick={() => {
            setOpen(false);
          }}
        />
      </div>
      <div className="menu-layout">
        <div className="logo">
          <Logo animation={false} />
        </div>
        <div className="menu-content">
          <ul>
            {list.map((d, inx) => {
              let isSelected = false;
              if (d.project) {
                isSelected = location.pathname === `/spaces/${spaceCode}/projects/${projectId}${d.to}`;
              }

              if (!isSelected && d.selectedAlias) {
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
                  <Link
                    to={d.project ? `/spaces/${spaceCode}/projects/${projectId}${d.to}` : d.to}
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <span className="text">
                      {t(`메뉴.${d.name}`)}
                      <span />
                    </span>
                  </Link>
                  {d.list && (
                    <ul className="sub-menu">
                      {d.list?.map(info => {
                        return (
                          <li key={info.key}>
                            <Link
                              to={d.project ? `/spaces/${spaceCode}/projects/${projectId}${d.to}${info.to}` : d.to}
                              onClick={() => {
                                setOpen(false);
                              }}
                            >
                              {info.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="others">
          <Link
            to="/users/my"
            onClick={e => {
              e.stopPropagation();
              setOpen(false);
            }}
          >
            {t('내 정보')}
          </Link>
          <Liner width="1px" height="10px" display="inline-block" color="gray" margin="0 10px" />
          <Link to="/" onClick={logout}>
            {t('로그아웃')}
          </Link>
        </div>
      </div>
    </div>
  );
}

MobileMenu.defaultProps = {
  className: '',
};

MobileMenu.propTypes = {
  className: PropTypes.string,
  setOpen: PropTypes.func.isRequired,
};

export default observer(MobileMenu);
