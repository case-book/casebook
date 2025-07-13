import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import useStores from '@/hooks/useStores';
import { useNavigate } from 'react-router-dom';
import SpaceInfo from '@/assets/SideBar/SpaceInfo';
import ProjectMenu from '@/pages/common/Header/ProjectMenu';
import { Logo } from '@/components';
import UserHeaderControl from '@/pages/common/Header/UserHeaderControl';
import ProjectInfo from '@/assets/SideBar/ProjectInfo';
import ProjectService from '@/services/ProjectService';
import SpaceMenu from '@/pages/common/Header/SpaceMenu';
import './SideBar.scss';

function SideBar() {
  const {
    contextStore: { space, collapsed, setCollapsed, refreshProjectTime },
    userStore: {
      isLogin,
      user: { spaces },
    },
    socketStore: { addTopic, removeTopic, addMessageHandler, removeMessageHandler, socketClient },
  } = useStores();

  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const lastCollapsed = localStorage.getItem('collapsed');
    if (lastCollapsed) {
      setCollapsed(lastCollapsed === 'true');
    }
  }, []);

  const onMessage = info => {
    const { data } = info;

    switch (data.type) {
      case 'PROJECT-TESTRUN-OPENED-COUNT-CHANGED': {
        const nextProjects = projects.slice(0);
        const project = nextProjects.find(d => d.id === data.data.projectId);
        if (project) {
          project.testrunCount = data.data.openedTestrunCount;
          setProjects(nextProjects);
        }
        break;
      }

      default: {
        break;
      }
    }
  };

  useEffect(() => {
    if (space?.code) {
      addTopic(`/sub/spaces/${space?.code}`);
      addMessageHandler('SideBar', onMessage);
    }

    return () => {
      removeTopic(`/sub/spaces/${space?.code}`);
      removeMessageHandler('SideBar');
    };
  }, [space?.code, socketClient, projects]);

  const getProjectList = useCallback(() => {
    ProjectService.selectMyProjectList(space?.code, list => {
      setProjects(list);
    });
  }, [space?.code]);

  useEffect(() => {
    if (space?.code || refreshProjectTime) {
      getProjectList();
    }
  }, [space, refreshProjectTime]);

  useEffect(() => {
    if (!isLogin) {
      document.body.classList.remove('side-bar-ready');
    } else {
      document.body.classList.add('side-bar-ready');
      if (collapsed) {
        document.body.classList.add('collapsed');
      } else {
        document.body.classList.remove('collapsed');
      }
    }

    return () => {
      document.body.classList.remove('side-bar-ready');
    };
  }, [collapsed, isLogin]);

  const onCollapseClick = useCallback(() => {
    setCollapsed(!collapsed);
    localStorage.setItem('collapsed', !collapsed);
  }, [collapsed, setCollapsed]);

  return (
    <nav className={classNames('side-bar-wrapper', { collapsed })}>
      <div>
        <div className="side-bar-controls">
          {!collapsed && (
            <button type="button" className="min" onClick={onCollapseClick}>
              <i className="fa-solid fa-minus" />
            </button>
          )}
          <button type="button" className="max" onClick={onCollapseClick}>
            <i className="fa-regular fa-window-maximize" />
          </button>
        </div>
        {!collapsed && (
          <div className="size-bar-logo">
            <Logo
              size="sm"
              hand={false}
              onClick={() => {
                navigate('/');
              }}
            />
          </div>
        )}
        {!space && <SpaceMenu projects={projects} />}
        {space && (
          <>
            <ProjectInfo projects={projects} onRefresh={getProjectList} />
            <ProjectMenu projects={projects} />
          </>
        )}
        <div className="side-bar-bottom">
          <UserHeaderControl />
        </div>
        {space && (
          <div className="space-info-content">
            <SpaceInfo spaces={spaces} />
          </div>
        )}
      </div>
    </nav>
  );
}

export default observer(SideBar);
