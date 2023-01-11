import React from 'react';
import PropTypes from 'prop-types';
import './Input.scss';

function Input({ className, type, value, size, disabled, outline, required, onChange, placeholder, minLength, maxLength, onRef, underline, color, onKeyDown, pattern, onBlur }) {
  return (
    <input
      ref={e => {
        if (onRef) {
          onRef(e);
        }
      }}
      className={`input-wrapper ${className} size-${size} ${outline ? 'outline' : ''} ${underline ? 'underline' : ''} color-${color}`}
      type={type}
      pattern={pattern}
      disabled={disabled}
      placeholder={placeholder}
      onChange={e => {
        if (onChange) {
          onChange(e.target.value, e);
        }
      }}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      value={value}
      required={required}
      minLength={minLength}
      maxLength={maxLength}
    />
  );
}

Input.defaultProps = {
  className: '',
  type: 'text',
  size: 'md',
  value: '',
  required: false,
  disabled: false,
  outline: true,
  onChange: null,
  placeholder: '',
  minLength: null,
  maxLength: null,
  onRef: null,
  underline: false,
  color: '',
  onKeyDown: null,
  pattern: null,
  onBlur: null,
};

Input.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.oneOf(['xxl', 'xl', 'lg', 'md', 'sm', 'xs']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  outline: PropTypes.bool,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  onRef: PropTypes.func,
  underline: PropTypes.bool,
  color: PropTypes.string,
  onKeyDown: PropTypes.func,
  pattern: PropTypes.string,
  onBlur: PropTypes.func,
};

export default Input;
