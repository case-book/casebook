import React from 'react';
import PropTypes from 'prop-types';
import './Button.scss';

function Button({ className, type, size, outline, children, shadow, color, rounded, onClick, disabled }) {
  return (
    <button
      type={type}
      className={`g-no-select btn-wrapper btn${outline ? '-outline' : ''}${color ? `-${color}` : ''} btn-${size} ${className} ${disabled ? 'disabled' : ''} ${shadow ? '' : 'shadow-none'} ${
        rounded ? 'rounded' : ''
      }`}
      color={color}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

Button.defaultProps = {
  className: '',
  type: 'button',
  children: null,
  shadow: true,
  color: 'white',
  rounded: false,
  size: 'md',
  onClick: null,
  outline: false,
  disabled: false,
};

Button.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  children: PropTypes.node,
  shadow: PropTypes.bool,
  color: PropTypes.string,
  rounded: PropTypes.bool,
  size: PropTypes.string,
  outline: PropTypes.bool,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default Button;
