import React, { useState } from 'react';
import { observer } from 'mobx-react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import useStores from '@/hooks/useStores';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SideOverlayMenu from '@/assets/SideBar/SideOverlayMenu/SideOverlayMenu';
import { ProjectPropTypes } from '@/proptypes';
import useMenu from '@/hooks/useMenu';
import './ProjectInfo.scss';

function ProjectInfo({ className, projects, onRefresh }) {
  const {
    contextStore: { space, collapsed, projectId, setHoverMenu },
  } = useStores();

  const { t } = useTranslation();

  const [projectListOpened, setProjectListOpened] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menu = useMenu();

  return (
    <div className={classNames('project-info-wrapper', className, { collapsed })}>
      <div
        className={classNames('project-menu', { selected: menu?.key === 'projects' })}
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
            <div className="refresh">
              <span
                className="bullet"
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  onRefresh();
                }}
              >
                <i className="fa-solid fa-rotate-right" />
              </span>
            </div>
          )}
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
                    <Link to={`/spaces/${space?.code}/projects/${project.id}`}>
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
        {projects?.length === 0 && (
          <div className="create-project">
            <Link to={`/spaces/${space?.code}/projects/new`}>
              <i className="fa-solid fa-plus" />
              {t('새 프로젝트')}
            </Link>
          </div>
        )}
        {projects?.length > 0 && (
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
                  <Link
                    to={`/spaces/${space.code}/projects/${project.id}`}
                    onClick={e => {
                      e.preventDefault();
                      if (!menu) {
                        navigate(`/spaces/${space.code}/projects/${project.id}`);
                      } else if (menu.project) {
                        const pattern = /\/spaces\/[a-zA-Z0-9_]+\/projects\/\d+(?:\/([a-zA-Z0-9_]+))?/;
                        const match = location.pathname.match(pattern);
                        if (match) {
                          const path = match[1];
                          navigate(`/spaces/${space.code}/projects/${project.id}/${path || ''}`);
                        }
                      } else {
                        navigate(`/spaces/${space.code}/projects/${project.id}`);
                      }
                    }}
                  >
                    <div className="dot">
                      <div />
                    </div>
                    <span className="project-name">
                      {project.name}
                      {project.testrunCount > 0 && (
                        <span className="testrun-count">
                          <span>{project.testrunCount}</span>
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
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
  onRefresh: PropTypes.func.isRequired,
};

export default observer(ProjectInfo);
