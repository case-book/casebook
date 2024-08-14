import React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import './OpenLinkReportPopup.scss';
import { OpenLinkReport } from '@/assets';

function OpenLinkReportPopup({ token, setOpened }) {
  const { t } = useTranslation();

  return (
    <Modal
      className="select-open-link-testrun-popup-wrapper"
      isOpen
      size="xxl"
      toggle={() => {
        if (setOpened) {
          setOpened(false);
        }
      }}
    >
      <ModalHeader>{t('오픈 링크')}</ModalHeader>
      <ModalBody>
        <OpenLinkReport token={token} />
      </ModalBody>
      <ModalFooter>
        <Button outline onClick={() => setOpened(false)}>
          {t('취소')}
        </Button>
        <Button
          onClick={() => {
            if (setOpened) {
              setOpened(false);
            }
          }}
        >
          {t('닫기')}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

OpenLinkReportPopup.defaultProps = {};

OpenLinkReportPopup.propTypes = {
  setOpened: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};

export default OpenLinkReportPopup;
