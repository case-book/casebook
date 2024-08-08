import React from 'react';
import PropTypes from 'prop-types';
import './PathIcon.scss';

function PathIcon({ className, color, size }) {
  return (
    <svg
      className={`path-icon-wrapper ${className} color-${color} size-${size}`}
      viewBox="0 0 16 16"
      style={{
        width: size,
        height: size,
      }}
    >
      <path d="M14,11.75a.74.74,0,0,1-.53-.22L8,6.06,2.53,11.53a.75.75,0,0,1-1.06-1.06l6-6a.75.75,0,0,1,1.06,0l6,6a.75.75,0,0,1,0,1.06A.74.74,0,0,1,14,11.75Z" />
    </svg>
  );
}

PathIcon.defaultProps = {
  className: '',
  color: 'black',
  size: 'md',
};

PathIcon.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
};

export default PathIcon;
