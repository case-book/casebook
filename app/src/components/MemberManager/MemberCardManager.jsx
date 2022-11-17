import React from 'react';
import { Button, Card, CardContent, CardHeader, EmptyContent, Tag } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import './MemberCardManager.scss';

function MemberCardManager({ className, users, edit, onChangeUserRole, onUndoRemovalUSer, onRemoveUSer }) {
  const { t } = useTranslation();

  return (
    <div className={`member-card-manager-wrapper ${className}`}>
      {users?.length < 1 && (
        <EmptyContent className="empty-content">
          <div>{t('사용자가 없습니다.')}</div>
        </EmptyContent>
      )}
      {users?.length > 0 && (
        <ul>
          <li>
            {users?.map(spaceUser => {
              return (
                <Card border point key={spaceUser.id} className={spaceUser.crud === 'D' ? 'deleted' : ''}>
                  <CardHeader className="user-name">
                    <div>
                      {spaceUser.crud === 'D' && <span className="deleted-text">{t('DELETED')}</span>}
                      <div className="name-text">{spaceUser.name}</div>
                      {!edit && (
                        <div className={`role ${spaceUser.role}`}>
                          <Tag className="tag" border={false}>
                            <span className="icon">{spaceUser.role === 'ADMIN' ? <i className="fa-solid fa-crown" /> : <i className="fa-solid fa-user" />}</span>{' '}
                            {spaceUser.role === 'ADMIN' ? t('관리자') : t('사용자')}
                          </Tag>
                        </div>
                      )}
                      {edit && (
                        <div className={`role ${spaceUser.role}`}>
                          {spaceUser.crud !== 'D' && (
                            <Tag className="tag" border={false}>
                              <span className="icon">{spaceUser.role === 'ADMIN' ? <i className="fa-solid fa-crown" /> : <i className="fa-solid fa-user" />}</span>{' '}
                              {spaceUser.role === 'ADMIN' ? t('관리자') : t('사용자')}
                            </Tag>
                          )}
                          {spaceUser.crud !== 'D' && (
                            <Button
                              size="xs"
                              rounded
                              color="primary"
                              onClick={() => {
                                onChangeUserRole(spaceUser.id, 'role', spaceUser.role === 'ADMIN' ? 'USER' : 'ADMIN');
                              }}
                            >
                              <i className="fa-solid fa-arrow-right-arrow-left" />
                            </Button>
                          )}
                          {spaceUser.crud === 'D' && (
                            <Button
                              size="xs"
                              rounded
                              color="danger"
                              onClick={() => {
                                onUndoRemovalUSer(spaceUser.id);
                              }}
                            >
                              <i className="fa-solid fa-rotate-left" />
                            </Button>
                          )}
                          {spaceUser.crud !== 'D' && (
                            <Button
                              size="xs"
                              rounded
                              color="danger"
                              onClick={() => {
                                onRemoveUSer(spaceUser.id);
                              }}
                            >
                              <i className="fa-solid fa-trash-can" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="user-info">
                    <div>{spaceUser.email}</div>
                  </CardContent>
                </Card>
              );
            })}
          </li>
        </ul>
      )}
    </div>
  );
}

MemberCardManager.defaultProps = {
  className: '',
  edit: false,
  users: [],
  onChangeUserRole: null,
  onUndoRemovalUSer: null,
  onRemoveUSer: null,
};

MemberCardManager.propTypes = {
  className: PropTypes.string,
  edit: PropTypes.bool,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      email: PropTypes.string,
      crud: PropTypes.string,
    }),
  ),
  onChangeUserRole: PropTypes.func,
  onUndoRemovalUSer: PropTypes.func,
  onRemoveUSer: PropTypes.func,
};

export default MemberCardManager;
