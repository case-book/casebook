import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Liner, Selector } from '@/components';

import { observer } from 'mobx-react';
import './TestcaseNavigatorControl.scss';
import TestcaseNavigatorFilter from './TestcaseNavigatorFilter';

function TestcaseNavigatorControl({
  className,
  onClickAllOpen,
  user,
  users,
  userFilter,
  onChangeUserFilter,
  addTestcase,
  addTestcaseGroup,
  selectedItemInfo,
  width,
  testcaseFilter,
  onChangeTestcaseFilter,
}) {
  const { t } = useTranslation();

  const [filterOpened, setFilterOpened] = useState(false);

  return (
    <div className={`testcase-navigator-control-wrapper ${className}`}>
      <div className="testcase-manage-button">
        <div className="left">
          <div className="controller">
            <div>
              <div className="bg" />
              <span className="controller-button start-button">
                <i className="fa-solid fa-gamepad" />
              </span>

              <div className="vertical">
                <span
                  className="controller-button"
                  onClick={() => {
                    onClickAllOpen(false);
                  }}
                >
                  <div className="all-open-toggle">
                    <div className="tree-icon">
                      <i className="fa-solid fa-folder-minus" />
                    </div>
                    <div className="all-text">
                      <span>ALL</span>
                    </div>
                  </div>
                </span>
                <span className="controller-button center-button" />
                <span
                  className="controller-button"
                  onClick={() => {
                    onClickAllOpen(true);
                  }}
                >
                  <div className="all-open-toggle">
                    <div className="tree-icon">
                      <i className="fa-solid fa-folder-plus" />
                    </div>
                    <div className="all-text">
                      <span>ALL</span>
                    </div>
                  </div>
                </span>
              </div>
            </div>
          </div>
          <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 0.5rem" />
          <div className="filter">
            <Button
              size="xs"
              onClick={() => {
                setFilterOpened(!filterOpened);
              }}
              color="white"
            >
              <i className="fa-solid fa-filter" /> <span className="button-text">{t('필터')}</span>
            </Button>
          </div>
        </div>
        {user && (
          <div className="navigation-filter">
            <div className="label">{t('테스터')}</div>
            <div>
              <Button
                size="xs"
                className="my-button"
                onClick={() => {
                  if (onChangeUserFilter) {
                    onChangeUserFilter(user.id);
                  }
                }}
              >
                MY
              </Button>
              <Selector
                className="selector"
                size="xs"
                items={[
                  {
                    userId: '',
                    name: t('전체'),
                  },
                ]
                  .concat(users)
                  .map(d => {
                    return {
                      key: d.userId,
                      value: d.name,
                    };
                  })}
                value={userFilter}
                onChange={val => {
                  onChangeUserFilter(val);
                }}
              />
            </div>
          </div>
        )}
        {addTestcase && addTestcaseGroup && (
          <div className={`navigation-controller ${width < 310 ? 'small-control' : ''} ${width < 160 ? 'smaller-control' : ''}`}>
            {addTestcaseGroup && (
              <Button
                size="xs"
                onClick={() => {
                  addTestcaseGroup(true);
                }}
                color="white"
              >
                <i className="fa-solid fa-folder-plus" /> <span className="button-text">{t('그룹')}</span>
              </Button>
            )}
            <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 0.5rem" />
            <Button
              className="add-testcase-button"
              size="xs"
              onClick={() => {
                addTestcase(true);
              }}
              disabled={!selectedItemInfo.type}
              color="white"
            >
              <i className="small-icon fa-solid fa-plus" />
              <i className="fa-solid fa-flask" /> <span className="button-text">{t('테스트케이스')}</span>
            </Button>
          </div>
        )}
      </div>
      {filterOpened && (
        <div className="testcase-navigator-filter">
          <TestcaseNavigatorFilter setOpened={setFilterOpened} onChangeTestcaseFilter={onChangeTestcaseFilter} testcaseFilter={testcaseFilter} width={width} />
        </div>
      )}
    </div>
  );
}

TestcaseNavigatorControl.defaultProps = {
  className: '',
  user: null,
  users: [],
  addTestcase: null,
  addTestcaseGroup: null,
  userFilter: null,
  onChangeUserFilter: null,
  width: null,
};

TestcaseNavigatorControl.propTypes = {
  className: PropTypes.string,
  onClickAllOpen: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
  }),
  users: PropTypes.arrayOf(
    PropTypes.shape({
      userId: PropTypes.number,
      name: PropTypes.string,
    }),
  ),
  userFilter: PropTypes.string,
  onChangeUserFilter: PropTypes.func,
  addTestcase: PropTypes.func,
  addTestcaseGroup: PropTypes.func,
  selectedItemInfo: PropTypes.shape({
    type: PropTypes.string,
  }).isRequired,
  width: PropTypes.number,
  testcaseFilter: PropTypes.shape({
    words: PropTypes.arrayOf(PropTypes.string),
    releaseIds: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  onChangeTestcaseFilter: PropTypes.func.isRequired,
};

export default observer(TestcaseNavigatorControl);
