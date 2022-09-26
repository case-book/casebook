import React from 'react';
import PropTypes from 'prop-types';
import './Title.scss';

function Title({ className, children, type, control, border }) {
  return (
    <div className={`title-wrapper ${type} ${className} ${border ? 'border' : ''}`}>
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
  border: true,
};

Title.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  type: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5']),
  control: PropTypes.node,
  border: PropTypes.bool,
};

export default Title;
