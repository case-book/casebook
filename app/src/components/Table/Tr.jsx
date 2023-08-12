import React from 'react';
import PropTypes from 'prop-types';
import './Tr.scss';

function Tr({ className, onClick, children }) {
  return (
    <tr className={`tr-wrapper ${className}`} onClick={onClick}>
      {children}
    </tr>
  );
}

Tr.defaultProps = {
  className: '',
  onClick: null,
};

Tr.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

export default Tr;
