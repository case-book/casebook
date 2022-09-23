import React from 'react';
import PropTypes from 'prop-types';
import './Label.scss';

function Label({ className, children, minWidth, required, separator, size, verticalAlign }) {
  return (
    <div
      className={`label-wrapper size-${size} ${className} ${required ? 'required' : ''}`}
      style={{
        minWidth,
        alignSelf: verticalAlign,
      }}
    >
      <span
        style={{
          alignSelf: verticalAlign,
        }}
      >
        {children}
        {required && (
          <div className="required-mark">
            <i className="fa-solid fa-asterisk" />
          </div>
        )}
      </span>
      {separator && (
        <span
          className="liner"
          style={{
            alignSelf: verticalAlign,
          }}
        >
          <span />
        </span>
      )}
    </div>
  );
}

Label.defaultProps = {
  className: '',
  minWidth: '100px',
  required: false,
  separator: false,
  size: 'lg',
  verticalAlign: 'center',
  children: null,
};

Label.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  minWidth: PropTypes.string,
  required: PropTypes.bool,
  separator: PropTypes.bool,
  size: PropTypes.string,
  verticalAlign: PropTypes.string,
};

export default Label;
