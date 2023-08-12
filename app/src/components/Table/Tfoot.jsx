import React from 'react';
import PropTypes from 'prop-types';
import './Tfoot.scss';

function Tfoot({ className, children }) {
  return <tfoot className={`tbody-wrapper ${className}`}>{children}</tfoot>;
}

Tfoot.defaultProps = {
  className: '',
  children: undefined,
};

Tfoot.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Tfoot;
