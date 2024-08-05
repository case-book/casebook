import React, { useState } from 'react';
import { observer } from 'mobx-react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import useStores from '@/hooks/useStores';
import { SpacePropTypes } from '@/proptypes';
import { Link } from 'react-router-dom';
import { Liner } from '@/components';
import './SpaceInfo.scss';

function SpaceInfo({ className, spaces }) {
  const {
    contextStore: { space, setSpace, collapsed },
  } = useStores();

  const { t } = useTranslation();
  const [spaceSelectorOpened, setSpaceSelectorOpened] = useState(false);
  const [spaceMenuOpened, setSpaceMenuOpened] = useState(false);

  return (
    <div className={classNames('space-info-wrapper', className)}>
      <div>
        <div
          className={classNames('space-icon', { collapsed })}
          onClick={() => {
            setSpaceMenuOpened(!spaceMenuOpened);
          }}
        >
          <span>{space?.name && space?.name[0]}</span>
        </div>
      </div>
      {!collapsed && (
        <div className="space-info">
          <span className="space-name" onClick={() => setSpaceMenuOpened(!spaceMenuOpened)}>
            {space?.name}
          </span>
          <span
            className="bullet"
            onClick={() => {
              setSpaceSelectorOpened(!spaceSelectorOpened);
            }}
          >
            {!spaceSelectorOpened && <i className="fa-solid fa-angle-down" />}
            {spaceSelectorOpened && <i className="fa-solid fa-angle-up" />}
          </span>
        </div>
      )}
      {spaceSelectorOpened && (
        <div
          className={classNames('space-popup-menu space-selector')}
          onClick={() => {
            setSpaceSelectorOpened(false);
          }}
        >
          <div>
            <div onClick={e => e.stopPropagation()}>
              <div className="arrow">
                <div />
              </div>
              <ul>
                {spaces.map(info => {
                  return (
                    <li key={info.code}>
                      <Link
                        className="space-selector-item"
                        to={`/spaces/${info.code}/info`}
                        onClick={e => {
                          e.stopPropagation();
                          setSpace(info);
                          setSpaceSelectorOpened(false);
                        }}
                      >
                        <div>
                          <div>{info.name}</div>
                          <div>
                            <i className="fa-solid fa-check-to-slot" />
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
      {spaceMenuOpened && (
        <div
          className={classNames('space-popup-menu', { collapsed })}
          onClick={() => {
            setSpaceMenuOpened(false);
          }}
        >
          <div>
            <div onClick={e => e.stopPropagation()}>
              <div className="arrow">
                <div />
              </div>
              <ul>
                <li>
                  <Link
                    to={`/spaces/${space.code}/info`}
                    onClick={e => {
                      e.stopPropagation();
                    }}
                  >
                    {t('스페이스 정보')}
                  </Link>
                  <Liner width="1px" height="10px" display="inline-block" color="gray" margin="0 4px" />
                  <Link
                    to={`/spaces/${space.code}/edit`}
                    onClick={e => {
                      e.stopPropagation();
                    }}
                  >
                    {t('관리')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/spaces/search"
                    onClick={e => {
                      e.stopPropagation();
                    }}
                  >
                    <i className="fa-solid fa-plus" /> {t('스페이스 검색')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/spaces/new"
                    onClick={e => {
                      e.stopPropagation();
                    }}
                  >
                    <i className="fa-solid fa-plus" /> {t('스페이스 생성')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

SpaceInfo.defaultProps = {
  className: '',
  spaces: [],
};

SpaceInfo.propTypes = {
  className: PropTypes.string,
  spaces: PropTypes.arrayOf(SpacePropTypes),
};

export default observer(SpaceInfo);
