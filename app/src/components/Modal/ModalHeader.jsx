import React from 'react';
import PropTypes from 'prop-types';

function ModalHeader({ className, children }) {
  return (
    <div className={`modal-header-wrapper ${className}`}>
      <div className="title-text">{children}</div>
    </div>
  );
}

ModalHeader.defaultProps = {
  className: '',
  children: '',
};

ModalHeader.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default ModalHeader;
