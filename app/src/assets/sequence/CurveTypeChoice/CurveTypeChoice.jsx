import React, { memo } from 'react';
import PropTypes from 'prop-types';
import './CurveTypeChoice.scss';
import { CURVE_TYPES } from '@/constants/constants';
import classNames from 'classnames';
import { Radio } from '@/components';

function CurveTypeChoice({ className, curveType, setCurveType }) {
  return (
    <div className={classNames('curve-type-choice-wrapper', className)}>
      {CURVE_TYPES.map(d => {
        return (
          <Radio
            key={d.value}
            className="option"
            type="inline"
            size="xs"
            value={d.value}
            checked={curveType === d.value}
            onChange={() => {
              setCurveType(d.value);
            }}
            label={d.icon}
          />
        );
      })}
    </div>
  );
}

CurveTypeChoice.defaultProps = {
  className: '',
  curveType: 'step',
};

CurveTypeChoice.propTypes = {
  className: PropTypes.string,
  curveType: PropTypes.oneOf(CURVE_TYPES.map(d => d.value)),
  setCurveType: PropTypes.func.isRequired,
};

export default memo(CurveTypeChoice);
