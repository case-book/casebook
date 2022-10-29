import React from 'react';
import PropTypes from 'prop-types';
import './Dl.scss';

function Dl({ className, children }) {
  return <div className={`dl-wrapper ${className}`}>{children}</div>;
}

Dl.defaultProps = {
  className: '',
};

Dl.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Dl;
