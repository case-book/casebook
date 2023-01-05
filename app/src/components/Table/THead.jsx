import React from 'react';
import PropTypes from 'prop-types';
import './THead.scss';

function THead({ className, children }) {
  return <thead className={`thead-wrapper ${className}`}>{children}</thead>;
}

THead.defaultProps = {
  className: '',
};

THead.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default THead;
