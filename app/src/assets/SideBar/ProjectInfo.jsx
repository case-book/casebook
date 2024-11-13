import React, { useState } from 'react';
import { observer } from 'mobx-react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import useStores from '@/hooks/useStores';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SideOverlayMenu from '@/assets/SideBar/SideOverlayMenu/SideOverlayMenu';
import { ProjectPropTypes } from '@/proptypes';
import useMenu from '@/hooks/useMenu';
import './ProjectInfo.scss';
import SideLabel from '@/assets/SideBar/SideLabel';
import SideMenuItem from '@/assets/SideBar/SideMenuItem';

function ProjectInfo({ className, projects, onRefresh }) {
  const {
    contextStore: { space, collapsed, projectId, setHoverMenu },
  } = useStores();

  const { t } = useTranslation();

  const [projectListOpened, setProjectListOpened] = useState(true);
  const navigate = useNavigate();

  const { menu, submenu } = useMenu();

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
        <SideLabel
          label="PROJECTS"
          onListClick={() => navigate(`/spaces/${space?.code}/projects/`)}
          onAddClick={() => navigate(`/spaces/${space?.code}/projects/new`)}
          onBulletClick={() => setProjectListOpened(!projectListOpened)}
          bulletArrowUp={projectListOpened}
          onRefreshClick={onRefresh}
        />

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
        {projects.map(project => {
          return (
            <SideMenuItem
              type="tree"
              text={project.name}
              selected={projectId === project.id}
              onClick={e => {
                e.preventDefault();
                if (!menu) {
                  navigate(`/spaces/${space.code}/projects/${project.id}/testcases`);
                } else if (menu.project) {
                  navigate(`/spaces/${space.code}/projects/${project.id}${menu.to || ''}${submenu?.to || ''}`);
                } else {
                  navigate(`/spaces/${space.code}/projects/${project.id}/testcases`);
                }
              }}
              badge={project.testrunCount}
            />
          );
        })}
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
