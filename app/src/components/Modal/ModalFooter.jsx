import React from 'react';
import PropTypes from 'prop-types';

function ModalFooter({ className, children }) {
  return (
    <div className={`modal-footer-wrapper ${className}`}>
      <div>{children}</div>
    </div>
  );
}

ModalFooter.defaultProps = {
  className: '',
  children: '',
};

ModalFooter.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default ModalFooter;
