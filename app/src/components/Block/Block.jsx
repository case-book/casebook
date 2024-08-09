import React from 'react';
import PropTypes from 'prop-types';
import './Block.scss';

function Block({ className, children, border, scroll, maxHeight, minHeight, padding }) {
  return (
    <div
      className={`block-wrapper ${className} ${scroll && 'scroll'} ${border ? 'border' : ''} ${padding ? 'padding' : ''}`}
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
  padding: true,
};

Block.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  border: PropTypes.bool,
  scroll: PropTypes.bool,
  maxHeight: PropTypes.string,
  minHeight: PropTypes.string,
  padding: PropTypes.bool,
};

export default Block;
