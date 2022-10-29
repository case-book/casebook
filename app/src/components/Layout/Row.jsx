import React from 'react';
import PropTypes from 'prop-types';
import './Row.scss';

function Row({ className, children, flexGrow, minHeight }) {
  return (
    <div
      className={`row-wrapper ${className} ${flexGrow ? `grow-${flexGrow}` : ''}`}
      style={{
        minHeight,
      }}
    >
      {children}
    </div>
  );
}

Row.defaultProps = {
  className: '',
  flexGrow: null,
  minHeight: 'auto',
};

Row.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  flexGrow: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  minHeight: PropTypes.string,
};

export default Row;
