import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './TextArea.scss';

function TextArea({ className, value, maxLength, size, outline, disabled, border, required, onChange, underline, placeholder, rows, autoHeight, onClick, onKeyUp, onRef }) {
  const element = useRef({});

  useEffect(() => {
    if (autoHeight && element.current) {
      element.current.style.height = '5px';
      element.current.style.height = `${element.current.scrollHeight + 2}px`;
    }
  }, [autoHeight]);

  return (
    <textarea
      ref={e => {
        element.current = e;
        if (onRef) {
          onRef(e);
        }
      }}
      className={`text-area-wrapper ${className} ${outline ? 'outline' : ''} ${underline ? 'underline' : ''} size-${size} ${border ? 'border' : ''}`}
      onInput={e => {
        if (autoHeight) {
          e.target.style.height = '5px';
          e.target.style.height = `${e.target.scrollHeight + 2}px`;
        }
      }}
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
      onClick={onClick}
      onKeyUp={onKeyUp}
    >
      {value}
    </textarea>
  );
}

TextArea.defaultProps = {
  className: '',
  size: 'md',
  value: '',
  required: false,
  disabled: false,
  border: true,
  onChange: null,
  placeholder: '',
  maxLength: null,
  rows: 4,
  autoHeight: false,
  outline: true,
  underline: false,
  onClick: null,
  onKeyUp: null,
  onRef: null,
};

TextArea.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['xxl', 'xl', 'lg', 'md', 'sm', 'xs']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  required: PropTypes.bool,
  outline: PropTypes.bool,
  disabled: PropTypes.bool,
  border: PropTypes.bool,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
  rows: PropTypes.number,
  autoHeight: PropTypes.bool,
  underline: PropTypes.bool,
  onClick: PropTypes.func,
  onKeyUp: PropTypes.func,
  onRef: PropTypes.func,
};

export default TextArea;
