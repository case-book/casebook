import React from 'react';
import PropTypes from 'prop-types';
import './Switch.scss';

function Switch({ className, size, value, onClick, outline }) {
  return (
    <div
      className={`switch-wrapper g-no-select ${className} size-${size} ${value ? 'checked' : ''} ${outline ? 'outline' : ''}`}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      <div className="track">
        <div className="ball" />
      </div>
    </div>
  );
}

Switch.defaultProps = {
  className: '',
  size: 'md',
  value: false,
  onClick: null,
  outline: false,
};

Switch.propTypes = {
  className: PropTypes.string,
  size: PropTypes.string,
  value: PropTypes.bool,
  onClick: PropTypes.func,
  outline: PropTypes.bool,
};

export default Switch;
