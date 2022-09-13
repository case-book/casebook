import React from 'react';
import PropTypes from 'prop-types';
import './Form.scss';

function Form({ className, children, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className={`form-wrapper ${className}`}>
      {children}
    </form>
  );
}

Form.defaultProps = {
  className: '',
  children: '',
  onSubmit: null,
};

Form.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  onSubmit: PropTypes.func,
};

export default Form;
