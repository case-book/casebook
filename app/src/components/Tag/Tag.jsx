import React from 'react';
import PropTypes from 'prop-types';
import './Tag.scss';

function Tag({ className, children, color, border, rounded }) {
  return <div className={`tag-wrapper ${className} color-${color} ${border ? 'border' : ''} ${rounded ? 'rounded' : ''}`}>{children}</div>;
}

Tag.defaultProps = {
  className: '',
  children: '',
  color: 'black',
  border: false,
  rounded: true,
};

Tag.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  color: PropTypes.string,
  border: PropTypes.bool,
  rounded: PropTypes.bool,
};

export default Tag;
