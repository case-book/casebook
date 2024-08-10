import React, { useState } from 'react';
import { Button, Info, Modal, ModalBody, ModalFooter, ModalHeader, Radio, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import './ReportReOpenPopup.scss';
import { TestrunPropTypes } from '@/proptypes';

const testcaseOptions = [
  { key: 'testrunReopenTestcase', value: 'ALL', label: i18n.t('테스트케이스 유지'), description: i18n.t('기존 테스트런의 테스트케이스를 유지합니다. 모든 테스트 결과가 유지됩니다.') },
  {
    key: 'testrunReopenTestcase',
    value: 'EXCLUDE_PASSED',
    label: i18n.t('성공한 테스트케이스 제외'),
    description: i18n.t('실패/테스트불가/미수행 테스트케이스만 선택합니다. 선택된 테스트케이스 결과가 초기화됩니다.'),
  },
];

const testrunOptions = [
  { key: 'testrunReopenCreationType', value: 'REOPEN', label: i18n.t('다시 열기'), description: i18n.t('기존 테스트런을 다시 오픈합니다.') },
  { key: 'testrunReopenCreationType', value: 'COPY', label: i18n.t('새 테스트런'), description: i18n.t('기존 테스트런을 복사하여, 새 테스트런을 생성합니다.') },
];

const testerOptions = [
  { key: 'testrunReopenTester', value: 'SAME', label: i18n.t('테스터 유지'), description: i18n.t('테스터를 동일하게 유지합니다.') },
  { key: 'testrunReopenTester', value: 'REASSIGN', label: i18n.t('다시 지정'), description: i18n.t('테스터를 다시 지정합니다. 단, 성공한 테스트케이스의 테스터는 변경되지 않습니다.') },
];

function ReportReOpenPopup({ testrun, setOpened, onApply }) {
  const { t } = useTranslation();

  const [option, setOption] = useState({
    testrunReopenCreationType: 'COPY',
    testrunReopenTestcase: 'EXCLUDE_PASSED',
    testrunReopenTester: 'SAME',
  });

  return (
    <Modal
      className="report-re-open-popup-wrapper"
      isOpen
      size="lg"
      toggle={() => {
        if (setOpened) {
          setOpened(false);
        }
      }}
    >
      <ModalHeader className="modal-header">
        <span>{t('테스트런 재오픈 옵션')}</span>
      </ModalHeader>
      <ModalBody>
        <div className="testrun-name">
          <i className="fa-solid fa-quote-left" />
          {testrun.name}
          <i className="fa-solid fa-quote-right" />
        </div>
        <Title type="h3" marginBottom={false}>
          {t('테스트런 생성')}
        </Title>
        <ul>
          {testrunOptions.map(d => (
            <li key={d.value}>
              <div className="checker">
                <Radio
                  key={d}
                  size="md"
                  value={d.value}
                  checked={option[d.key] === d.value}
                  onChange={val => {
                    setOption({ ...option, [d.key]: val });
                  }}
                />
              </div>
              <div className="option-name">
                <div className="label">{d.label}</div>
                <div className="description">{d.description}</div>
              </div>
            </li>
          ))}
        </ul>
        <Title className="testcase-title" type="h3" marginBottom={false}>
          {t('테스트케이스 선택')}
        </Title>
        <ul>
          {testcaseOptions.map(d => (
            <li key={d.value}>
              <div className="checker">
                <Radio
                  key={d}
                  size="md"
                  value={d.value}
                  checked={option[d.key] === d.value}
                  onChange={val => {
                    setOption({ ...option, [d.key]: val });
                  }}
                />
              </div>
              <div className="option-name">
                <div className="label">{d.label}</div>
                <div className="description">{d.description}</div>
              </div>
            </li>
          ))}
        </ul>
        {option.testrunReopenCreationType === 'REOPEN' && option.testrunReopenTestcase === 'EXCLUDE_PASSED' && (
          <Info color="danger" className="info-message">
            {t('테스트런을 다시 열면서, 성공한 테스트케이스 제외를 선택하면, 기존 성공한 테스트케이스 항목이 삭제됩니다.')}
          </Info>
        )}
        <Title className="tester-title" type="h3" marginBottom={false}>
          {t('테스터')}
        </Title>
        <ul>
          {testerOptions.map(d => (
            <li key={d.value}>
              <div className="checker">
                <Radio
                  key={d}
                  size="md"
                  value={d.value}
                  checked={option[d.key] === d.value}
                  onChange={val => {
                    setOption({ ...option, [d.key]: val });
                  }}
                />
              </div>
              <div className="option-name">
                <div className="label">{d.label}</div>
                <div className="description">{d.description}</div>
              </div>
            </li>
          ))}
        </ul>
      </ModalBody>
      <ModalFooter>
        <Button outline onClick={() => setOpened(false)}>
          {t('취소')}
        </Button>
        <Button
          color="primary"
          onClick={() => {
            if (onApply) {
              onApply(option);
            }

            if (setOpened) {
              setOpened(false);
            }
          }}
        >
          {t('테스트런 재오픈')}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

ReportReOpenPopup.defaultProps = {};

ReportReOpenPopup.propTypes = {
  setOpened: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  testrun: TestrunPropTypes.isRequired,
};

export default ReportReOpenPopup;
