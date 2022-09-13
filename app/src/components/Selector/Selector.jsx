import React from 'react';
import PropTypes from 'prop-types';
import './Selector.scss';

class Selector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  render() {
    const { open } = this.state;
    const { className, onChange, items, value, addAll, outline, color, size, separator, minWidth, radius, disabled } = this.props;
    let selectedItem = items.find(item => String(item.key) === String(value));
    if (addAll && value === '') {
      selectedItem = {
        key: '',
        value: 'ALL',
      };
    }

    return (
      <div
        className={`selector-wrapper g-no-select ${className} size-${size} ${radius ? 'radius' : ''} ${disabled ? 'disabled' : ''}`}
        style={{
          minWidth: `${minWidth}`,
        }}
      >
        {open && (
          <div
            className="selector-overlay g-overlay"
            onClick={() => {
              this.setState({
                open: false,
              });
            }}
          />
        )}
        <div
          className={`${open ? 'open' : ''} selector-current ${outline ? 'outline' : ''} color-${color}`}
          onClick={() => {
            if (!disabled) {
              this.setState({
                open: !open,
              });
            }
          }}
        >
          <span className="text">{selectedItem ? selectedItem.value : ' '}</span>
          {separator && (
            <span className="liner">
              <span />
            </span>
          )}
          <span className="icon">
            <i className={`fas fa-chevron-${open ? 'up' : 'down'} normal`} />
            <i className={`fas fa-chevron-${open ? 'up' : 'down'} hover`} />
          </span>
        </div>
        {open && (
          <div className={`${open ? 'd-block' : 'd-none'} selector-list scrollbar-sm`}>
            <ul>
              {addAll && (
                <li
                  className={value === '' ? 'selected' : ''}
                  onClick={() => {
                    onChange('');
                    this.setState({
                      open: false,
                    });
                  }}
                >
                  <span className="select-arrow" />
                  ALL
                </li>
              )}
              {items.map(item => {
                return (
                  <li
                    key={item.key}
                    className={value === item.key ? 'selected' : ''}
                    onClick={() => {
                      onChange(item.key);
                      this.setState({
                        open: false,
                      });
                    }}
                  >
                    <span className="select-arrow" />
                    {item.value}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

Selector.defaultProps = {
  className: '',
  addAll: false,
  outline: false,
  color: '',
  size: 'md',
  separator: true,
  minWidth: 'auto',
  radius: false,
  disabled: false,
  value: '',
  items: [],
  onChange: PropTypes.func,
};

Selector.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  ),
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  addAll: PropTypes.bool,
  outline: PropTypes.bool,
  color: PropTypes.string,
  size: PropTypes.string,
  separator: PropTypes.bool,
  minWidth: PropTypes.string,
  radius: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default Selector;
