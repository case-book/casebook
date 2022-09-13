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
            <div />
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
  separator: true,
  size: 'md',
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
