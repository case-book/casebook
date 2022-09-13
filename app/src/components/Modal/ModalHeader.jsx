import React from 'react';
import PropTypes from 'prop-types';
import Title from '@/components/Title/Title';

function ModalHeader({ className, children }) {
  return (
    <div className={`modal-header-wrapper ${className}`}>
      <Title type="h2">{children}</Title>
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
