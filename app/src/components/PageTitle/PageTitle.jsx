import React from 'react';
import PropTypes from 'prop-types';
import Liner from '@/components/Liner/Liner';
import { observer } from 'mobx-react';
import './PageTitle.scss';
import { useNavigate } from 'react-router-dom';
import PageBreadcrumbs from '@/components/PageTitle/PageBreadcrumbs';
import useMenu from '@/hooks/useMenu';

function PageTitle({ className, children, links, control, onListClick, breadcrumbs, borderBottom, marginBottom }) {
  const navigate = useNavigate();
  const { menu, submenu } = useMenu();

  return (
    <>
      <PageBreadcrumbs breadcrumbs={breadcrumbs} onListClick={onListClick} />
      <div className={`page-title-wrapper g-no-select ${className} ${borderBottom ? 'border-bottom' : ''} ${marginBottom ? 'margin-bottom' : ''}`}>
        <div>
          <div className="menu-icon">
            <span>
              <span>{submenu?.icon || menu?.icon || <i className="fa-solid fa-book" />}</span>
            </span>
          </div>
          <div className="page-title-info">
            <div className="page-title-text">{children}</div>
          </div>
          {links?.length > 0 && (
            <ul className="links">
              {links.map((d, inx) => {
                return (
                  <li key={inx}>
                    <button
                      onClick={() => {
                        navigate(d.to);
                      }}
                    >
                      <span>{d.text}</span>
                      <span className="icon">{d.icon || <i className="fa-solid fa-arrow-right" />}</span>
                    </button>
                    {links.length - 1 > inx && <Liner display="inline-block" width="1px" height="12px" color="light" margin="0 5px" />}
                  </li>
                );
              })}
            </ul>
          )}
          {control && <div className={`control ${links ? 'has-link' : ''}`}>{control}</div>}
        </div>
      </div>
    </>
  );
}

PageTitle.defaultProps = {
  className: '',
  children: '',
  links: null,
  control: null,
  onListClick: null,
  breadcrumbs: [],
  borderBottom: true,
  marginBottom: true,
};

PageTitle.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string,
      text: PropTypes.string,
    }),
  ),
  control: PropTypes.node,
  onListClick: PropTypes.func,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string,
      text: PropTypes.string,
    }),
  ),

  borderBottom: PropTypes.bool,
  marginBottom: PropTypes.bool,
};

export default observer(PageTitle);
