import React from 'react';
import PropTypes from 'prop-types';
import './Modal.scss';

function Modal({ className, children, isOpen, toggle }) {
  return (
    <div className={`modal-wrapper ${isOpen ? 'show' : ''} ${className}`}>
      <div>
        {children}
        {toggle && (
          <button className="exit-button" onClick={toggle}>
            <span>
              <i className="fal fa-times" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

Modal.defaultProps = {
  className: '',
  isOpen: false,
  children: '',
  toggle: null,
};

Modal.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};

export default Modal;
