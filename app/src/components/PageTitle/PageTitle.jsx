import React from 'react';
import PropTypes from 'prop-types';
import Liner from '@/components/Liner/Liner';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import './PageTitle.scss';

function PageTitle({ className, children, links, control }) {
  const navigate = useNavigate();

  return (
    <div className={`page-title-wrapper g-no-select ${className}`}>
      <div>
        <div
          className="icon"
          onClick={() => {
            navigate(-1);
          }}
        >
          <span>
            <i className="fa-solid fa-chevron-left" />
          </span>
        </div>
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
                      <Liner className="page-title-liner" display="inline-block" width="1px" height="10px" color="light" margin="0 0.5rem" />
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
};

PageTitle.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  links: PropTypes.arrayOf(PropTypes.node),
  control: PropTypes.node,
};

export default observer(PageTitle);
