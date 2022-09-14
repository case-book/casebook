import React from 'react';
import PropTypes from 'prop-types';
import './Logo.scss';
import WordSplitter from '@/components/WordSplitter/WordSplitter';

function Logo({ className, onClick, icon }) {
  return (
    <div
      className={`logo-wrapper ${className} ${onClick ? 'g-clickable' : ''}`}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      {icon && (
        <div className="logo-icon">
          <span>
            <i className="fa-solid fa-virus" />
          </span>
        </div>
      )}
      <div className="logo-text">
        <WordSplitter text="CASEBOOK" rounded={false} swing={false} bouncing={false} />
        <div className="version">v1.0.0</div>
      </div>
    </div>
  );
}

Logo.defaultProps = {
  className: '',
  onClick: null,
  icon: true,
};

Logo.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.bool,
};

export default Logo;
