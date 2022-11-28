import React from 'react';
import PropTypes from 'prop-types';
import './DateCustomInput.scss';

class DateCustomInput extends React.PureComponent {
  render() {
    const { className, value, onClick } = this.props;

    return (
      <div
        className={`date-custom-input-wrapper g-no-select ${className}`}
        onClick={() => {
          if (onClick) {
            onClick();
          }
        }}
      >
        <div className="calendar">
          <i className="fa-solid fa-calendar-days" />
        </div>
        <div className="value">{value}</div>
        <div className="status">
          <i className="fa-solid fa-chevron-down" />
        </div>
      </div>
    );
  }
}

DateCustomInput.defaultProps = {
  className: '',
  value: null,
  onClick: null,
};

DateCustomInput.propTypes = {
  value: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default DateCustomInput;
