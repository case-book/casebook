import React from 'react';
import { Radio } from '@/components';
import PropTypes from 'prop-types';
import { TestcaseGroupSettingPropTypes } from '@/proptypes';
import './TestcaseNavigatorSetting.scss';

function TestcaseGroup({ setting, onChangeSetting, onClose }) {
  return (
    <>
      {setting.show && <div className="testcase-group-setting-setting-overlay-wrapper" onClick={onClose} />}
      {setting.show && (
        <div className="testcase-group-setting-wrapper">
          <div className="arrow">
            <div />
          </div>
          <div className="setting-title">컬럼 설정</div>
          <div className="setting-category">
            <div className="title">테스트케이스 그룹</div>
            <ul>
              {Object.keys(setting.testcaseGroupColumns).map(key => {
                return (
                  <li key={key}>
                    <div className="label">{setting.testcaseGroupColumns[key].name}</div>
                    <div>
                      <Radio
                        size="xs"
                        value={key}
                        checked={setting.testcaseGroupColumns[key].show}
                        onChange={val => {
                          onChangeSetting('testcaseGroupColumns', val, true);
                        }}
                        label="Y"
                      />
                      <Radio
                        size="xs"
                        value={key}
                        checked={!setting.testcaseGroupColumns[key].show}
                        onChange={val => {
                          onChangeSetting('testcaseGroupColumns', val, false);
                        }}
                        label="N"
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="setting-category last">
            <div className="title">테스트케이스</div>
            <ul>
              {Object.keys(setting.testcaseColumns).map(key => {
                return (
                  <li key={key}>
                    <div className="label">{setting.testcaseColumns[key].name}</div>
                    <div>
                      <Radio
                        size="xs"
                        value={key}
                        checked={setting.testcaseColumns[key].show}
                        onChange={val => {
                          onChangeSetting('testcaseColumns', val, true);
                        }}
                        label="Y"
                      />
                      <Radio
                        size="xs"
                        value={key}
                        checked={!setting.testcaseColumns[key].show}
                        onChange={val => {
                          onChangeSetting('testcaseColumns', val, false);
                        }}
                        label="N"
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

TestcaseGroup.defaultProps = {
  setting: {},
};

TestcaseGroup.propTypes = {
  onChangeSetting: PropTypes.func.isRequired,
  setting: TestcaseGroupSettingPropTypes,
  onClose: PropTypes.func.isRequired,
};

export default TestcaseGroup;
