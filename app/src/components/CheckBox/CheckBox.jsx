import React from 'react';
import PropTypes from 'prop-types';
import './CheckBox.scss';

class CheckBox extends React.PureComponent {
  render() {
    const { className, label, onChange, value, size, disabled } = this.props;

    return (
      <div
        className={`check-box-wrapper ${size} ${className} ${value ? 'checked' : ''} ${disabled ? 'disabled' : 'active'}`}
        onClick={() => {
          if (!disabled) {
            onChange(!value);
          }
        }}
      >
        <span className="checked-icon g-no-select">
          <span>{value && <i className="fa-solid fa-check" />}</span>
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
  size: 'md',
  disabled: false,
};

CheckBox.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  size: PropTypes.string,
  disabled: PropTypes.bool,
};

export default CheckBox;
