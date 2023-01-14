import React from 'react';
import PropTypes from 'prop-types';
import './LogoIcon.scss';

function LogoIcon({ className }) {
  return (
    <div className={`logo-icon-wrapper ${className}`}>
      <div>
        <i className="fa-solid fa-book" />
      </div>
    </div>
  );
}

LogoIcon.defaultProps = {
  className: '',
};

LogoIcon.propTypes = {
  className: PropTypes.string,
};

export default LogoIcon;
