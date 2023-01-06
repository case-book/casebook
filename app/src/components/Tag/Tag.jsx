import React from 'react';
import PropTypes from 'prop-types';
import './Tag.scss';

function Tag({ className, children, color, border, rounded, uppercase, size }) {
  return <div className={`tag-wrapper ${className} color-${color} ${border ? 'border' : ''} ${rounded ? 'rounded' : ''} ${uppercase ? 'uppercase' : ''} size-${size}`}>{children}</div>;
}

Tag.defaultProps = {
  className: '',
  children: '',
  color: '',
  border: false,
  rounded: true,
  uppercase: false,
  size: 'xs',
};

Tag.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  color: PropTypes.string,
  border: PropTypes.bool,
  rounded: PropTypes.bool,
  uppercase: PropTypes.bool,
  size: PropTypes.string,
};

export default Tag;
