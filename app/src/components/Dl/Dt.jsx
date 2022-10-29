import React from 'react';
import PropTypes from 'prop-types';
import './Dt.scss';

function Dt({ className, children }) {
  return <div className={`dt-wrapper ${className}`}>{children}</div>;
}

Dt.defaultProps = {
  className: '',
};

Dt.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Dt;
