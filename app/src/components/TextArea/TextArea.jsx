import React from 'react';
import PropTypes from 'prop-types';
import './TextArea.scss';

function TextArea({ className, value, maxLength, size, disabled, border, required, onChange, placeholder, rows, color }) {
  return (
    <textarea
      className={`text-area-wrapper ${className} size-${size} ${border ? 'border' : ''} color-${color}`}
      disabled={disabled}
      placeholder={placeholder}
      onChange={e => {
        if (!maxLength || (maxLength && maxLength >= e.target.value.length)) {
          onChange(e.target.value);
        }
      }}
      value={value}
      required={required}
      rows={rows}
    >
      {value}
    </textarea>
  );
}

TextArea.defaultProps = {
  className: '',
  size: 'lg',
  value: '',
  required: false,
  disabled: false,
  border: true,
  onChange: null,
  placeholder: '',
  maxLength: null,
  rows: 4,
  color: 'black',
};

TextArea.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['xxl', 'xl', 'lg', 'md', 'sm', 'xs']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  border: PropTypes.bool,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
  rows: PropTypes.number,
  color: PropTypes.string,
};

export default TextArea;
