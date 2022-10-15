import React from 'react';
import './Loader.scss';

function Loader() {
  return (
    <div className="loader-wrapper">
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

Loader.defaultProps = {};

Loader.propTypes = {};

export default Loader;
