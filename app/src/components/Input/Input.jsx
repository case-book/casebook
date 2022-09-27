import React from 'react';
import PropTypes from 'prop-types';
import './Input.scss';

function Input({ className, type, value, size, disabled, border, required, onChange, placeholder, minLength, maxLength, onRef, underline, color }) {
  return (
    <input
      ref={e => {
        if (onRef) {
          onRef(e);
        }
      }}
      className={`input-wrapper ${className} size-${size} ${border ? 'border' : ''} ${underline ? 'underline' : ''} color-${color}`}
      type={type}
      disabled={disabled}
      placeholder={placeholder}
      onChange={e => {
        if (onChange) {
          onChange(e.target.value, e);
        }
      }}
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
  size: 'lg',
  value: '',
  required: false,
  disabled: false,
  border: true,
  onChange: null,
  placeholder: '',
  minLength: null,
  maxLength: null,
  onRef: null,
  underline: false,
  color: 'black',
};

Input.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.oneOf(['xxl', 'xl', 'lg', 'md', 'sm', 'xs']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  border: PropTypes.bool,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  onRef: PropTypes.func,
  underline: PropTypes.bool,
  color: PropTypes.string,
};

export default Input;
