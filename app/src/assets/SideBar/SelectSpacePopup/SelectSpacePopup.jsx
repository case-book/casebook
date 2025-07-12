import React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Tag } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import useStores from '@/hooks/useStores';
import { SpacePropTypes } from '@/proptypes';
import './SelectSpacePopup.scss';

function SelectSpacePopup({ spaces, setOpened }) {
  const { t } = useTranslation();

  const {
    contextStore: { space, setSpace },
  } = useStores();

  return (
    <Modal
      className="select-space-popup-wrapper"
      isOpen
      size="md"
      toggle={() => {
        if (setOpened) {
          setOpened(false);
        }
      }}
    >
      <ModalHeader className="modal-header">{t('스페이스 이동')}</ModalHeader>
      <ModalBody>
        <div className="description">{t('이동할 스페이스를 선택해주세요.')}</div>
        <ul>
          {spaces.map(info => {
            return (
              <li key={info.code}>
                <Link
                  className="space-selector-item"
                  to={`/spaces/${info.code}/info`}
                  onClick={e => {
                    e.stopPropagation();
                    localStorage.setItem('spaceCode', info.code);
                    setSpace(info);
                    setOpened(false);
                  }}
                >
                  <div>
                    <span>{info.name}</span>
                    <span>
                      <Tag size="xs" color="white">
                        {info.code}
                      </Tag>
                    </span>
                    <span>{info.code === space.code && <i className="fa-solid fa-street-view" />}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </ModalBody>
      <ModalFooter>
        <Button outline onClick={() => setOpened(false)}>
          {t('닫기')}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

SelectSpacePopup.defaultProps = {};

SelectSpacePopup.propTypes = {
  setOpened: PropTypes.func.isRequired,
  spaces: PropTypes.arrayOf(SpacePropTypes).isRequired,
};

export default observer(SelectSpacePopup);
