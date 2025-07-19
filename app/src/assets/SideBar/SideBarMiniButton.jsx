import React from 'react';
import * as PropTypes from 'prop-types';
import './SideBarMiniButton.scss';

function SideBarMiniButton({ className, children, onClick, shadow, tooltip }) {
  return (
    <button className={`side-bar-mini-button-wrapper ${className} ${shadow ? 'shadow' : ''}`} type="button" onClick={onClick} data-tip={tooltip}>
      {children}
    </button>
  );
}

SideBarMiniButton.defaultProps = {
  className: '',
  shadow: true,
  tooltip: null,
};

SideBarMiniButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  shadow: PropTypes.bool,
  tooltip: PropTypes.string,
};

export default SideBarMiniButton;
