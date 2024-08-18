import React from 'react';
import PropTypes from 'prop-types';
import './Block.scss';
import classNames from 'classnames';

function Block({ className, children, border, scroll, maxHeight, minHeight, padding, danger }) {
  return (
    <div
      className={classNames('block-wrapper', className, { scroll, border, padding, danger })}
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
  danger: false,
};

Block.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  border: PropTypes.bool,
  scroll: PropTypes.bool,
  maxHeight: PropTypes.string,
  minHeight: PropTypes.string,
  padding: PropTypes.bool,
  danger: PropTypes.bool,
};

export default Block;
