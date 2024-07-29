import React from 'react';
import { observer } from 'mobx-react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import './SpaceInfo.scss';
import useStores from '@/hooks/useStores';
import { SpacePropTypes } from '@/proptypes';

function SpaceInfo({ className, spaces }) {
  const {
    userStore: { user },
    contextStore: { space, collapsed },
  } = useStores();

  console.log(spaces);

  return (
    <div className={classNames('space-info-wrapper', className)}>
      <div>
        <div className="space-icon">
          <span>{space?.name && space?.name[0]}</span>
        </div>
      </div>
      {!collapsed && (
        <div className="space-and-user-info">
          <div className="space-info">
            <span className="space-name">{space?.name}</span>
            <span className="bullet">
              <i className="fa-solid fa-angle-down" />
            </span>
          </div>
          <div className="user-info">{user.email}</div>
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
