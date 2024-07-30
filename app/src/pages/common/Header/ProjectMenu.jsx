import React from 'react';
import { observer } from 'mobx-react';
import useStores from '@/hooks/useStores';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { MENUS } from '@/constants/menu';
import { useTranslation } from 'react-i18next';

import './ProjectMenu.scss';
import classNames from 'classnames';
import SideOverlayMenu from '@/assets/SideBar/SideOverlayMenu/SideOverlayMenu';

function ProjectMenu({ className, closeMobileMenu }) {
  const {
    userStore: {
      isLogin,
      user: { activeSystemRole },
    },
    contextStore: { spaceCode, projectId, isProjectSelected, collapsed, hoverMenu, setHoverMenu },
  } = useStores();

  console.log(spaceCode, projectId, activeSystemRole);

  console.log(hoverMenu);

  const location = useLocation();

  const { t } = useTranslation();

  const list = MENUS.filter(d => d.pc)
    .filter(d => {
      if (d.admin) {
        return activeSystemRole === 'ROLE_ADMIN';
      }
      return true;
    })
    .filter(d => d.login === undefined || d.login === isLogin);

  return (
    <ul className={classNames('project-menu-wrapper', className, { collapsed }, { 'project-selected': isProjectSelected })}>
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
                if (closeMobileMenu) {
                  closeMobileMenu();
                }
              }}
              onMouseEnter={() => {
                setHoverMenu(t(`메뉴.${d.name}`));
              }}
              onMouseLeave={() => {
                setHoverMenu(null);
              }}
            >
              <div className="menu-icon">{d.icon}</div>
              <div className="text">
                {t(`메뉴.${d.name}`)}
                <span />
              </div>
            </Link>
            {d.list && (
              <SideOverlayMenu className="sub-menu">
                <ul>
                  {d.list?.map(info => {
                    return (
                      <li key={info.key}>
                        <Link
                          to={d.project ? `/spaces/${spaceCode}/projects/${projectId}${d.to}${info.to}` : `${d.to}${info.to}`}
                          onClick={() => {
                            if (closeMobileMenu) {
                              closeMobileMenu();
                            }
                          }}
                          onMouseEnter={() => {
                            setHoverMenu(info.name);
                          }}
                          onMouseLeave={() => {
                            setHoverMenu(null);
                          }}
                        >
                          <div className="menu-icon">{info.icon}</div>
                          <div className="text">{info.name}</div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </SideOverlayMenu>
            )}
          </li>
        );
      })}
      {hoverMenu && <div className="hover-menu">{hoverMenu}</div>}
    </ul>
  );
}

ProjectMenu.defaultProps = {
  className: '',
  closeMobileMenu: null,
};

ProjectMenu.propTypes = {
  className: PropTypes.string,
  closeMobileMenu: PropTypes.func,
};

export default observer(ProjectMenu);
