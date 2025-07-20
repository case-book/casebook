import React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { ProjectPropTypes } from '@/proptypes';
import './SelectProjectPopup.scss';

function SelectProjectPopup({ projects, moveTo, onSelect, setOpened }) {
  const { t } = useTranslation();

  const navigate = useNavigate();

  return (
    <Modal
      className="select-project-popup-wrapper"
      isOpen
      size="md"
      toggle={() => {
        if (setOpened) {
          setOpened(false);
        }
      }}
    >
      <ModalHeader className="modal-header">{t('프로젝트 선택')}</ModalHeader>
      <ModalBody>
        <div className="description">{t('프로젝트 선택이 필요한 화면입니다.')}</div>
        <ul>
          {projects.map(project => {
            return (
              <li
                key={project.id}
                onClick={() => {
                  navigate(moveTo.replace('{{PROJECT_ID}}', project.id));
                  onSelect();
                }}
              >
                <Link className="space-selector-item" to={moveTo.replace('{{PROJECT_ID}}', project.id)}>
                  <div>
                    <span>{project.name}</span>
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

SelectProjectPopup.defaultProps = {};

SelectProjectPopup.propTypes = {
  setOpened: PropTypes.func.isRequired,
  moveTo: PropTypes.string.isRequired,
  projects: PropTypes.arrayOf(ProjectPropTypes).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default SelectProjectPopup;
