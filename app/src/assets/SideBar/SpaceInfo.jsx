import React, { useState } from 'react';
import { observer } from 'mobx-react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import useStores from '@/hooks/useStores';
import { SpacePropTypes } from '@/proptypes';
import { Link, useNavigate } from 'react-router-dom';
import SideLabel from '@/assets/SideBar/SideLabel';
import './SpaceInfo.scss';

function SpaceInfo({ className, spaces }) {
  const {
    contextStore: { space, setSpace, collapsed },
  } = useStores();

  const [spaceSelectorOpened, setSpaceSelectorOpened] = useState(false);

  const navigate = useNavigate();

  return (
    <div className={classNames('space-info-wrapper', className)}>
      <SideLabel
        label="SPACE"
        onAddClick={() => navigate('/spaces/new')}
        onListClick={() => navigate('/spaces/search?my=Y')}
        onBulletClick={() => setSpaceSelectorOpened(!spaceSelectorOpened)}
        bulletArrowUp={spaceSelectorOpened}
      />
      <div className="space-menu">
        <div>
          <div
            className={classNames('space-icon', { collapsed })}
            onClick={() => {
              navigate(`/spaces/${space.code}/info`);
            }}
          >
            <span>{space?.name && space?.name[0]}</span>
          </div>
        </div>
        {!collapsed && (
          <div className="space-info" onClick={() => navigate(`/spaces/${space.code}/info`)}>
            <span>{space?.name}</span>
          </div>
        )}
      </div>
      {spaceSelectorOpened && (
        <div
          className={classNames('space-popup-menu space-selector')}
          onClick={() => {
            setSpaceSelectorOpened(false);
          }}
        >
          <div>
            <div onClick={e => e.stopPropagation()}>
              <div className="arrow">
                <div />
              </div>
              <ul>
                {spaces.map(info => {
                  return (
                    <li key={info.code}>
                      <Link
                        className="space-selector-item"
                        to={`/spaces/${info.code}/info`}
                        onClick={e => {
                          e.stopPropagation();
                          localStorage.setItem('spaceCode', info.code);
                          setSpace(info);
                          setSpaceSelectorOpened(false);
                        }}
                      >
                        <div>
                          <div>{info.name}</div>
                          {info.code === space.code && (
                            <div>
                              <i className="fa-solid fa-check-to-slot" />
                            </div>
                          )}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

SpaceInfo.defaultProps = {
  className: '',
  spaces: [],
};

SpaceInfo.propTypes = {
  className: PropTypes.string,
  spaces: PropTypes.arrayOf(SpacePropTypes),
};

export default observer(SpaceInfo);
