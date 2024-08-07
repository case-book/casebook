import React, { useState } from 'react';
import { observer } from 'mobx-react';
import useStores from '@/hooks/useStores';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { MENUS } from '@/constants/menu';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import SideOverlayMenu from '@/assets/SideBar/SideOverlayMenu/SideOverlayMenu';
import './ProjectMenu.scss';
import { ProjectPropTypes } from '@/proptypes';
import { CloseIcon } from '@/components';
import useMenu from '@/hooks/useMenu';

function ProjectMenu({ className, projects }) {
  const {
    userStore: {
      isLogin,
      user: { activeSystemRole },
    },
    contextStore: { spaceCode, projectId, isProjectSelected, collapsed, hoverMenu, setHoverMenu },
  } = useStores();
  const { menu } = useMenu();

  const navigate = useNavigate();

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
    <ul className={classNames('project-menu-wrapper', className, { collapsed }, { 'project-selected': isProjectSelected })}>
      {list.map((d, inx) => {
        return (
          <li
            key={inx}
            className={classNames({ selected: d?.key === menu?.key })}
            style={{
              animationDelay: `${inx * 0.1}s`,
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
              </>
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
