import React from 'react';
import PropTypes from 'prop-types';
import { Liner, Text } from '@/components';
import './DateRangeText.scss';
import dateUtil from '@/utils/dateUtil';
import { DATE_FORMATS_TYPES } from '@/constants/constants';

function DateRangeText({ className, startDate, endDate, size, showTimeOnly }) {
  return (
    <div className={`date-range-text-wrapper ${className} size-${size}`}>
      <div>
        <Text>{dateUtil.getDateString(startDate, showTimeOnly ? 'hoursMinutes' : '')}</Text>
      </div>
      <Liner width="10px" height="1px" display="inline-block" color="black" margin="0 0.75rem 0 0.5rem" />
      <div>
        {showTimeOnly && <Text>{dateUtil.getDateString(endDate, 'hoursMinutes')}</Text>}
        {!showTimeOnly && <Text>{dateUtil.getDateString(endDate, dateUtil.isSameYear(startDate, endDate) ? DATE_FORMATS_TYPES.dayHours : '')}</Text>}
      </div>
    </div>
  );
}

export default DateRangeText;

DateRangeText.defaultProps = {
  className: '',
  size: 'md',
  showTimeOnly: false,
  startDate: null,
  endDate: null,
};

DateRangeText.propTypes = {
  className: PropTypes.string,
  startDate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  endDate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  size: PropTypes.string,
  showTimeOnly: PropTypes.bool,
};
