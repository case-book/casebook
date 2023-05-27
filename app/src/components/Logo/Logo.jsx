import React from 'react';
import PropTypes from 'prop-types';
import './Logo.scss';

function Logo({ className, onClick }) {
  return (
    <div className={`logo-wrapper ${className} ${onClick ? 'g-clickable' : ''}`}>
      <div className="logo-content">
        <div
          className="logo-content"
          onClick={() => {
            if (onClick) {
              onClick();
            }
          }}
        >
          <div>
            <span className="case">CASE</span>
            <span className="book">BOOK</span>
          </div>
        </div>
        <span className="floating-icon icon-pencil">
          <i className="fa-solid fa-pencil" />
        </span>
        <span className="floating-icon icon-book">
          <i className="fa-solid fa-book" />
        </span>
      </div>
    </div>
  );
}

Logo.defaultProps = {
  className: '',
  onClick: null,
};

Logo.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Logo;
