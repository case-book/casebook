import React from 'react';
import PropTypes from 'prop-types';
import './Tbody.scss';

function Tbody({ className, children }) {
  return <tbody className={`tbody-wrapper ${className}`}>{children}</tbody>;
}

Tbody.defaultProps = {
  className: '',
  children: undefined,
};

Tbody.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Tbody;
