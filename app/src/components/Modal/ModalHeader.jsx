import React from 'react';
import PropTypes from 'prop-types';

function ModalHeader({ className, children, onClose }) {
  return (
    <div className={`modal-header-wrapper ${className}`}>
      <div className="title-text">{children}</div>
      {onClose && (
        <div className="close-button">
          <span onClick={onClose}>
            <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <path d="M147.374257 158.246733l10.351981-10.351981 717.269914 717.269914-10.351981 10.351981-717.269914-717.269914Z" />
              <path d="M147.374139 865.168212l717.269914-717.269914 10.351981 10.351981-717.269914 717.269914-10.351981-10.351981Z" />
            </svg>
          </span>
        </div>
      )}
    </div>
  );
}

ModalHeader.defaultProps = {
  className: '',
  children: '',
  onClose: null,
};

ModalHeader.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  onClose: PropTypes.func,
};

export default ModalHeader;
