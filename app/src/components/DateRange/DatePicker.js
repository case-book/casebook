import React from 'react';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';

import { DATE_FORMATS } from '@/constants/constants';
import DateCustomInput from '@/components/DateRange/DateCustomInput/DateCustomInput';
import dateUtil from '@/utils/dateUtil';
import './DatePicker.scss';
import { Button } from '@/components';

function DatePickerWrapper({ className, language, date, outline, onChange, size, showTimeSelect, showTimeSelectOnly, clear }) {
  return (
    <div className={`date-picker-wrapper ${className} size-${size} ${outline ? 'outline' : ''} ${clear ? 'clear' : ''}`}>
      {clear && (
        <div className="clear-button">
          <Button
            size={size}
            outline={false}
            color="transparent"
            onClick={() => {
              onChange(null);
            }}
          >
            <i className="fa-regular fa-calendar-xmark" />
          </Button>
        </div>
      )}
      <DatePicker
        className="date-picker start-date-picker"
        selected={date ? new Date(date) : null}
        showTimeSelect={showTimeSelect}
        showTimeSelectOnly={showTimeSelectOnly}
        onChange={val => {
          onChange(val.getTime());
        }}
        locale={language}
        customInput={<DateCustomInput />}
        dateFormat={DATE_FORMATS[dateUtil.getUserLocale()][showTimeSelectOnly ? 'hoursMinutes' : 'full'].picker}
      />
    </div>
  );
}

export default DatePickerWrapper;

DatePickerWrapper.defaultProps = {
  className: '',
  size: 'md',
  showTimeSelect: true,
  showTimeSelectOnly: false,
  date: null,
  onChange: null,
  outline: true,
  language: 'ko',
  clear: true,
};

DatePickerWrapper.propTypes = {
  className: PropTypes.string,
  language: PropTypes.string,
  date: PropTypes.number,
  onChange: PropTypes.func,
  size: PropTypes.string,
  showTimeSelect: PropTypes.bool,
  showTimeSelectOnly: PropTypes.bool,
  outline: PropTypes.bool,
  clear: PropTypes.bool,
};
