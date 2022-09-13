import React from 'react';
import PropTypes from 'prop-types';
import './Block.scss';

function Block({ className, children, border }) {
  return (
    <div className={`block-wrapper ${className}`}>
      {children}
      {border && <div className="bottom-liner" />}
    </div>
  );
}

Block.defaultProps = {
  className: '',
  border: false,
  children: '',
};

Block.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  border: PropTypes.bool,
};

export default Block;
