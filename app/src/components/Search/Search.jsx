import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CloseIcon } from '@/components';
import './Search.scss';

function Search({ className, type, value, size, disabled, outline, required, placeholder, minLength, maxLength, onRef, underline, color, pattern, onBlur, autoComplete, onSearch, clear }) {
  const [text, setText] = useState('');

  useEffect(() => {
    setText(value);
  }, [value]);

  return (
    <div className={`search-wrapper ${className} color-${color} size-${size} ${outline ? 'outline' : ''} ${underline ? 'underline' : ''}`}>
      <div className="icon g-no-select">
        <i className="fa-solid fa-magnifying-glass" />
      </div>
      <div className="search-control">
        <input
          ref={e => {
            if (onRef) {
              onRef(e);
            }
          }}
          type={type}
          pattern={pattern}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={e => {
            setText(e.target.value, e);
          }}
          onBlur={onBlur}
          onKeyDown={e => {
            if (onSearch && e.key === 'Enter') {
              onSearch(text);
            }
          }}
          value={text}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
        />
      </div>
      {clear && (
        <div className="clear-icon">
          <CloseIcon
            size="xs"
            onClick={() => {
              onSearch('');
            }}
          />
        </div>
      )}
    </div>
  );
}

Search.defaultProps = {
  className: '',
  type: 'text',
  size: 'md',
  value: '',
  required: false,
  disabled: false,
  outline: true,
  placeholder: '',
  minLength: null,
  maxLength: null,
  onRef: null,
  underline: false,
  color: 'default',
  pattern: null,
  onBlur: null,
  autoComplete: 'off',
  onSearch: null,
  clear: true,
};

Search.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.oneOf(['xxl', 'xl', 'lg', 'md', 'sm', 'xs']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  outline: PropTypes.bool,
  placeholder: PropTypes.string,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  onRef: PropTypes.func,
  underline: PropTypes.bool,
  color: PropTypes.string,
  pattern: PropTypes.string,
  onBlur: PropTypes.func,
  autoComplete: PropTypes.string,
  onSearch: PropTypes.func,
  clear: PropTypes.bool,
};

export default Search;
