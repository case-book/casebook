import React, { useMemo } from 'react';
import { observer } from 'mobx-react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import useStores from '@/hooks/useStores';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProjectPropTypes } from '@/proptypes';
import useMenu from '@/hooks/useMenu';
import './ProjectInfo.scss';
import SideBarMiniButton from '@/assets/SideBar/SideBarMiniButton';

function ProjectInfo({ className, projects, onRefresh }) {
  const {
    contextStore: { space, collapsed, projectId, setHoverMenu },
  } = useStores();

  const { t } = useTranslation();

  const navigate = useNavigate();

  const { menu, submenu } = useMenu();

  const project = useMemo(() => {
    return projects?.find(p => p.id === projectId);
  }, [projectId, projects]);

  return (
    <div className={classNames('project-info-wrapper', className, { collapsed, expanded: !collapsed })}>
      <div className="label">
        {collapsed && <div>PRJ</div>}
        {!collapsed && <div>PROJECT</div>}
        {!collapsed && (
          <div>
            <SideBarMiniButton
              tooltip={t('프로젝트 정보 새로고침')}
              onClick={() => {
                onRefresh();
              }}
            >
              <i className="fa-solid fa-retweet" />
            </SideBarMiniButton>
            <SideBarMiniButton
              tooltip={t('프로젝트 목록')}
              onClick={() => {
                navigate(`/spaces/${space?.code}/projects`);
              }}
            >
              <i className="fa-solid fa-list" />
            </SideBarMiniButton>
            <SideBarMiniButton
              tooltip={t('새 프로젝트')}
              onClick={() => {
                navigate(`/spaces/${space?.code}/projects/new`);
              }}
            >
              <i className="fa-solid fa-plus" />
            </SideBarMiniButton>
          </div>
        )}
      </div>
      <div
        className="project-selector"
        onClick={() => {
          if (collapsed) {
            navigate(`/spaces/${space?.code}/projects`);
          }
        }}
      >
        {collapsed && (
          <>
            {project?.name && <div className="project-name short-name">{project?.name?.substring(0, 4)}</div>}
            {!project?.name && <div className="project-name no-project">NO PROJECT</div>}
          </>
        )}
        {!collapsed && (
          <>
            {project?.name && <div className="project-name">{project?.name}</div>}
            {!project?.name && <div className="project-name no-project">{t('프로젝트를 선택해주세요.')}</div>}
          </>
        )}
        <div className="project-hover-list">
          {projects?.length > 0 && (
            <ul>
              {projects.map(p => {
                return (
                  <li
                    key={p.id}
                    className={classNames({ selected: projectId === p.id })}
                    onMouseEnter={() => {
                      setHoverMenu(p.name);
                    }}
                    onMouseLeave={() => {
                      setHoverMenu(null);
                    }}
                  >
                    <Link
                      to={`/spaces/${space.code}/projects/${p.id}`}
                      onClick={e => {
                        e.preventDefault();
                        if (!menu) {
                          navigate(`/spaces/${space.code}/projects/${p.id}/testcases`);
                        } else if (menu.project) {
                          navigate(`/spaces/${space.code}/projects/${p.id}${menu.to || ''}${submenu?.to || ''}`);
                        } else {
                          navigate(`/spaces/${space.code}/projects/${p.id}/testcases`);
                        }
                      }}
                    >
                      <div className="dot">
                        <div />
                      </div>
                      <span className="project-name">
                        {p.name}
                        {p.testrunCount > 0 && (
                          <span className="testrun-count">
                            <span>{p.testrunCount}</span>
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
