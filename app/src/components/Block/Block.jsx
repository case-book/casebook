import React from 'react';
import PropTypes from 'prop-types';
import './Block.scss';

function Block({ className, children, border, scroll, maxHeight, minHeight }) {
  return (
    <div
      className={`block-wrapper ${className} ${scroll && 'scroll'} ${border ? 'border' : ''}`}
      style={{
        maxHeight: scroll ? maxHeight : null,
        minHeight: scroll ? minHeight : null,
      }}
    >
      {children}
    </div>
  );
}

Block.defaultProps = {
  className: '',
  border: false,
  children: '',
  scroll: false,
  maxHeight: 'auto',
  minHeight: 'auto',
};

Block.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  border: PropTypes.bool,
  scroll: PropTypes.bool,
  maxHeight: PropTypes.string,
  minHeight: PropTypes.string,
};

export default Block;
