import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import useStores from '@/hooks/useStores';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MENUS } from '@/constants/menu';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import ReactTooltip from 'react-tooltip';
import { ProjectPropTypes } from '@/proptypes';
import useMenu from '@/hooks/useMenu';
import SideBarMiniButton from '@/assets/SideBar/SideBarMiniButton';
import SelectProjectPopup from '@/assets/SideBar/SelectProjectPopup/SelectProjectPopup';
import SideOverlayMenu from '@/assets/SideBar/SideOverlayMenu/SideOverlayMenu';
import './ProjectMenu.scss';

function ProjectMenu({ className, projects }) {
  const {
    userStore: {
      isLogin,
      user: { activeSystemRole },
    },
    contextStore: { spaceCode, projectId, isProjectSelected, collapsed, hoverMenu, setHoverMenu },
  } = useStores();
  const { menu } = useMenu();
  const location = useLocation();
  const navigate = useNavigate();

  const [projectSelector, setProjectSelector] = useState(null);
  const [subMenuOpened, setSubMenuOpened] = useState({});

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [subMenuOpened, collapsed]);

  const { t } = useTranslation();

  const list = MENUS.filter(d => d.pc)
    .filter(d => {
      if (d.admin) {
        return activeSystemRole === 'ROLE_ADMIN';
      }
      return true;
    })
    .filter(d => d.login === undefined || d.login === isLogin);

  const onMenuClick = (d, e) => {
    e.preventDefault();

    if (d.project) {
      if (!projectId) {
        setProjectSelector(`/spaces/${spaceCode}/projects/{{PROJECT_ID}}${d.to}`);
        return;
      }
      navigate(`/spaces/${spaceCode}/projects/${projectId}${d.to}`);
    } else {
      navigate(d.to);
    }
  };

  const onSubMenuClick = (d, subMenu, e) => {
    e.preventDefault();
    if (d.project) {
      if (!projectId) {
        setProjectSelector(`/spaces/${spaceCode}/projects/{{PROJECT_ID}}${d.to}${subMenu.to}`);
        return;
      }

      navigate(`/spaces/${spaceCode}/projects/${projectId}${d.to}${subMenu.to}`);
    } else {
      navigate(`${d.to}${subMenu.to}`);
    }
  };

  const onMenuMouseEnter = d => {
    setHoverMenu(t(`메뉴.${d.name}`));
  };

  const onMenuMouseLeave = () => {
    setHoverMenu(null);
  };

  return (
    <div className={classNames('project-menu-wrapper', className, { collapsed }, { 'project-selected': isProjectSelected })}>
      <div className="label">MENU</div>
      <ul>
        <li>
          <Link to={`/spaces/${spaceCode}/dashboard`}>
            <div
              className="menu-icon"
              data-tip={t('메뉴.대시보드')}
              style={{
                backgroundColor: location.pathname === `/spaces/${spaceCode}/dashboard` ? 'var(--primary-color)' : '',
                color: location.pathname === `/spaces/${spaceCode}/dashboard` ? 'var(--primary-text-color)' : '',
              }}
            >
              <span>
                <i className="fa-solid fa-gauge" />
              </span>
            </div>
            <div className="text">{t('메뉴.대시보드')}</div>
          </Link>
          <div className="separator" />
        </li>
        {list.map((d, inx) => {
          let selected = d?.key === menu?.key;
          if (d?.key === 'admin') {
            selected = location.pathname.startsWith('/admin');
          }

          return (
            <li
              key={inx}
              className={classNames({ selected })}
              style={{
                animationDelay: `${inx * 0.05}s`,
              }}
            >
              {d.separator && <div className="separator" />}
              {!d.separator && (
                <>
                  <Link
                    to={d.project ? `/spaces/${spaceCode}/projects/${projectId}${d.to}` : d.to}
                    onClick={e => onMenuClick(d, e)}
                    onMouseEnter={() => onMenuMouseEnter(d)}
                    onMouseLeave={() => onMenuMouseLeave()}
                  >
                    <div
                      className="menu-icon"
                      data-tip={t(`메뉴.${d.name}`)}
                      style={{
                        backgroundColor: selected ? 'var(--primary-color)' : '',
                        color: selected ? 'var(--primary-text-color)' : '',
                      }}
                    >
                      <span>{d.icon}</span>
                    </div>
                    <div className="text">
                      {t(`메뉴.${d.name}`)}
                      <span />
                    </div>
                    {!collapsed && d.list && (
                      <div className="sub-menu-open-button" onClick={e => e.stopPropagation()}>
                        <SideBarMiniButton
                          shadow={false}
                          onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setSubMenuOpened(prev => {
                              const next = { ...prev };
                              next[d.key] = !next[d.key];
                              return next;
                            });
                          }}
                        >
                          {subMenuOpened[d?.key] && <i className="fa-solid fa-chevron-up" />}
                          {!subMenuOpened[d?.key] && <i className="fa-solid fa-chevron-down" />}
                        </SideBarMiniButton>
                      </div>
                    )}
                  </Link>
                  {collapsed && d.list && (
                    <SideOverlayMenu className="sub-menu">
                      <ul>
                        {d.list?.map(info => {
                          const selectedSub = `/spaces/${spaceCode}/projects/${projectId}${d.to}${info.to}` === location.pathname || `${d.to}${info.to}` === location.pathname;
                          return (
                            <li key={info.key} className={classNames({ selected: selectedSub })}>
                              <Link
                                to={d.project ? `/spaces/${spaceCode}/projects/${projectId}${d.to}${info.to}` : `${d.to}${info.to}`}
                                onClick={e => onSubMenuClick(d, info, e)}
                                onMouseEnter={() => onMenuMouseEnter(info)}
                                onMouseLeave={() => onMenuMouseLeave()}
                              >
                                <div className="menu-icon" data-tip={info.name} data-place="right">
                                  {info.icon}
                                </div>
                                <div className="text">{info.name}</div>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </SideOverlayMenu>
                  )}
                  {!collapsed && d.list && subMenuOpened[d?.key] && (
                    <ul className="sub-menu">
                      {d.list?.map(info => {
                        const selectedSub = `/spaces/${spaceCode}/projects/${projectId}${d.to}${info.to}` === location.pathname || `${d.to}${info.to}` === location.pathname;

                        return (
                          <li key={info.key} className={classNames({ selected: selectedSub })}>
                            <Link
                              to={d.project ? `/spaces/${spaceCode}/projects/${projectId}${d.to}${info.to}` : `${d.to}${info.to}`}
                              onClick={e => {
                                onSubMenuClick(d, info, e);
                              }}
                              onMouseEnter={() => onMenuMouseEnter(info)}
                              onMouseLeave={() => onMenuMouseLeave()}
                            >
                              <div
                                className="menu-icon"
                                data-tip={info.name}
                                style={{
                                  backgroundColor: selectedSub ? 'var(--primary-color)' : '',
                                  color: selectedSub ? 'var(--primary-text-color)' : '',
                                }}
                              >
                                <span>{info.icon}</span>
                              </div>
                              <div className="text">{info.name}</div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </>
              )}
            </li>
          );
        })}
        {hoverMenu && <div className="hover-menu">{hoverMenu}</div>}
        {projectSelector && <SelectProjectPopup projects={projects} setOpened={() => setProjectSelector(null)} moveTo={projectSelector} onSelect={() => setProjectSelector(null)} />}
      </ul>
    </div>
  );
}

ProjectMenu.defaultProps = {
  className: '',
  projects: [],
};

ProjectMenu.propTypes = {
  className: PropTypes.string,
  projects: PropTypes.arrayOf(ProjectPropTypes),
};

export default observer(ProjectMenu);
