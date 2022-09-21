import React from 'react';
import PropTypes from 'prop-types';
import './WordSplitter.scss';

function WordSplitter({ className, text, colors, spacing, bouncing, swing, rounded, animate }) {
  return (
    <div
      className={`word-splitter-wrapper ${className} ${rounded ? 'rounded' : ''} ${animate ? 'animate' : ''}`}
      style={{
        marginRight: `-${(text.length - 1) * spacing}px`,
      }}
    >
      {text.split('').map((d, inx) => {
        let transform = '';
        if (swing) {
          if (inx % 2 === 0) {
            transform = 'rotate(6deg)';
          } else {
            transform = 'rotate(-6deg)';
          }
        }

        return (
          <span
            key={inx}
            style={{
              left: `-${inx * spacing}px`,
              backgroundColor: colors[inx % colors.length].backgroundColor,
              color: colors[inx % colors.length].color,
              width: bouncing && inx % 2 === 0 ? '26px' : '22px',
              height: bouncing && inx % 2 === 0 ? '26px' : '22px',
              transform,
              animationDelay: `${inx * 0.1}s`,
            }}
          >
            <span>{d}</span>
          </span>
        );
      })}
    </div>
  );
}

WordSplitter.defaultProps = {
  className: '',
  text: '',
  colors: [
    {
      backgroundColor: '#3e8ef1',
      color: 'white',
    },
    {
      backgroundColor: '#a4c9d8',
      color: 'white',
    },
    {
      backgroundColor: '#cdf567',
      color: 'black',
    },
    {
      backgroundColor: '#ffbc4b',
      color: 'black',
    },
    {
      backgroundColor: '#ffd0d5',
      color: 'black',
    },
    {
      backgroundColor: '#fb7ea8',
      color: 'white',
    },
    {
      backgroundColor: '#ffe818',
      color: 'black',
    },
    {
      backgroundColor: '#171313',
      color: 'white',
    },
  ],
  spacing: 3,
  bouncing: true,
  swing: true,
  rounded: true,
  animate: false,
};

WordSplitter.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
  colors: PropTypes.arrayOf(
    PropTypes.shape({
      backgroundColor: PropTypes.string,
      color: PropTypes.string,
    }),
  ),
  spacing: PropTypes.number,
  bouncing: PropTypes.bool,
  swing: PropTypes.bool,
  rounded: PropTypes.bool,
  animate: PropTypes.bool,
};

export default WordSplitter;
