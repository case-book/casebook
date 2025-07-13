import React from 'react';
import { observer } from 'mobx-react';
import useStores from '@/hooks/useStores';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import './SpaceMenu.scss';

const SPACE_MENU = [
  {
    name: '시작하기',
    to: '/start',
    icon: <i className="fa-solid fa-ranking-star" />,
  },
  {
    name: '스페이스 생성',
    to: '/spaces/new',
    icon: <i className="fa-solid fa-plus" />,
  },
  {
    name: '스페이스 검색',
    to: '/spaces/search',
    icon: <i className="fa-solid fa-magnifying-glass" />,
  },
];

function SpaceMenu({ className }) {
  const {
    contextStore: { isProjectSelected, collapsed, setHoverMenu },
  } = useStores();

  const location = useLocation();

  const { t } = useTranslation();

  const onMenuMouseEnter = d => {
    setHoverMenu(t(`메뉴.${d.name}`));
  };

  const onMenuMouseLeave = () => {
    setHoverMenu(null);
  };

  return (
    <ul className={classNames('space-menu-wrapper', className, { collapsed }, { 'project-selected': isProjectSelected })}>
      {SPACE_MENU.map((d, inx) => {
        return (
          <li key={inx} className={classNames({ selected: location.pathname === d.to })}>
            <Link to={d.to} onMouseEnter={() => onMenuMouseEnter(d)} onMouseLeave={() => onMenuMouseLeave()}>
              <div className="menu-icon">{d.icon}</div>
              <div className="text">
                {t(`메뉴.${d.name}`)}
                <span />
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

SpaceMenu.defaultProps = {
  className: '',
};

SpaceMenu.propTypes = {
  className: PropTypes.string,
};

export default observer(SpaceMenu);
