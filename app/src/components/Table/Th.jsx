import React from 'react';
import PropTypes from 'prop-types';
import './Th.scss';

function Th({ className, children, align, rowSpan, colSpan }) {
  return (
    <th rowSpan={rowSpan} colSpan={colSpan} className={`th-wrapper ${className} align-${align}`}>
      {children}
    </th>
  );
}

Th.defaultProps = {
  className: '',
  align: 'center',
  children: null,
  rowSpan: 1,
  colSpan: 1,
};

Th.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  align: PropTypes.oneOf(['left', 'center', 'right']),
  rowSpan: PropTypes.number,
  colSpan: PropTypes.number,
};

export default Th;
