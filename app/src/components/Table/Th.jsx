import React from 'react';
import PropTypes from 'prop-types';
import './Th.scss';

function Th({ className, children, align }) {
  return <th className={`th-wrapper ${className} align-${align}`}>{children}</th>;
}

Th.defaultProps = {
  className: '',
  align: 'center',
  children: null,
};

Th.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  align: PropTypes.oneOf(['left', 'center', 'right']),
};

export default Th;
