import React from 'react';
import PropTypes from 'prop-types';
import './Tag.scss';

function Tag({ className, children, color }) {
  return <div className={`tag-wrapper ${className} color-${color}`}>{children}</div>;
}

Tag.defaultProps = {
  className: '',
  children: '',
  color: 'black',
};

Tag.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  color: PropTypes.string,
};

export default Tag;
