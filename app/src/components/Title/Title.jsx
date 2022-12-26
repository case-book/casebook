import React from 'react';
import PropTypes from 'prop-types';
import './Title.scss';

function Title({ className, children, type, control, border, paddingBottom }) {
  return (
    <div className={`title-wrapper ${type} ${className} ${border ? 'border' : ''} ${paddingBottom ? 'padding-bottom' : ''}`}>
      <div className="title-content">
        <div className="title-text">{children}</div>
        {control && <div className="control">{control}</div>}
      </div>
      {border && <div className="title-bottom-liner" />}
    </div>
  );
}

Title.defaultProps = {
  className: '',
  children: '',
  type: 'h1',
  control: null,
  border: true,
  paddingBottom: true,
};

Title.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  type: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5']),
  control: PropTypes.node,
  border: PropTypes.bool,
  paddingBottom: PropTypes.bool,
};

export default Title;
