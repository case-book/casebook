import React from 'react';
import PropTypes from 'prop-types';
import './Td.scss';

function Td({ className, children }) {
  return <td className={`td-wrapper ${className}`}>{children}</td>;
}

Td.defaultProps = {
  className: '',
};

Td.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Td;
