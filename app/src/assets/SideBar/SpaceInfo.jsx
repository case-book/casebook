import React, { useState } from 'react';
import { observer } from 'mobx-react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import useStores from '@/hooks/useStores';
import { SpacePropTypes } from '@/proptypes';
import { useNavigate } from 'react-router-dom';
import SelectSpacePopup from '@/assets/SideBar/SelectSpacePopup/SelectSpacePopup';
import './SpaceInfo.scss';

function SpaceInfo({ className, spaces }) {
  const {
    contextStore: { space, collapsed },
  } = useStores();

  const navigate = useNavigate();
  const [spaceSelectorOpened, setSpaceSelectorOpened] = useState(false);

  return (
    <div className={classNames('space-info-wrapper', className)}>
      <div className="label">
        <div>SPACE</div>
        <div>
          <button
            type="button"
            onClick={() => {
              navigate('/spaces/search');
            }}
          >
            <i className="fa-solid fa-magnifying-glass" />
          </button>
          <button
            type="button"
            onClick={() => {
              navigate('/spaces/new');
            }}
          >
            <i className="fa-solid fa-plus" />
          </button>
        </div>
      </div>
      {!collapsed && (
        <div className="space-info">
          <button
            className="space-selector-button"
            type="button"
            onClick={() => {
              setSpaceSelectorOpened(!spaceSelectorOpened);
            }}
          >
            <i className="fa-solid fa-arrow-right-arrow-left" />
          </button>
          <span className="space-name">
            <span onClick={() => navigate(`/spaces/${space.code}/info`)}>{space?.name}</span>
          </span>
        </div>
      )}
      {spaceSelectorOpened && <SelectSpacePopup spaces={spaces} setOpened={opened => setSpaceSelectorOpened(opened)} />}
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
