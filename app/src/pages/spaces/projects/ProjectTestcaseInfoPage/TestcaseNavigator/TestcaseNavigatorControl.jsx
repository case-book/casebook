import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Liner, Selector } from '@/components';

import './TestcaseNavigatorControl.scss';

function TestcaseNavigatorControl({ className, min, setMin, onClickAllOpen, user, users, userFilter, onChangeUserFilter, addTestcase, addTestcaseGroup, selectedItemInfo, width }) {
  const { t } = useTranslation();

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
              {!min && (
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
              )}
              <div className="horizontal">
                <span
                  className="controller-button"
                  onClick={() => {
                    setMin(true);
                  }}
                >
                  <i className="fa-solid fa-minimize" />
                </span>
                <span className="controller-button center-button" />
                <span
                  className="controller-button"
                  onClick={() => {
                    setMin(false);
                  }}
                >
                  <i className="fa-solid fa-maximize" />
                </span>
              </div>
            </div>
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
                  onChangeUserFilter(user.id);
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
          <div className={`navigation-controller ${width < 260 ? 'small-control' : ''} ${width < 160 ? 'smaller-control' : ''}`}>
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
    </div>
  );
}

TestcaseNavigatorControl.defaultProps = {
  className: '',
  user: null,
  users: [],
  addTestcase: null,
  addTestcaseGroup: null,
};

TestcaseNavigatorControl.propTypes = {
  className: PropTypes.string,
  min: PropTypes.bool.isRequired,
  setMin: PropTypes.func.isRequired,
  onClickAllOpen: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  user: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  users: PropTypes.array,
  userFilter: PropTypes.string.isRequired,
  onChangeUserFilter: PropTypes.func.isRequired,
  addTestcase: PropTypes.func,
  addTestcaseGroup: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  selectedItemInfo: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
};

export default TestcaseNavigatorControl;
