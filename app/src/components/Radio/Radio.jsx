import React from 'react';
import PropTypes from 'prop-types';
import './Radio.scss';

class Radio extends React.PureComponent {
  render() {
    const { className, label, onChange, value, checked, size } = this.props;

    return (
      <div
        className={`radio-wrapper ${size} ${className}`}
        onClick={() => {
          onChange(value);
        }}
      >
        <input type="radio" checked={checked} readOnly />
        <label className="g-no-select">{label}</label>
      </div>
    );
  }
}

Radio.defaultProps = {
  className: '',
  label: '',
  onChange: null,
  size: 'lg',
  checked: false,
  value: '',
};

Radio.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  size: PropTypes.string,
  checked: PropTypes.bool,
  value: PropTypes.string,
};

export default Radio;
