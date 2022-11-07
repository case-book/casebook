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
};

CheckBox.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  size: PropTypes.string,
};

export default CheckBox;
