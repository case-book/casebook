import React from 'react';
import PropTypes from 'prop-types';
import Liner from '@/components/Liner/Liner';
import { observer } from 'mobx-react';
import './PageTitle.scss';

function PageTitle({ className, children, links, control, onListClick }) {
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
        <div className="title-text">{children}</div>
        {links && (
          <div className="links">
            <Liner className="page-title-liner" display="inline-block" width="1px" height="12px" color="white" margin="0 1rem" />
            {links.map((d, inx) => {
              return (
                <React.Fragment key={inx}>
                  <div>{d}</div>
                  {inx !== links.length - 1 && (
                    <div>
                      <Liner className="page-title-liner" display="inline-block" width="1px" height="12px" color="light" margin="0 1rem" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
        {control && <div className={`control ${links ? 'has-link' : ''}`}>{control}</div>}
      </div>
    </div>
  );
}

PageTitle.defaultProps = {
  className: '',
  children: '',
  links: null,
  control: null,
  onListClick: null,
};

PageTitle.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  links: PropTypes.arrayOf(PropTypes.node),
  control: PropTypes.node,
  onListClick: PropTypes.func,
};

export default observer(PageTitle);
