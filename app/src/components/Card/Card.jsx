import React from 'react';
import PropTypes from 'prop-types';
import './Card.scss';

function Card({ className, children, onClick, color, point, circle, border, shadow }) {
  return (
    <div
      className={`card-wrapper ${className} color-${color} ${onClick ? 'clickable' : ''} ${border ? 'border' : ''} ${shadow ? 'shadow' : ''}`}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      {circle && (
        <div className="card-background">
          <div className="circle circle-1" />
          <div className="circle circle-2" />
        </div>
      )}
      {point && <div className="point point-1" />}
      {point && <div className="point point-2" />}
      {children}
    </div>
  );
}

Card.defaultProps = {
  className: '',
  onClick: null,
  color: 'white',
  point: false,
  circle: false,
  border: false,
  shadow: true,
};

Card.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  color: PropTypes.string,
  point: PropTypes.bool,
  circle: PropTypes.bool,
  border: PropTypes.bool,
  shadow: PropTypes.bool,
};

export default Card;
