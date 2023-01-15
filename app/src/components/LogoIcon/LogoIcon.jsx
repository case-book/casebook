import React from 'react';
import PropTypes from 'prop-types';
import './LogoIcon.scss';

function LogoIcon({ className, size }) {
  return (
    <div className={`logo-icon-wrapper ${className} size-${size}`}>
      <div>
        <i className="fa-solid fa-book" />
      </div>
    </div>
  );
}

LogoIcon.defaultProps = {
  className: '',
  size: 'xxl',
};

LogoIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.string,
};

export default LogoIcon;
