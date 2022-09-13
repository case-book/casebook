import React from 'react';
import PropTypes from 'prop-types';
import './Page.scss';
import useStores from '@/hooks/useStores';

function Page({ className, children, padding, colored, fill, ...last }) {
  const {
    themeStore: { theme },
  } = useStores();

  return (
    <div
      className={`page-wrapper ${className} ${colored ? 'colored' : ''} ${fill ? 'fill' : ''} theme-${theme}`}
      style={{
        padding,
        ...last?.style,
      }}
    >
      {children}
    </div>
  );
}

Page.defaultProps = {
  className: '',
  padding: '',
  children: '',
  colored: false,
  fill: false,
};

Page.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  padding: PropTypes.string,
  colored: PropTypes.bool,
  fill: PropTypes.bool,
};

export default Page;
