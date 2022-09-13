import React from 'react';
import PropTypes from 'prop-types';
import Liner from '@/components/Liner/Liner';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button/Button';
import useStores from '@/hooks/useStores';
import { observer } from 'mobx-react';
import './PageTitle.scss';

function PageTitle({ className, children, links, control }) {
  const navigate = useNavigate();

  const {
    controlStore: { mobileMenuOpened, setMobileMenuOpen },
  } = useStores();

  return (
    <div className={`page-title-wrapper ${className}`}>
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
            <Liner display="inline-block" width="1px" height="10px" color="light" margin="0 0.5rem" />
            {links.map((d, inx) => {
              return (
                <React.Fragment key={inx}>
                  <div>{d}</div>
                  {inx !== links.length - 1 && (
                    <div>
                      <Liner display="inline-block" width="1px" height="10px" color="light" margin="0 0.5rem" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
        {control && <div className="control">{control}</div>}
        <div className="menu-button">
          <Button
            size="sm"
            color="white"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpened);
            }}
          >
            <i className="fal fa-bars" />
          </Button>
        </div>
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
