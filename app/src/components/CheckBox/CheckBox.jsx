import React from 'react';
import PropTypes from 'prop-types';
import './CheckBox.scss';

class CheckBox extends React.PureComponent {
  render() {
    const { className, label, onChange, value, size } = this.props;

    return (
      <div
        className={`check-box-wrapper ${size} ${className}`}
        onClick={() => {
          onChange(!value);
        }}
      >
        <span className={`check-box-span ${value ? 'checked' : ''}`}>
          <span />
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
