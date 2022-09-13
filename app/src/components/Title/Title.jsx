import React from 'react';
import PropTypes from 'prop-types';
import './Title.scss';

function Title({ className, children, type }) {
  return <div className={`title-wrapper ${type} ${className}`}>{children}</div>;
}

Title.defaultProps = {
  className: '',
  children: '',
  type: 'h1',
};

Title.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  type: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5']),
};

export default Title;
