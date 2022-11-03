import React from 'react';
import { Button, Table, Tag, Tbody, Td, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import './MemberManager.scss';

function MemberManager({ className, users, edit, onChangeUserRole, onUndoRemovalUSer, onRemoveUSer }) {
  const { t } = useTranslation();

  return (
    <div className={`member-list-wrapper ${className}`}>
      {users?.length > 0 && (
        <Table cols={['1px', '100%', '1px']}>
          <Tbody>
            {users?.map(spaceUser => {
              return (
                <Tr key={spaceUser.id} className={spaceUser.crud === 'D' ? 'deleted' : ''}>
                  <Td className="user-info">{spaceUser.name}</Td>
                  <Td className="user-email">
                    <Tag className="tag" border={false} uppercase>
                      {spaceUser.email}
                    </Tag>
                  </Td>
                  {!edit && (
                    <Td className={`role ${spaceUser.role}`}>
                      <Tag className="tag" border={false}>
                        <span className="icon">{spaceUser.role === 'ADMIN' ? <i className="fa-solid fa-crown" /> : <i className="fa-solid fa-user" />}</span>{' '}
                        {spaceUser.role === 'ADMIN' ? t('관리자') : t('사용자')}
                      </Tag>
                    </Td>
                  )}
                  {edit && (
                    <Td className={`role ${spaceUser.role}`}>
                      {spaceUser.crud === 'D' && (
                        <Tag className="tag" border={false} color="danger">
                          {t('삭제')}
                        </Tag>
                      )}

                      {spaceUser.crud !== 'D' && (
                        <Tag className="tag" border={false}>
                          <span className="icon">{spaceUser.role === 'ADMIN' ? <i className="fa-solid fa-crown" /> : <i className="fa-solid fa-user" />}</span>{' '}
                          {spaceUser.role === 'ADMIN' ? t('관리자') : t('사용자')}
                        </Tag>
                      )}
                      {spaceUser.crud !== 'D' && (
                        <Button
                          size="sm"
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
                          size="sm"
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
                          size="sm"
                          rounded
                          color="danger"
                          onClick={() => {
                            onRemoveUSer(spaceUser.id);
                          }}
                        >
                          <i className="fa-solid fa-trash-can" />
                        </Button>
                      )}
                    </Td>
                  )}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      )}
    </div>
  );
}

MemberManager.defaultProps = {
  className: '',
  edit: false,
  users: [],
  onChangeUserRole: null,
  onUndoRemovalUSer: null,
  onRemoveUSer: null,
};

MemberManager.propTypes = {
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

export default MemberManager;
