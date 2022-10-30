import React from 'react';
import PropTypes from 'prop-types';
import './Tag.scss';

function Tag({ className, children, color, border, rounded, uppercase }) {
  return <div className={`tag-wrapper ${className} color-${color} ${border ? 'border' : ''} ${rounded ? 'rounded' : ''} ${uppercase ? 'uppercase' : ''}`}>{children}</div>;
}

Tag.defaultProps = {
  className: '',
  children: '',
  color: 'black',
  border: false,
  rounded: true,
  uppercase: false,
};

Tag.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  color: PropTypes.string,
  border: PropTypes.bool,
  rounded: PropTypes.bool,
  uppercase: PropTypes.bool,
};

export default Tag;
