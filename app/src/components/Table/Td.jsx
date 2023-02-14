import React from 'react';
import PropTypes from 'prop-types';
import './Td.scss';

function Td({ className, children, align, rowSpan, colSpan, bold }) {
  return (
    <td className={`td-wrapper ${className} align-${align} ${bold ? 'bold' : ''}`} rowSpan={rowSpan} colSpan={colSpan}>
      {children}
    </td>
  );
}

Td.defaultProps = {
  className: '',
  align: 'left',
  rowSpan: undefined,
  colSpan: undefined,
  children: undefined,
  bold: false,
};

Td.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  align: PropTypes.oneOf(['left', 'center', 'right']),
  rowSpan: PropTypes.number,
  colSpan: PropTypes.number,
  bold: PropTypes.bool,
};

export default Td;
