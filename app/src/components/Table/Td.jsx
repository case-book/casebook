import React from 'react';
import PropTypes from 'prop-types';
import './Td.scss';

function Td({ className, children, align }) {
  return <td className={`td-wrapper ${className} align-${align}`}>{children}</td>;
}

Td.defaultProps = {
  className: '',
  align: 'left',
};

Td.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  align: PropTypes.oneOf(['left', 'center', 'right']),
};

export default Td;
