import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, EmptyContent, Input, Modal, ModalBody, ModalFooter, ModalHeader } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import SpaceService from '@/services/SpaceService';
import MemberCard from '@/components/MemberManager/MemberCard';
import './MemberCardManager.scss';
import { cloneDeep } from 'lodash';

function MemberCardManager({ className, users, edit, onChangeUserRole, onUndoRemovalUser, onRemoveUser, opened, setOpened, onApply, spaceCode }) {
  const { t } = useTranslation();

  const [spaceUsers, setSpaceUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const getSpaceUserList = useCallback(() => {
    if (spaceCode) {
      SpaceService.selectSpaceUserList(spaceCode, query, list => {
        setSpaceUsers(list);
        setSearched(true);
      });
    }
  }, [spaceCode, query]);

  useEffect(() => {
    if (opened) {
      setSpaceUsers([]);
      setSearched(false);
      setSelectedUsers(cloneDeep(users));
    }
  }, [opened]);

  const userIdMap = useMemo(() => {
    const map = {};
    selectedUsers?.forEach(u => {
      if (u.crud !== 'D') {
        map[u.userId] = true;
      }
    });
    return map;
  }, [selectedUsers]);

  return (
    <>
      <div className={`member-card-manager-wrapper ${className}`}>
        {users?.length < 1 && (
          <EmptyContent className="empty-content">
            <div>{t('사용자가 없습니다.')}</div>
          </EmptyContent>
        )}
        {users?.length > 0 && (
          <ul>
            {users?.map(spaceUser => {
              return (
                <li key={spaceUser.userId}>
                  <MemberCard spaceUser={spaceUser} edit={edit} onChangeUserRole={onChangeUserRole} onUndoRemovalUser={onUndoRemovalUser} onRemoveUser={onRemoveUser} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {opened && (
        <Modal
          className="project-user-add-popup-wrapper"
          size="xl"
          isOpen
          toggle={() => {
            if (setOpened) {
              setOpened(false);
            }
          }}
        >
          <ModalHeader className="modal-header">스페이스 사용자</ModalHeader>
          <ModalBody className="space-user-body">
            <div className="space-user-content">
              <div className="search">
                <div>검색</div>
                <div>
                  <Input
                    type="query"
                    value={query}
                    onChange={setQuery}
                    minLength={1}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        getSpaceUserList();
                      }
                    }}
                  />
                </div>
                <div>
                  <Button
                    outline
                    onClick={() => {
                      getSpaceUserList();
                    }}
                  >
                    {t('검색')}
                  </Button>
                </div>
              </div>
              <div className="space-user-list">
                {!searched && (
                  <EmptyContent className="empty-content">
                    <div>{t('사용자를 검색해주세요.')}</div>
                  </EmptyContent>
                )}
                {searched && spaceUsers?.length < 1 && (
                  <EmptyContent className="empty-content">
                    <div>{t('검색 결과가 없습니다.')}</div>
                  </EmptyContent>
                )}
                {searched && spaceUsers?.length > 0 && (
                  <ul>
                    {spaceUsers?.map(user => {
                      return (
                        <li key={user.id}>
                          <MemberCard
                            selected={userIdMap[user.id]}
                            onSelect={u => {
                              const nextSelectedUsers = selectedUsers.slice(0);
                              const userIndex = nextSelectedUsers.findIndex(d => d.userId === u.id);

                              if (userIndex > -1) {
                                if (nextSelectedUsers[userIndex].id) {
                                  if (nextSelectedUsers[userIndex].crud === 'D') {
                                    nextSelectedUsers[userIndex].crud = 'U';
                                  } else {
                                    nextSelectedUsers[userIndex].crud = 'D';
                                  }
                                } else {
                                  nextSelectedUsers.splice(userIndex, 1);
                                }
                              } else {
                                nextSelectedUsers.push({
                                  userId: u.id,
                                  name: u.name,
                                  email: u.email,
                                  role: 'USER',
                                });
                              }

                              setSelectedUsers(nextSelectedUsers);
                            }}
                            spaceUser={user}
                            edit={false}
                            onRemoveUser={onRemoveUser}
                            showRole={false}
                          />
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              outline
              onClick={() => {
                if (setOpened) {
                  setOpened(false);
                }
              }}
            >
              {t('취소')}
            </Button>
            <Button
              outline
              onClick={() => {
                if (onApply) {
                  onApply(selectedUsers);
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
      )}
    </>
  );
}

MemberCardManager.defaultProps = {
  className: '',
  edit: false,
  users: [],
  onChangeUserRole: null,
  onUndoRemovalUser: null,
  onRemoveUser: null,
  opened: false,
  setOpened: null,
  spaceCode: null,
  onApply: null,
};

MemberCardManager.propTypes = {
  className: PropTypes.string,
  spaceCode: PropTypes.string,
  edit: PropTypes.bool,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      email: PropTypes.string,
      crud: PropTypes.string,
    }),
  ),
  onChangeUserRole: PropTypes.func,
  onUndoRemovalUser: PropTypes.func,
  onRemoveUser: PropTypes.func,
  opened: PropTypes.bool,
  setOpened: PropTypes.func,
  onApply: PropTypes.func,
};

export default MemberCardManager;
