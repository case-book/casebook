import React from 'react';
import PropTypes from 'prop-types';
import './Radio.scss';

class Radio extends React.PureComponent {
  render() {
    const { className, label, onChange, value, checked, size, readOnly, type } = this.props;

    return (
      <div
        className={`radio-wrapper g-no-select ${size} ${className} ${readOnly ? 'read-only' : 'active'} type-${type} ${checked ? 'checked' : ''}`}
        onClick={() => {
          if (!readOnly) {
            onChange(value);
          }
        }}
      >
        <div className="border" />
        <div className="radio-content">
          <input type="radio" checked={checked} readOnly />
          <label>{label}</label>
        </div>
      </div>
    );
  }
}

Radio.defaultProps = {
  className: '',
  label: '',
  onChange: null,
  size: 'md',
  checked: false,
  value: '',
  readOnly: false,
  type: 'default',
};

Radio.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  size: PropTypes.string,
  checked: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  readOnly: PropTypes.bool,
  type: PropTypes.oneOf(['default', 'inline', 'line']),
};

export default Radio;
