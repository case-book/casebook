import React from 'react';
import { observer } from 'mobx-react';
import * as PropTypes from 'prop-types';
import useStores from '@/hooks/useStores';
import './SideLabel.scss';
import classNames from 'classnames';

function SpaceInfo({ className, label, onListClick, onBulletClick, bulletArrowUp, onRefreshClick, onAddClick, border }) {
  const {
    contextStore: { collapsed },
  } = useStores();

  return (
    <div className={classNames('side-label-wrapper', className, { border })}>
      {!collapsed && <div className="side-label-text">{label}</div>}
      {!collapsed && (
        <div className="control g-no-select">
          {onAddClick && (
            <div>
              <span className="icon" onClick={onAddClick}>
                <i className="fa-solid fa-plus" />
              </span>
            </div>
          )}
          {onListClick && (
            <div>
              <span className="icon" onClick={onListClick}>
                <i className="fa-regular fa-rectangle-list" />
              </span>
            </div>
          )}
          {onRefreshClick && (
            <div>
              <span className="icon" onClick={onRefreshClick}>
                <i className="fa-solid fa-rotate-right" />
              </span>
            </div>
          )}
          {onBulletClick && (
            <div>
              <span className="icon" onClick={onBulletClick}>
                {!bulletArrowUp && <i className="fa-solid fa-angle-down" />}
                {bulletArrowUp && <i className="fa-solid fa-angle-up" />}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

SpaceInfo.defaultProps = {
  className: '',
  label: null,
  onAddClick: null,
  onListClick: null,
  onBulletClick: null,
  onRefreshClick: null,
  bulletArrowUp: false,
  border: false,
};

SpaceInfo.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  onAddClick: PropTypes.func,
  onListClick: PropTypes.func,
  bulletArrowUp: PropTypes.bool,
  onBulletClick: PropTypes.func,
  onRefreshClick: PropTypes.func,
  border: PropTypes.bool,
};

export default observer(SpaceInfo);
