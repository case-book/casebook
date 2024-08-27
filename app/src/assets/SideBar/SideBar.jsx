import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import SpaceService from '@/services/SpaceService';
import useStores from '@/hooks/useStores';
import { useLocation, useNavigate } from 'react-router-dom';
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
    contextStore: { space, setSpace, collapsed, setCollapsed, refreshProjectTime },
    userStore: { isLogin },
    socketStore: { addTopic, removeTopic, addMessageHandler, removeMessageHandler, socketClient },
  } = useStores();

  const navigate = useNavigate();

  const [spaces, setSpaces] = useState([]);
  const [projects, setProjects] = useState([]);

  const location = useLocation();

  const getUrlSpaceCode = () => {
    let nextSpaceCode = null;
    if (/^\/spaces\/.*$/.test(location.pathname)) {
      const [, , code] = location.pathname.split('/');
      nextSpaceCode = code || null;
    }

    return nextSpaceCode;
  };

  const getMySpaceList = () => {
    const storedSpaceCode = localStorage.getItem('spaceCode');
    const urlSpaceCode = getUrlSpaceCode();

    SpaceService.selectMySpaceList(
      null,
      list => {
        setSpaces(list);
        const spaceCode = urlSpaceCode || storedSpaceCode;
        if (list.length > 0 && list.find(d => d.code === spaceCode)) {
          setSpace(list.find(d => d.code === spaceCode));
        } else if (list.length > 0) {
          setSpace(list[0]);
          localStorage.setItem('spaceCode', list[0].code);
        }
      },
      null,
    );
  };

  useEffect(() => {
    const lastCollapsed = localStorage.getItem('collapsed');
    if (lastCollapsed) {
      setCollapsed(lastCollapsed === 'true');
    }
    getMySpaceList();
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

  return (
    <nav className={classNames('side-bar-wrapper', { collapsed })}>
      {!collapsed && (
        <div className="size-bar-logo">
          <Logo
            size="sm"
            color="white"
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
          <SpaceInfo spaces={spaces} />
          <ProjectInfo projects={projects} onRefresh={getProjectList} />
          <ProjectMenu projects={projects} />
        </>
      )}
      <div className="side-bar-bottom">
        <UserHeaderControl />
      </div>
    </nav>
  );
}

export default observer(SideBar);
