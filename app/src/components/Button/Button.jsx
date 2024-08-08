import React, { forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Button.scss';

import ReactTooltip from 'react-tooltip';

const Button = forwardRef((props, forwardedRef) => {
  const { className, type, size, outline, children, shadow, color, rounded, onClick, disabled, tip } = props;

  useEffect(() => {
    ReactTooltip.rebuild();
  }, []);

  return (
    <button
      ref={forwardedRef}
      type={type}
      className={`g-no-select btn-wrapper btn${outline ? '-outline' : ''} btn-${color ? `${color}` : ''} btn-${size} ${className} ${disabled ? 'disabled' : ''} ${shadow ? '' : 'shadow-none'} ${
        rounded ? 'rounded' : ''
      }`}
      color={color}
      onClick={onClick}
      disabled={disabled}
      data-tip={tip}
    >
      {children}
    </button>
  );
});

Button.defaultProps = {
  className: '',
  type: 'button',
  children: null,
  shadow: true,
  color: 'white',
  rounded: false,
  size: 'md',
  onClick: null,
  outline: true,
  disabled: false,
  tip: null,
};

Button.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  children: PropTypes.node,
  shadow: PropTypes.bool,
  color: PropTypes.string,
  rounded: PropTypes.bool,
  size: PropTypes.oneOf(['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl']),
  outline: PropTypes.bool,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  tip: PropTypes.string,
};

export default Button;
