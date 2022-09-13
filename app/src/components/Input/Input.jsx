import React from 'react';
import PropTypes from 'prop-types';
import './Input.scss';

function Input({ className, type, value, size, disabled, border, required, onChange, placeholder, minLength, maxLength, onRef }) {
  return (
    <input
      ref={e => {
        if (onRef) {
          onRef(e);
        }
      }}
      className={`input-wrapper ${className} size-${size} ${border ? 'border' : ''}`}
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
  size: 'md',
  value: '',
  required: false,
  disabled: false,
  border: true,
  onChange: null,
  placeholder: '',
  minLength: null,
  maxLength: null,
  onRef: null,
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
};

export default Input;
