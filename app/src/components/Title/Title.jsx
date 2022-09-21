import React from 'react';
import PropTypes from 'prop-types';
import './Title.scss';

function Title({ className, children, type, control }) {
  return (
    <div className={`title-wrapper ${type} ${className}`}>
      <div className="title-text">{children}</div>
      {control && <div className="control">{control}</div>}
    </div>
  );
}

Title.defaultProps = {
  className: '',
  children: '',
  type: 'h1',
  control: null,
};

Title.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  type: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5']),
  control: PropTypes.node,
};

export default Title;
