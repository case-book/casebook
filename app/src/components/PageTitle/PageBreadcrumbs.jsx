import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Liner, PathIcon } from '@/components';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import './PageBreadcrumbs.scss';

function PageBreadcrumbs({ className, breadcrumbs, onListClick }) {
  const { t } = useTranslation();
  return (
    <div className={classNames('page-breadcrumbs-wrapper', className)}>
      {breadcrumbs?.length > 0 && (
        <ul className="breadcrumbs">
          {breadcrumbs.map((info, inx) => {
            return (
              <li key={inx}>
                <Link to={info.to}>{info.text}</Link>
                {breadcrumbs.length - 1 > inx && (
                  <span className="bullet">
                    <PathIcon size="xs" />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {onListClick && (
        <>
          <Liner width="1px" height="10px" display="inline-block" color="gray" margin="0 4px" />
          <div
            className="list-icon"
            onClick={() => {
              onListClick();
            }}
            data-tip={t('상위 페이지로')}
          >
            <span>
              <i className="fa-solid fa-arrow-up-from-ground-water" />
            </span>
          </div>
        </>
      )}
    </div>
  );
}

PageBreadcrumbs.defaultProps = {
  className: '',
  breadcrumbs: [],
  onListClick: null,
};

PageBreadcrumbs.propTypes = {
  className: PropTypes.string,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string,
      text: PropTypes.string,
    }),
  ),
  onListClick: PropTypes.func,
};

export default PageBreadcrumbs;
