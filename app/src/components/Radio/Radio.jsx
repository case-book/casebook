import React from 'react';
import PropTypes from 'prop-types';
import './Radio.scss';

class Radio extends React.PureComponent {
  render() {
    const { className, label, onChange, value, checked, size, readOnly, type } = this.props;

    return (
      <div
        className={`radio-wrapper ${size} ${className} ${readOnly ? 'read-only' : 'active'} type-${type} ${checked ? 'checked' : ''}`}
        onClick={() => {
          if (!readOnly) {
            onChange(value);
          }
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
  type: PropTypes.oneOf(['default', 'inline']),
};

export default Radio;
