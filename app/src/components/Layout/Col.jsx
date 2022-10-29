import React from 'react';
import PropTypes from 'prop-types';
import './Col.scss';

function Col({ className, children }) {
  return <div className={`col-wrapper ${className}`}>{children}</div>;
}

Col.defaultProps = {
  className: '',
};

Col.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Col;
