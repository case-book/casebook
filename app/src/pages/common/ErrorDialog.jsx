import React, { useEffect } from 'react';
import useStores from '@/hooks/useStores';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from '@/components';
import './CommonDialog.scss';

function ErrorDialog({ className, title, message, okHandler, okText }) {
  const { t } = useTranslation();
  const { controlStore } = useStores();

  const onKeyDown = e => {
    if (e.keyCode === 13 || e.keyCode === 27) {
      controlStore.setError(null);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  });

  return (
    <Modal className={`${className} common-dialog-wrapper WARNING error-dialog`} isOpen>
      <ModalHeader
        className="modal-header"
        onClose={() => {
          controlStore.setError(null);
        }}
      >
        <span className="title">
          <span className="dialog-icon ERROR">
            <i className="fas fa-exclamation-circle" />
          </span>
          <span>{title}</span>
        </span>
      </ModalHeader>
      <ModalBody>
        <div>
          <div>{message}</div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="bottom-liner" />
        <Button
          onClick={() => {
            controlStore.setError(null);
            if (okHandler) {
              okHandler();
            }
          }}
        >
          {okText || t('확인')}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

ErrorDialog.defaultProps = {
  className: '',
  title: '',
  message: '',
  okHandler: null,
  okText: '',
};

ErrorDialog.propTypes = {
  className: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  message: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  okHandler: PropTypes.func,
  okText: PropTypes.string,
};

export default ErrorDialog;
