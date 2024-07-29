import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import SpaceService from '@/services/SpaceService';
import useStores from '@/hooks/useStores';
import './SideBar.scss';
import SpaceInfo from '@/assets/SideBar/SpaceInfo';
import ProjectService from '@/services/ProjectService';
import ProjectMenu from '@/pages/common/Header/ProjectMenu';
import { Logo } from '@/components';
import UserHeaderControl from '@/pages/common/Header/UserHeaderControl';

function SideBar() {
  const {
    contextStore: { space, setSpace, collapsed, setCollapsed },
  } = useStores();

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

  useEffect(() => {
    if (space?.code) {
      ProjectService.selectMyProjectList(space?.code, list => {
        setProjects(list);
      });
    }
  }, [space]);

  useEffect(() => {
    if (collapsed) {
      document.body.classList.add('collapsed');
    } else {
      document.body.classList.remove('collapsed');
    }
  }, [collapsed]);

  console.log(projects);

  return (
    <nav className={classNames('side-bar-wrapper', { collapsed })}>
      {!collapsed && (
        <div className="size-bar-logo">
          <Logo size="sm" color="white" hand={false} />
        </div>
      )}
      <SpaceInfo spaces={spaces} />

      <ProjectMenu />
      <div className="side-bar-bottom">
        <UserHeaderControl />
      </div>
    </nav>
  );
}

export default observer(SideBar);
