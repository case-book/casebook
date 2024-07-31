import React, { useState } from 'react';
import { observer } from 'mobx-react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import useStores from '@/hooks/useStores';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ProjectInfo.scss';
import SideOverlayMenu from '@/assets/SideBar/SideOverlayMenu/SideOverlayMenu';
import { ProjectPropTypes } from '@/proptypes';

function ProjectInfo({ className, projects }) {
  const {
    contextStore: { space, collapsed, projectId, setHoverMenu },
  } = useStores();

  const { t } = useTranslation();

  const [projectListOpened, setProjectListOpened] = useState(true);

  return (
    <div className={classNames('project-info-wrapper', className, { collapsed })}>
      <div
        className="project-menu"
        onMouseEnter={() => {
          setHoverMenu(t('메뉴.프로젝트'));
        }}
        onMouseLeave={() => {
          setHoverMenu(null);
        }}
      >
        <Link to={`/spaces/${space?.code}/projects/`}>
          <div className="menu-icon">
            <i className="fa-solid fa-book" />
          </div>
          <div className="text">{t('메뉴.프로젝트')}</div>
          {!collapsed && (
            <div className="open-list">
              <span
                className="bullet"
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  setProjectListOpened(!projectListOpened);
                }}
              >
                {!projectListOpened && <i className="fa-solid fa-angle-down" />}
                {projectListOpened && <i className="fa-solid fa-angle-up" />}
              </span>
            </div>
          )}
        </Link>
        {collapsed && (
          <SideOverlayMenu className="collapsed-project-list">
            <ul>
              {projects?.map(project => {
                return (
                  <li
                    key={project.id}
                    className={classNames({ selected: projectId === project.id })}
                    onMouseEnter={() => {
                      setHoverMenu(project.name);
                    }}
                    onMouseLeave={() => {
                      setHoverMenu(null);
                    }}
                  >
                    <Link to={`/spaces/${space.code}/projects/${project.id}`}>
                      <div className="text">{project.name}</div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </SideOverlayMenu>
        )}
      </div>
      <div className={classNames('project-list', { opened: projectListOpened })}>
        <ul>
          {projects.map(project => {
            return (
              <li
                key={project.id}
                className={classNames({ selected: projectId === project.id })}
                onMouseEnter={() => {
                  setHoverMenu(project.name);
                }}
                onMouseLeave={() => {
                  setHoverMenu(null);
                }}
              >
                <Link to={`/spaces/${space.code}/projects/${project.id}`}>
                  <div className="dot">
                    <div />
                  </div>
                  {project.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

ProjectInfo.defaultProps = {
  className: '',
  projects: [],
};

ProjectInfo.propTypes = {
  className: PropTypes.string,
  projects: PropTypes.arrayOf(ProjectPropTypes),
};

export default observer(ProjectInfo);
