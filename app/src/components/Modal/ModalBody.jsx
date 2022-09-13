import React from 'react';
import PropTypes from 'prop-types';

function ModalBody({ className, children }) {
  return <div className={`modal-body-wrapper ${className}`}>{children}</div>;
}

ModalBody.defaultProps = {
  className: '',
  children: '',
};

ModalBody.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default ModalBody;
