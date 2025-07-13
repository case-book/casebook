import React from 'react';
import * as PropTypes from 'prop-types';
import './SideBarMiniButton.scss';

function SideBarMiniButton({ className, children, onClick, shadow }) {
  return (
    <button className={`side-bar-mini-button-wrapper ${className} ${shadow ? 'shadow' : ''}`} type="button" onClick={onClick}>
      {children}
    </button>
  );
}

SideBarMiniButton.defaultProps = {
  className: '',
  shadow: true,
};

SideBarMiniButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  shadow: PropTypes.bool,
};

export default SideBarMiniButton;
