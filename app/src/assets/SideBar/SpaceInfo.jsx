/* eslint-disable react/no-unknown-property */
import React, { useState } from 'react';
import { observer } from 'mobx-react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import useStores from '@/hooks/useStores';
import { SpacePropTypes } from '@/proptypes';
import { useNavigate } from 'react-router-dom';
import SelectSpacePopup from '@/assets/SideBar/SelectSpacePopup/SelectSpacePopup';
import { useTranslation } from 'react-i18next';
import SideBarMiniButton from '@/assets/SideBar/SideBarMiniButton';
import './SpaceInfo.scss';

function SpaceInfo({ className, spaces }) {
  const {
    contextStore: { space },
  } = useStores();

  const navigate = useNavigate();
  const { t } = useTranslation();
  const [spaceSelectorOpened, setSpaceSelectorOpened] = useState(false);

  return (
    <div className={classNames('space-info-wrapper', className)}>
      <div className="label">
        <div>SPACE</div>
        <div>
          <SideBarMiniButton
            tooltip={t('스페이스 검색')}
            onClick={() => {
              navigate('/spaces/search');
            }}
          >
            <i className="fa-solid fa-magnifying-glass" />
          </SideBarMiniButton>
          <SideBarMiniButton
            tooltip={t('새 스페이스')}
            onClick={() => {
              navigate('/spaces/new');
            }}
          >
            <i className="fa-solid fa-plus" />
          </SideBarMiniButton>
        </div>
      </div>
      <div className="space-info">
        <button
          className="space-selector-button"
          type="button"
          data-tip={t('스페이스 선택')}
          onClick={() => {
            setSpaceSelectorOpened(!spaceSelectorOpened);
          }}
        >
          <i className="fa-solid fa-arrow-right-arrow-left" />
        </button>
        {space && (
          <>
            <span className="space-name">
              <span onClick={() => navigate(`/spaces/${space.code}/info`)}>{space?.name}</span>
            </span>
            <span className="space-short-name">
              <span onClick={() => navigate(`/spaces/${space.code}/info`)}>{space?.name[0]}</span>
            </span>
          </>
        )}
        {!space && (
          <span className="no-space-name">
            <span>NO SPACE</span>
          </span>
        )}
      </div>
      {spaceSelectorOpened && <SelectSpacePopup spaces={spaces} setOpened={opened => setSpaceSelectorOpened(opened)} />}
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
