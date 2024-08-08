import React from 'react';
import { observer } from 'mobx-react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import './SideOverlayMenu.scss';

function SideOverlayMenu({ className, children }) {
  return <div className={classNames('side-overlay-menu-wrapper', className)}>{children}</div>;
}

SideOverlayMenu.defaultProps = {
  className: '',
};

SideOverlayMenu.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default observer(SideOverlayMenu);
