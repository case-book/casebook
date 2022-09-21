import React from 'react';
import PropTypes from 'prop-types';
import './Card.scss';

function Card({ className, children, onClick, color, point, circle }) {
  return (
    <div
      className={`card-wrapper ${className} color-${color}`}
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
      <div className="card-content">{children}</div>
    </div>
  );
}

Card.defaultProps = {
  className: '',
  onClick: null,
  color: 'white',
  point: false,
  circle: false,
};

Card.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  color: PropTypes.string,
  point: PropTypes.bool,
  circle: PropTypes.bool,
};

export default Card;
