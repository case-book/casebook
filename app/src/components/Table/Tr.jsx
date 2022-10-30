import React from 'react';
import PropTypes from 'prop-types';
import './Tr.scss';

function Tr({ className, children }) {
  return <tr className={`tr-wrapper ${className}`}>{children}</tr>;
}

Tr.defaultProps = {
  className: '',
};

Tr.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Tr;
