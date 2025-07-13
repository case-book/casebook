import React from 'react';
import * as PropTypes from 'prop-types';
import './SideBarMiniButton.scss';

function SideBarMiniButton({ className, children, onClick }) {
  return (
    <button className={`side-bar-mini-button-wrapper ${className}`} type="button" onClick={onClick}>
      {children}
    </button>
  );
}

SideBarMiniButton.defaultProps = {
  className: '',
};

SideBarMiniButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default SideBarMiniButton;
