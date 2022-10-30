import React from 'react';
import PropTypes from 'prop-types';
import './Tbody.scss';

function Tbody({ className, children }) {
  return <tbody className={`tbody-wrapper ${className}`}>{children}</tbody>;
}

Tbody.defaultProps = {
  className: '',
};

Tbody.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Tbody;
