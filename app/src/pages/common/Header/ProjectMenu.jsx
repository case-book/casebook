import React, { useState } from 'react';
import { observer } from 'mobx-react';
import useStores from '@/hooks/useStores';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MENUS } from '@/constants/menu';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import SideOverlayMenu from '@/assets/SideBar/SideOverlayMenu/SideOverlayMenu';
import './ProjectMenu.scss';
import { ProjectPropTypes } from '@/proptypes';
import { CloseIcon } from '@/components';

function ProjectMenu({ className, projects }) {
  const {
    userStore: {
      isLogin,
      user: { activeSystemRole },
    },
    contextStore: { spaceCode, projectId, isProjectSelected, collapsed, hoverMenu, setHoverMenu },
  } = useStores();

  const navigate = useNavigate();

  const location = useLocation();

  const [projectSelector, setProjectSelector] = useState(null);

  const { t } = useTranslation();

  const list = MENUS.filter(d => d.pc)
    .filter(d => {
      if (d.admin) {
        return activeSystemRole === 'ROLE_ADMIN';
      }
      return true;
    })
    .filter(d => d.login === undefined || d.login === isLogin);

  const onMenuClick = (menu, e) => {
    e.preventDefault();
    if (menu.project) {
      if (!projectId) {
        setProjectSelector(`/spaces/${spaceCode}/projects/{{PROJECT_ID}}${menu.to}`);
        return;
      }
      navigate(`/spaces/${spaceCode}/projects/${projectId}${menu.to}`);
    } else {
      navigate(menu.to);
    }
  };

  const onSubMenuClick = (menu, subMenu, e) => {
    e.preventDefault();
    if (menu.project) {
      if (!projectId) {
        setProjectSelector(`/spaces/${spaceCode}/projects/{{PROJECT_ID}}${menu.to}${subMenu.to}`);
        return;
      }

      navigate(`/spaces/${spaceCode}/projects/${projectId}${menu.to}${subMenu.to}`);
    } else {
      navigate(`${menu.to}${subMenu.to}`);
    }
  };

  const onMenuMouseEnter = menu => {
    setHoverMenu(t(`메뉴.${menu.name}`));
  };

  const onMenuMouseLeave = () => {
    setHoverMenu(null);
  };

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
              onClick={e => onMenuClick(d, e)}
              onMouseEnter={() => onMenuMouseEnter(d)}
              onMouseLeave={() => onMenuMouseLeave()}
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
                          onClick={e => onSubMenuClick(d, info, e)}
                          onMouseEnter={() => onMenuMouseEnter(info)}
                          onMouseLeave={() => onMenuMouseLeave()}
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
      {projectSelector && (
        <div className={classNames('project-selector', { collapsed })} onClick={() => setProjectSelector(null)}>
          <div>
            <div onClick={e => e.stopPropagation()}>
              <h3>
                {t('프로젝트 선택')}
                <CloseIcon className="close-button" onClick={() => setProjectSelector(null)} />
              </h3>
              <div>
                <ul>
                  {projects.map(project => {
                    return (
                      <li
                        key={project.id}
                        className={classNames({ selected: projectId === project.id })}
                        onClick={() => {
                          navigate(projectSelector.replace('{{PROJECT_ID}}', project.id));
                          setProjectSelector(null);
                        }}
                      >
                        <div>{project.name}</div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </ul>
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
