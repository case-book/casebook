import React from 'react';
import PropTypes from 'prop-types';
import Liner from '@/components/Liner/Liner';
import { observer } from 'mobx-react';
import './PageTitle.scss';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components';

function PageTitle({ className, name, children, links, control, onListClick, breadcrumbs }) {
  const navigate = useNavigate();

  return (
    <div className={`page-title-wrapper g-no-select ${className}`}>
      <div>
        {onListClick && (
          <div
            className="icon"
            onClick={() => {
              onListClick();
            }}
          >
            <span>
              <i className="fa-solid fa-list" />
            </span>
          </div>
        )}
        {name && <div className="page-name">[{name}]</div>}
        <div className="page-title-info">
          <div className="page-title-text">{children}</div>
          {breadcrumbs?.length > 0 && (
            <ul className="breadcrumbs">
              {breadcrumbs.map((info, inx) => {
                return (
                  <li key={inx}>
                    <Link to={info.to}>{info.text}</Link>
                    {breadcrumbs.length - 1 > inx && <span className="bullet">&gt;</span>}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {links?.length > 0 && (
          <ul className="links">
            {links.map((d, inx) => {
              return (
                <li key={inx}>
                  <Button
                    color={d.color || 'white'}
                    onClick={() => {
                      navigate(d.to);
                    }}
                  >
                    {d.text}
                  </Button>
                  {links.length - 1 > inx && <Liner display="inline-block" width="1px" height="12px" color="light" margin="0 5px" />}
                </li>
              );
            })}
          </ul>
        )}
        {control && <div className={`control ${links ? 'has-link' : ''}`}>{control}</div>}
      </div>
    </div>
  );
}

PageTitle.defaultProps = {
  className: '',
  name: null,
  children: '',
  links: null,
  control: null,
  onListClick: null,
  breadcrumbs: [],
};

PageTitle.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
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
};

export default observer(PageTitle);
