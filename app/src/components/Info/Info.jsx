import React from 'react';
import PropTypes from 'prop-types';
import './Info.scss';
import { ColorPropTypes } from '@/proptypes';

function Info({ className, children, color }) {
  return (
    <div className={`info-wrapper ${className} color-${color || ''}`}>
      <i className="fa-solid fa-circle-info" /> {children}
    </div>
  );
}

Info.defaultProps = {
  className: '',
  children: '',
  color: undefined,
};

Info.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  color: ColorPropTypes,
};

export default Info;
