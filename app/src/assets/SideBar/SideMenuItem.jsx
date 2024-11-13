import React from 'react';
import * as PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { Link, useNavigate } from 'react-router-dom';
import './SideMenuItem.scss';
import useStores from '@/hooks/useStores';
import SideOverlayMenu from '@/assets/SideBar/SideOverlayMenu/SideOverlayMenu';

function SideMenuItem({ className, text, to, icon, inx, list, projectRequired, selected, onClick, badge, type }) {
  const {
    contextStore: { setHoverMenu, spaceCode, projectId, collapsed, setProjectSelector },
  } = useStores();

  const navigate = useNavigate();

  const onSubMenuClick = (subMenu, e) => {
    e.preventDefault();
    if (projectRequired) {
      if (!projectId) {
        setProjectSelector(`/spaces/${spaceCode}/projects/{{PROJECT_ID}}${to}${subMenu.to}`);
        return;
      }

      navigate(`/spaces/${spaceCode}/projects/${projectId}${to}${subMenu.to}`);
    } else {
      navigate(`${to}${subMenu.to}`);
    }
  };

  const onMenuClick = e => {
    e.preventDefault();
    if (projectRequired) {
      if (!projectId) {
        setProjectSelector(`/spaces/${spaceCode}/projects/{{PROJECT_ID}}${to}`);
        return;
      }
      navigate(`/spaces/${spaceCode}/projects/${projectId}${to}`);
    } else {
      navigate(to);
    }
  };

  return (
    <div
      className={classNames('side-menu-item-wrapper', className, { selected })}
      onMouseEnter={() => {
        setHoverMenu(text);
      }}
      onMouseLeave={() => {
        setHoverMenu(null);
      }}
      style={{
        animationDelay: `${inx * 0.05}s`,
      }}
    >
      <div className="bg">
        <div className="arrow">
          <i className="fa-solid fa-angle-right" />
        </div>
      </div>
      <div className="line" />
      <Link
        to={to || '#'}
        onClick={e => {
          if (onClick) {
            onClick(e);
          } else {
            onMenuClick(e);
          }
        }}
      >
        {type === 'tree' && (
          <div className="tree-icon">
            <div className="line-1" />
            <div className="line-2" />
          </div>
        )}
        {icon && <div className="menu-icon">{icon}</div>}
        <div className="text">
          <span className="test-span">{text}</span>
          {badge > 0 && (
            <span className="badge-count">
              <span>{badge}</span>
            </span>
          )}
        </div>
      </Link>
      {list?.length > 0 && (
        <SideOverlayMenu className="sub-menu">
          <ul>
            {list?.map(info => {
              return (
                <li key={info.key}>
                  <Link
                    to={projectRequired ? `/spaces/${spaceCode}/projects/${projectId}${to}${info.to}` : `${to}${info.to}`}
                    onClick={e => onSubMenuClick(info, e)}
                    onMouseEnter={() => setHoverMenu(info.name)}
                    onMouseLeave={() => setHoverMenu(null)}
                  >
                    <div className="menu-icon">{info.icon}</div>
                    {!collapsed && <div className="text">{info.name}</div>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </SideOverlayMenu>
      )}
    </div>
  );
}

SideMenuItem.defaultProps = {
  className: '',
  to: null,
  icon: null,
  inx: 0,
  list: [],
  projectRequired: false,
  selected: false,
  onClick: null,
  badge: 0,
  type: null,
};

SideMenuItem.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string.isRequired,
  to: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.node,
  inx: PropTypes.number,
  type: PropTypes.oneOf(['tree']),
  list: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      icon: PropTypes.node,
      to: PropTypes.string,
    }),
  ),
  projectRequired: PropTypes.bool,
  selected: PropTypes.bool,
  badge: PropTypes.number,
};

export default observer(SideMenuItem);
