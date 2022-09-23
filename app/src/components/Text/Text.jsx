import React from 'react';
import PropTypes from 'prop-types';
import './Text.scss';

function Text({ className, children, size, bold, verticalAlign, whiteSpace, white, inline }) {
  return (
    <div
      className={`text-wrapper ${className} size-${size} ${bold ? 'is-bold' : ''} ${white ? 'bg-white' : ''} ${inline ? 'inline' : ''}`}
      style={{
        alignSelf: verticalAlign,
      }}
    >
      <div
        className="text"
        style={{
          alignSelf: verticalAlign,
          whiteSpace,
        }}
      >
        <span>{children}</span>
      </div>
    </div>
  );
}

Text.defaultProps = {
  className: '',
  size: 'md',
  bold: false,
  verticalAlign: 'center',
  children: '',
  whiteSpace: 'normal',
  white: false,
  inline: false,
};

Text.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  size: PropTypes.string,
  bold: PropTypes.bool,
  verticalAlign: PropTypes.string,
  whiteSpace: PropTypes.oneOf(['nowrap', 'normal', 'pre', 'pre-wrap', 'pre-line']),
  white: PropTypes.bool,
  inline: PropTypes.bool,
};

export default Text;
