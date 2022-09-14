import React from 'react';
import PropTypes from 'prop-types';
import './Tag.scss';

function Tag({ className, children }) {
  return <div className={`tag-wrapper ${className}`}>{children}</div>;
}

Tag.defaultProps = {
  className: '',
  children: '',
};

Tag.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Tag;
