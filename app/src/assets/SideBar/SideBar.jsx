import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import SpaceService from '@/services/SpaceService';
import useStores from '@/hooks/useStores';
import './SideBar.scss';
import SpaceInfo from '@/assets/SideBar/SpaceInfo';

function SideBar() {
  const {
    contextStore: { setSpace, collapsed, setCollapsed },
  } = useStores();

  const [spaces, setSpaces] = useState([]);
  const [currentSpace, setCurrentSpace] = useState(null);
  const getMySpaceList = () => {
    const spaceCode = localStorage.getItem('spaceCode');
    SpaceService.selectMySpaceList(
      null,
      list => {
        setSpaces(list);
        if (list.length > 0 && list.find(d => d.spaceCode === spaceCode)) {
          setCurrentSpace(list.find(d => d.spaceCode === spaceCode));
        } else if (list.length > 0) {
          setCurrentSpace(list[0]);
          localStorage.setItem('spaceCode', list[0].spaceCode);
        }
      },
      null,
    );
  };

  useEffect(() => {
    getMySpaceList();
  }, []);

  useEffect(() => {
    if (currentSpace) {
      setSpace(currentSpace);
    }
  }, [currentSpace]);

  useEffect(() => {
    if (collapsed) {
      document.body.classList.add('collapsed');
    } else {
      document.body.classList.remove('collapsed');
    }
  }, [collapsed]);

  console.log(spaces);

  return (
    <nav className={classNames('side-bar-wrapper', { collapsed })}>
      {currentSpace && <SpaceInfo space={currentSpace} />}
      <div className="collapse">
        <button
          onClick={() => {
            setCollapsed(!collapsed);
          }}
        >
          {collapsed && <i className="fa-solid fa-angle-right" />}
          {!collapsed && <i className="fa-solid fa-angle-left" />}
        </button>
      </div>
    </nav>
  );
}

export default observer(SideBar);
