import React from 'react';
import PropTypes from 'prop-types';
import './Info.scss';
import { ColorPropTypes } from '@/proptypes';

function Info({ className, children, color, rounded }) {
  return (
    <div className={`info-wrapper ${className} color-${color || ''} ${rounded ? 'rounded' : ''}`}>
      <i className="fa-solid fa-circle-info" /> {children}
    </div>
  );
}

Info.defaultProps = {
  className: '',
  children: '',
  color: undefined,
  rounded: true,
};

Info.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  color: ColorPropTypes,
  rounded: PropTypes.bool,
};

export default Info;
