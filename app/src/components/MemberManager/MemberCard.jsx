import React from 'react';
import { Button, Card, CardContent, CardHeader, Tag } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import './MemberCard.scss';

function MemberCardManager({ className, spaceUser, edit, onChangeUserRole, onUndoRemovalUser, onRemoveUser, showRole, selected, onSelect }) {
  const { t } = useTranslation();

  return (
    <Card
      border
      point
      shadow={false}
      key={spaceUser.id}
      className={`member-card-wrapper ${className} ${spaceUser.crud === 'D' ? 'deleted' : ''} ${selected ? 'selected' : ''}`}
      onClick={
        onSelect
          ? () => {
              onSelect(spaceUser);
            }
          : null
      }
    >
      <CardHeader className="user-name">
        <div>
          {spaceUser.crud === 'D' && <span className="deleted-text">{t('DELETED')}</span>}
          <div className="name-text">{spaceUser.name}</div>
          {showRole && !edit && (
            <div className={`role ${spaceUser.role}`}>
              <Tag className="tag" border={false}>
                <span className="icon">{spaceUser.role === 'ADMIN' ? <i className="fa-solid fa-crown" /> : <i className="fa-solid fa-user" />}</span>{' '}
                {spaceUser.role === 'ADMIN' ? t('관리자') : t('사용자')}
              </Tag>
            </div>
          )}
          {showRole && edit && (
            <div className={`role ${spaceUser.role}`}>
              {spaceUser.crud !== 'D' && (
                <Tag className="tag" border={false}>
                  <span className="icon">{spaceUser.role === 'ADMIN' ? <i className="fa-solid fa-crown" /> : <i className="fa-solid fa-user" />}</span>{' '}
                  {spaceUser.role === 'ADMIN' ? t('관리자') : t('사용자')}
                </Tag>
              )}
              {onChangeUserRole && spaceUser.crud !== 'D' && (
                <Button
                  size="xs"
                  rounded
                  color="primary"
                  onClick={() => {
                    onChangeUserRole(spaceUser.userId, 'role', spaceUser.role === 'ADMIN' ? 'USER' : 'ADMIN');
                  }}
                >
                  <i className="fa-solid fa-arrow-right-arrow-left" />
                </Button>
              )}
              {onUndoRemovalUser && spaceUser.crud === 'D' && (
                <Button
                  size="xs"
                  rounded
                  color="danger"
                  onClick={() => {
                    onUndoRemovalUser(spaceUser.userId);
                  }}
                >
                  <i className="fa-solid fa-rotate-left" />
                </Button>
              )}
              {onRemoveUser && spaceUser.crud !== 'D' && (
                <Button
                  size="xs"
                  rounded
                  color="danger"
                  onClick={() => {
                    onRemoveUser(spaceUser.userId);
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
}

MemberCardManager.defaultProps = {
  className: '',
  edit: false,
  spaceUser: {},
  onChangeUserRole: null,
  onUndoRemovalUser: null,
  onRemoveUser: null,
  showRole: true,
  selected: false,
  onSelect: null,
};

MemberCardManager.propTypes = {
  className: PropTypes.string,
  edit: PropTypes.bool,
  spaceUser: PropTypes.shape({
    id: PropTypes.number,
    userId: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
    crud: PropTypes.string,
    role: PropTypes.string,
  }),
  onChangeUserRole: PropTypes.func,
  onUndoRemovalUser: PropTypes.func,
  onRemoveUser: PropTypes.func,
  showRole: PropTypes.bool,
  selected: PropTypes.bool,
  onSelect: PropTypes.func,
};

export default MemberCardManager;
