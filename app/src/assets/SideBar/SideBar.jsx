import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import SpaceService from '@/services/SpaceService';
import useStores from '@/hooks/useStores';
import { useNavigate } from 'react-router-dom';
import SpaceInfo from '@/assets/SideBar/SpaceInfo';
import ProjectMenu from '@/pages/common/Header/ProjectMenu';
import { Logo } from '@/components';
import UserHeaderControl from '@/pages/common/Header/UserHeaderControl';
import ProjectInfo from '@/assets/SideBar/ProjectInfo';
import ProjectService from '@/services/ProjectService';
import './SideBar.scss';

function SideBar() {
  const {
    contextStore: { space, setSpace, collapsed, setCollapsed, refreshProjectTime },
  } = useStores();

  const navigate = useNavigate();

  const [spaces, setSpaces] = useState([]);
  const [projects, setProjects] = useState([]);

  const getMySpaceList = () => {
    const spaceCode = localStorage.getItem('spaceCode');
    SpaceService.selectMySpaceList(
      null,
      list => {
        setSpaces(list);
        if (list.length > 0 && list.find(d => d.spaceCode === spaceCode)) {
          setSpace(list.find(d => d.spaceCode === spaceCode));
        } else if (list.length > 0) {
          setSpace(list[0]);
          localStorage.setItem('spaceCode', list[0].spaceCode);
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
    document.body.classList.add('side-bar-ready');
    if (collapsed) {
      document.body.classList.add('collapsed');
    } else {
      document.body.classList.remove('collapsed');
    }
  }, [collapsed]);

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
      <SpaceInfo spaces={spaces} />
      <ProjectInfo projects={projects} onRefresh={getProjectList} />
      <ProjectMenu projects={projects} />
      <div className="side-bar-bottom">
        <UserHeaderControl />
      </div>
    </nav>
  );
}

export default observer(SideBar);
