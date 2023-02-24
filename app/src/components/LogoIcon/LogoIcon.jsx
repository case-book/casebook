import React from 'react';
import PropTypes from 'prop-types';
import './LogoIcon.scss';
import logo from '@/images/casebook.svg';

function LogoIcon({ className, size }) {
  return (
    <div className={`logo-icon-wrapper ${className} size-${size}`}>
      <div>
        <img src={logo} alt="CASEBOOK LOGO" />
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
