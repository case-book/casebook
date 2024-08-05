import React from 'react';
import PropTypes from 'prop-types';
import useStores from '@/hooks/useStores';
import { observer } from 'mobx-react';
import './Page.scss';

function Page({ className, children, colored }) {
  const {
    themeStore: { theme },
  } = useStores();

  return <div className={`page-wrapper ${className} ${colored ? 'colored' : ''} theme-${theme}`}>{children}</div>;
}

Page.defaultProps = {
  className: '',
  children: '',
  colored: false,
};

Page.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  colored: PropTypes.bool,
};

export default observer(Page);
