import React from 'react';
import PropTypes from 'prop-types';
import './CloseIcon.scss';

function CloseIcon({ className, color, size, onClick }) {
  return (
    <svg
      className={`close-icon-wrapper ${className} color-${color} size-${size} ${onClick ? 'g-clickable' : ''}`}
      style={{
        width: size,
        height: size,
      }}
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      <path d="M147.374257 158.246733l10.351981-10.351981 717.269914 717.269914-10.351981 10.351981-717.269914-717.269914Z" />
      <path d="M147.374139 865.168212l717.269914-717.269914 10.351981 10.351981-717.269914 717.269914-10.351981-10.351981Z" />
    </svg>
  );
}

CloseIcon.defaultProps = {
  className: '',
  color: 'white',
  size: 'md',
  onClick: null,
};

CloseIcon.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
  onClick: PropTypes.func,
};

export default CloseIcon;
