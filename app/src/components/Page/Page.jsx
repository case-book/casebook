import React from 'react';
import PropTypes from 'prop-types';
import useStores from '@/hooks/useStores';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import './Page.scss';

function Page({ className, children, colored, border, rounded, marginBottom }) {
  const {
    themeStore: { theme },
  } = useStores();

  return <div className={classNames('page-wrapper', className, `theme-${theme}`, { colored, border, rounded, 'margin-bottom': marginBottom })}>{children}</div>;
}

Page.defaultProps = {
  className: '',
  children: '',
  colored: false,
  border: false,
  rounded: false,
  marginBottom: false,
};

Page.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  colored: PropTypes.bool,
  border: PropTypes.bool,
  rounded: PropTypes.bool,
  marginBottom: PropTypes.bool,
};

export default observer(Page);
