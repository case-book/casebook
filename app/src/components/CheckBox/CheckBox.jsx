import React from 'react';
import PropTypes from 'prop-types';
import './CheckBox.scss';

class CheckBox extends React.PureComponent {
  render() {
    const { className, label, onChange, value, size } = this.props;

    return (
      <div
        className={`check-box-wrapper ${size} ${className} ${value ? 'checked' : ''}`}
        onClick={() => {
          onChange(!value);
        }}
      >
        <span className="checked-icon">
          {value && <i className="fa-solid fa-square-check" />}
          {!value && <i className="fa-solid fa-square" />}
        </span>
        <label className="g-no-select">{label}</label>
      </div>
    );
  }
}

CheckBox.defaultProps = {
  className: '',
  label: '',
  onChange: null,
  value: false,
  size: 'lg',
};

CheckBox.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  size: PropTypes.string,
};

export default CheckBox;
