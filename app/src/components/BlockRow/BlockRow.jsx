import React from 'react';
import PropTypes from 'prop-types';
import './BlockRow.scss';

function BlockRow({ className, children, expand }) {
  return (
    <div className={`block-row-wrapper ${className} ${expand ? 'expand' : ''}`}>
      <div className="block-row-content">{children}</div>
      <div className="block-row-liner" />
    </div>
  );
}

BlockRow.defaultProps = {
  className: '',
  expand: false,
  children: null,
};

BlockRow.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  expand: PropTypes.bool,
};

export default BlockRow;
