import React from 'react';
import PropTypes from 'prop-types';
import './Title.scss';
import { Liner } from '@/components';

function Title({ className, children, type, control, border, paddingBottom, marginBottom, colored, icon }) {
  return (
    <div className={`title-wrapper ${type} ${className} ${border ? 'border' : ''} ${colored ? 'colored' : ''} ${paddingBottom ? 'padding-bottom' : ''} ${marginBottom ? 'margin-bottom' : ''}`}>
      <div className="title-content">
        <div className="title-text">
          {icon || <i className="fa-brands fa-readme" />} {children}
        </div>
        {control && (
          <div className="control">
            <Liner display="inline-block" width="1px" height="10px" margin="0 10px" />
            <div className="control-content">{control}</div>
          </div>
        )}
      </div>
      {border && <div className="title-bottom-liner" />}
    </div>
  );
}

Title.defaultProps = {
  className: '',
  children: '',
  type: 'h2',
  control: null,
  border: true,
  paddingBottom: true,
  marginBottom: true,
  colored: false,
  icon: null,
};

Title.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  type: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5']),
  control: PropTypes.node,
  border: PropTypes.bool,
  paddingBottom: PropTypes.bool,
  marginBottom: PropTypes.bool,
  colored: PropTypes.bool,
  icon: PropTypes.node,
};

export default Title;
