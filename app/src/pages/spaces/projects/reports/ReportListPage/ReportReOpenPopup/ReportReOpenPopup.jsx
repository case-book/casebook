import React, { useState } from 'react';
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader, Radio, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import './ReportReOpenPopup.scss';
import { TestrunPropTypes } from '@/proptypes';

const testrunOptions = [
  { key: 'testrunReopenCreationType', value: 'REOPEN', label: i18n.t('다시 열기'), description: i18n.t('기존 테스트런을 다시 오픈합니다.') },
  { key: 'testrunReopenCreationType', value: 'COPY', label: i18n.t('테스트런 복사'), description: i18n.t('기존 테스트런을 복사하여, 새 테스트런을 생성합니다.') },
];

const testcaseOptions = [
  { key: 'testrunReopenTestcase', value: 'ALL', label: i18n.t('테스트케이스 유지'), description: i18n.t('기존 테스트런의 테스트케이스를 유지합니다. 모든 테스트 결과가 유지됩니다.') },
  {
    key: 'testrunReopenTestcase',
    value: 'EXCLUDE_PASSED',
    label: i18n.t('성공하지 않은 테스트케이스만 선택'),
    description: i18n.t('실패/테스트불가/미수행 테스트케이스만 선택합니다. 선택된 테스트케이스 결과가 초기화됩니다.'),
  },
];

const testResultOptions = [
  { key: 'testrunReopenTestResult', value: 'MAINTAIN', label: i18n.t('테스트 결과 유지'), description: i18n.t('테스트 결과를 유지합니다.') },
  { key: 'testrunReopenTestResult', value: 'CLEAR_ALL', label: i18n.t('모두 초기화'), description: i18n.t('모든 테스트 결과를 초기화합니다.') },
  {
    key: 'testrunReopenTestResult',
    value: 'CLEAR_EXCLUDE_PASSED',
    label: i18n.t('성공하지 않은 결과 초기화'),
    description: i18n.t('실패/테스트불가/미수행 테스트케이스의 테스트 결과만 초기화합니다.'),
  },
];

const testerOptions = [
  { key: 'testrunReopenTester', value: 'SAME', label: i18n.t('테스터 유지'), description: i18n.t('테스터를 동일하게 유지합니다.') },
  { key: 'testrunReopenTester', value: 'REASSIGN', label: i18n.t('다시 지정'), description: i18n.t('테스터를 다시 지정합니다. 단, 성공한 테스트케이스의 테스터는 변경되지 않습니다.') },
];

function ReportReOpenPopup({ testrun, setOpened, onApply }) {
  const { t } = useTranslation();

  const [isNameEdit, setIsNameEdit] = useState(false);

  const [option, setOption] = useState({
    testrunReopenCreationType: 'COPY',
    testrunReopenTestcase: 'EXCLUDE_PASSED',
    testrunReopenTester: 'SAME',
    testrunReopenTestResult: 'CLEAR_EXCLUDE_PASSED',
    name: testrun.name,
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
          {isNameEdit && (
            <Input
              type="text"
              required
              placeholder="이름"
              value={option.name}
              onChange={val => {
                setOption({ ...option, name: val });
              }}
              minLength={1}
              onKeyUp={e => {
                if (e.key === 'Enter') {
                  setIsNameEdit(false);
                }
              }}
            />
          )}
          {!isNameEdit && <span>{option.name}</span>}
          <Button
            outline
            color="white"
            rounded
            onClick={() => {
              setIsNameEdit(!isNameEdit);
            }}
          >
            <i className="fa-regular fa-pen-to-square" />
          </Button>
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
        {option.testrunReopenCreationType === 'COPY' && (
          <>
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
          </>
        )}
        <Title className="test-result-title" type="h3" marginBottom={false}>
          {t('테스트 결과 초기화')}
        </Title>
        <ul>
          {testResultOptions.map(d => (
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
