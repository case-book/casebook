import React from 'react';
import PropTypes from 'prop-types';
import './Logo.scss';
import classNames from 'classnames';

function Logo({ className, onClick, animation, color, size, hand }) {
  return (
    <div className={classNames('logo-wrapper', className, `size-${size}`, `color-${color}`, { 'g-clickable': onClick, animation })}>
      {animation && hand && (
        <>
          <div className="hand-1">
            <span className="hand">
              <i className="fa-solid fa-hand-back-fist" />
            </span>
            <span className="bar-1" />
          </div>
          <div className="hand-2">
            <span className="hand">
              <i className="fa-solid fa-hand-back-fist" />
            </span>
            <span className="bar-1" />
          </div>
        </>
      )}
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
  animation: true,
  color: null,
  size: 'md',
  hand: true,
};

Logo.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  animation: PropTypes.bool,
  color: PropTypes.string,
  size: PropTypes.string,
  hand: PropTypes.bool,
};

export default Logo;
