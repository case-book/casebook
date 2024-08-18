import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Radio } from '@/components';
import './UserRandomChangeDialog.scss';
import { TESTER_CHANGE_REASONS, TESTER_CHANGE_TARGETS } from '@/constants/constants';

function UserRandomChangeDialog({ className, setOpened, onChange, currentUser, targetId }) {
  const { t } = useTranslation();
  const buttonElement = useRef(null);
  const [userChangeInfo, setUserChangeInfo] = useState({
    reason: TESTER_CHANGE_REASONS[0].key,
    target: TESTER_CHANGE_TARGETS[0].key,
  });

  const onKeyDown = e => {
    if (e.keyCode === 27) {
      setOpened(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    if (buttonElement.current) {
      buttonElement.current.focus();
    }

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  });

  return (
    <Modal className={`${className} user-random-change-dialog-wrapper`} isOpen>
      <ModalHeader
        className="modal-header"
        onClose={() => {
          setOpened(false);
        }}
      >
        {t('테스터 변경')}
      </ModalHeader>
      <ModalBody>
        {currentUser && <div>{t('테스터 @을(를) 테스트런에 참여중인 랜덤한 사용자로 변경합니다.', { userName: currentUser?.name })}</div>}
        {!currentUser && <div>{t('테스터가 지정되어 있지 않은 테스트케이스를 테스트런에 참여중인 랜덤한 사용자로 변경합니다.')}</div>}
        <div className="sub-title">{t('변경 사유')}</div>
        <ul>
          {TESTER_CHANGE_REASONS.map(d => {
            return (
              <li key={d.key}>
                <Radio
                  label={d.value}
                  value={userChangeInfo.reason}
                  checked={userChangeInfo.reason === d.key}
                  onChange={() => {
                    setUserChangeInfo({
                      ...userChangeInfo,
                      reason: d.key,
                    });
                  }}
                />
              </li>
            );
          })}
        </ul>
        <div className="sub-title">{t('변경 대상')}</div>
        <ul>
          {TESTER_CHANGE_TARGETS.map(d => {
            return (
              <li key={d.key}>
                <Radio
                  label={d.value}
                  value={userChangeInfo.target}
                  checked={userChangeInfo.target === d.key}
                  onChange={() => {
                    setUserChangeInfo({
                      ...userChangeInfo,
                      target: d.key,
                    });
                  }}
                />
              </li>
            );
          })}
        </ul>
      </ModalBody>
      <ModalFooter>
        <Button
          outline
          onClick={() => {
            setOpened(false);
          }}
        >
          {t('취소')}
        </Button>
        <Button
          ref={buttonElement}
          color="primary"
          onClick={() => {
            onChange(currentUser?.userId, targetId, userChangeInfo.target, TESTER_CHANGE_REASONS.find(d => d.key === userChangeInfo.reason).value);
            setOpened(false);
          }}
        >
          {t('변경')}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

UserRandomChangeDialog.defaultProps = {
  className: '',
  setOpened: null,
  currentUser: null,
};

UserRandomChangeDialog.propTypes = {
  className: PropTypes.string,
  setOpened: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    userId: PropTypes.number,
    name: PropTypes.string,
  }),
  targetId: PropTypes.number.isRequired,
};

export default UserRandomChangeDialog;
