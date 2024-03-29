import React, { useEffect } from 'react';
import useStores from '@/hooks/useStores';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from '@/components';
import './CommonDialog.scss';

function ConfirmDialog({ className, category, title, message, okHandler, noHandler, okText, noText, okColor }) {
  const { t } = useTranslation();
  const { controlStore } = useStores();

  const onKeyDown = e => {
    if (e.keyCode === 27) {
      controlStore.setConfirm(null);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  });

  return (
    <Modal
      className={`common-dialog-wrapper confirm-dialog-wrapper ${className} ${category}`}
      isOpen
      toggle={() => {
        controlStore.setConfirm(null);
      }}
    >
      <ModalHeader className="modal-header">
        <span className="title">
          <span className={`dialog-icon ${category}`}>
            {category === MESSAGE_CATEGORY.ERROR && <i className="fas fa-exclamation-circle" />}
            {category === MESSAGE_CATEGORY.WARNING && <i className="fas fa-exclamation-circle" />}
            {category === MESSAGE_CATEGORY.INFO && <i className="fas fa-exclamation-circle" />}
          </span>
          <span>{title}</span>
        </span>
      </ModalHeader>
      <ModalBody className="modal-body">
        <div>
          <div>{message}</div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          outline
          onClick={() => {
            if (noHandler) {
              noHandler();
            }
            controlStore.setConfirm(null);
          }}
        >
          {noText || t('취소')}
        </Button>
        <Button
          color={okColor}
          onClick={() => {
            let result = false;
            if (okHandler) {
              result = okHandler();
            }

            if (!result) {
              controlStore.setConfirm(null);
            }
          }}
        >
          {okText || t('확인')}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

ConfirmDialog.defaultProps = {
  className: '',
  category: '',
  title: '',
  message: '',
  okHandler: null,
  noHandler: null,
  okText: '',
  noText: '',
  okColor: 'white',
};

ConfirmDialog.propTypes = {
  className: PropTypes.string,
  category: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  message: PropTypes.oneOfType([PropTypes.node, PropTypes.number, PropTypes.string]),
  okHandler: PropTypes.func,
  noHandler: PropTypes.func,
  okText: PropTypes.string,
  noText: PropTypes.string,
  okColor: PropTypes.string,
};

export default ConfirmDialog;
