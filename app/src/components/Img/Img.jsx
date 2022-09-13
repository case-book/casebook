import React from 'react';
import PropTypes from 'prop-types';
import './Img.scss';

function Img({ className, alt, src, errorIcon }) {
  return (
    <div className={`${className} img-wrapper`}>
      <img
        src={src}
        alt={alt}
        onError={e => {
          if (e.target.parentNode) {
            if (!e.target.parentNode.classList.contains('no-image')) {
              e.target.parentNode.classList.add('no-image');
            }
          }
        }}
      />
      {errorIcon && (
        <div className="icon">
          <span>
            <span>{errorIcon}</span>
          </span>
        </div>
      )}
    </div>
  );
}

Img.defaultProps = {
  className: '',
  alt: '',
  src: '',
  errorIcon: <i className="fal fa-flag-alt" />,
};

Img.propTypes = {
  className: PropTypes.string,
  alt: PropTypes.string,
  src: PropTypes.string,
  errorIcon: PropTypes.node,
};

export default Img;
