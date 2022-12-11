import React, { useCallback, useEffect, useState } from 'react';
import { Button, EmptyContent, Liner, Modal, ModalBody, ModalFooter, ModalHeader } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import './ProjectUserSelectPopup.scss';

function ProjectUserSelectPopup({ users, selectedUsers, setOpened, onApply }) {
  const { t } = useTranslation();

  const [projectUsers, setProjectUsers] = useState([]);
  const [currentSelectedUsers, setCurrentSelectedUsers] = useState([]);

  useEffect(() => {
    setProjectUsers(cloneDeep(users));
  }, [users]);

  useEffect(() => {
    setCurrentSelectedUsers(cloneDeep(selectedUsers));
  }, [selectedUsers]);

  const onClick = user => {
    const nextCurrentSelectedUsers = currentSelectedUsers.slice(0);
    const index = nextCurrentSelectedUsers.findIndex(d => d.userId === user.userId);

    if (index > -1) {
      nextCurrentSelectedUsers.splice(index, 1);
    } else {
      nextCurrentSelectedUsers.push({ userId: user.userId, email: user.email, name: user.name });
    }

    setCurrentSelectedUsers(nextCurrentSelectedUsers);
  };

  const allCheck = useCallback(() => {
    if (currentSelectedUsers.length === projectUsers.length) {
      setCurrentSelectedUsers([]);
    } else {
      setCurrentSelectedUsers(
        projectUsers.map(d => {
          return { userId: d.userId, email: d.email, name: d.name };
        }),
      );
    }
  }, [currentSelectedUsers, projectUsers]);

  return (
    <Modal
      className="project-user-select-popup-wrapper"
      isOpen
      toggle={() => {
        if (setOpened) {
          setOpened(false);
        }
      }}
    >
      <ModalHeader className="modal-header">
        <span>프로젝트 사용자</span>
        <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 1rem" />
        <Button size="sm" outline onClick={allCheck}>
          <i className="fa-solid fa-circle-check" /> {t('모두 선택')}
        </Button>
      </ModalHeader>
      <ModalBody>
        <div className="project-user-list">
          {projectUsers && projectUsers?.length < 1 && (
            <EmptyContent className="empty-content">
              <div>{t('프로젝트 사용자가 없습니다.')}</div>
            </EmptyContent>
          )}
          {projectUsers?.length > 0 && (
            <ul>
              {projectUsers?.map(user => {
                const selected = currentSelectedUsers.findIndex(d => d.userId === user.userId) > -1;
                return (
                  <li
                    key={user.id}
                    className={selected ? 'selected' : ''}
                    onClick={() => {
                      onClick(user);
                    }}
                  >
                    <div>
                      {selected && <i className="fa-solid fa-circle-check" />}
                      {!selected && <i className="fa-regular fa-circle-check" />}
                    </div>
                    <div>{user.name}</div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button outline onClick={() => setOpened(false)}>
          {t('취소')}
        </Button>
        <Button
          outline
          onClick={() => {
            if (onApply) {
              onApply(currentSelectedUsers);
            }

            if (setOpened) {
              setOpened(false);
            }
          }}
        >
          {t('확인')}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

ProjectUserSelectPopup.defaultProps = {
  users: [],
  selectedUsers: [],
};

ProjectUserSelectPopup.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      userId: PropTypes.number,
      name: PropTypes.string,
      email: PropTypes.string,
    }),
  ),
  selectedUsers: PropTypes.arrayOf(
    PropTypes.shape({
      userId: PropTypes.number,
      name: PropTypes.string,
      email: PropTypes.string,
    }),
  ),
  setOpened: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
};

export default ProjectUserSelectPopup;
