import React from 'react';
import { observer } from 'mobx-react';
import useStores from '@/hooks/useStores';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { Liner } from '@/components';
import { MENUS } from '@/constants/menu';
import { useTranslation } from 'react-i18next';
import './Menu.scss';

function ProjectMenu({ className }) {
  const {
    userStore: { isLogin },
    themeStore: { theme },
    contextStore: { spaceCode, projectId, isProjectSelected },
    controlStore: { hideHeader },
  } = useStores();

  const location = useLocation();

  const { t } = useTranslation();

  return (
    <ul className={`menu-wrapper common-menu-wrapper ${className} ${hideHeader ? 'collapsed' : ''}`}>
      {MENUS.filter(d => d.pc)
        .filter(d => d.project === isProjectSelected)
        .filter(d => !d.admin)
        .filter(d => d.login === undefined || d.login === isLogin)
        .map((d, inx) => {
          let isSelected = false;
          if (d.project) {
            isSelected = location.pathname === `/spaces/${spaceCode}/projects/${projectId}${d.to}`;
          }

          if (!isSelected && d.selectedAlias) {
            isSelected = d.selectedAlias.reduce((p, c) => {
              return p || c.test(location.pathname);
            }, false);
          }

          if (!isSelected) {
            isSelected = location.pathname === d.to;
          }

          return (
            <li
              key={inx}
              className={isSelected ? 'selected' : ''}
              style={{
                animationDelay: `${inx * 0.1}s`,
              }}
            >
              <Link to={d.project ? `/spaces/${spaceCode}/projects/${projectId}${d.to}` : d.to}>
                <span className="text">
                  {t(`메뉴.${d.name}`)}
                  <span />
                </span>
              </Link>
              <div className="cursor">
                <div />
              </div>
              <Liner className="liner" display="inline-block" width="1px" height="10px" color={theme === 'LIGHT' ? 'black' : 'white'} margin="0 10px" />
            </li>
          );
        })}
    </ul>
  );
}

ProjectMenu.defaultProps = {
  className: '',
};

ProjectMenu.propTypes = {
  className: PropTypes.string,
};

export default observer(ProjectMenu);
