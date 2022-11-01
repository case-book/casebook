import React from 'react';
import './Loader.scss';
import PropTypes from 'prop-types';

function Loader({ color }) {
  return (
    <div className={`loader-wrapper color-${color}`}>
      <div>
        <div className="lds-facebook">
          <div />
          <div />
          <div />
        </div>
      </div>
    </div>
  );
}

Loader.defaultProps = {
  color: '',
};

Loader.propTypes = {
  color: PropTypes.string,
};

export default Loader;
