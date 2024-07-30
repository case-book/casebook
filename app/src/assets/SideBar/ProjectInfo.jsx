import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import useStores from '@/hooks/useStores';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ProjectInfo.scss';
import ProjectService from '@/services/ProjectService';

function ProjectInfo({ className }) {
  const {
    contextStore: { space, collapsed, projectId, setHoverMenu },
  } = useStores();

  const { t } = useTranslation();

  const [projects, setProjects] = useState([]);
  const [projectListOpened, setProjectListOpened] = useState(true);

  useEffect(() => {
    if (space?.code) {
      ProjectService.selectMyProjectList(space?.code, list => {
        setProjects(list);
      });
    }
  }, [space]);

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
          <ul className="collapsed-project-list">
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
};

ProjectInfo.propTypes = {
  className: PropTypes.string,
};

export default observer(ProjectInfo);
