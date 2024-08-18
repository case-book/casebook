import React from 'react';
import PropTypes from 'prop-types';
import './Pill.scss';
import { Liner } from '@/components';

function Pill({ className, data, color, border, rounded, uppercase, size }) {
  return (
    <div className={`pill-wrapper ${className} color-${color} ${border ? 'border' : ''} ${rounded ? 'rounded' : ''} ${uppercase ? 'uppercase' : ''} size-${size}`}>
      <div>{data.key}</div>
      <div>
        <Liner width="1px" height="10px" />
      </div>
      <div>{data.value}</div>
    </div>
  );
}

Pill.defaultProps = {
  className: '',
  data: {},
  color: 'white',
  border: true,
  rounded: true,
  uppercase: false,
  size: 'md',
};

Pill.propTypes = {
  className: PropTypes.string,
  data: PropTypes.shape({
    key: PropTypes.string,
    value: PropTypes.string,
  }),
  color: PropTypes.string,
  border: PropTypes.bool,
  rounded: PropTypes.bool,
  uppercase: PropTypes.bool,
  size: PropTypes.string,
};

export default Pill;
