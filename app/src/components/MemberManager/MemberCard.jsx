import React, { useMemo, useRef, useState } from 'react';
import { Button, Card, CardContent, CardHeader, Input, Tag } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import './MemberCard.scss';

function MemberCardManager({ className, spaceUser, edit, onChangeUserRole, onUndoRemovalUser, onRemoveUser, showRole, selected, onSelect, tags }) {
  const { t } = useTranslation();

  const [tag, setTag] = useState('');
  const [tagOpened, setTagOpened] = useState(false);
  const element = useRef({});

  const tagList = useMemo(() => {
    return spaceUser.tags?.split(';').filter(d => !!d) || [];
  }, [spaceUser]);

  const addTag = () => {
    const newTag = tag.replaceAll(';', '');

    if (!tagList.includes(newTag)) {
      onChangeUserRole(spaceUser.userId, 'tags', `${spaceUser.tags || ''};${newTag}`);
    }
    setTag('');
    setTagOpened(false);
  };

  const removeTag = inx => {
    const currentTags = tagList.slice(0);
    currentTags.splice(inx, 1);
    if (currentTags.length > 0) {
      onChangeUserRole(spaceUser.userId, 'tags', `;${currentTags.join(';')}`);
    } else {
      onChangeUserRole(spaceUser.userId, 'tags', '');
    }
  };

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
        <div className="email">{spaceUser.email}</div>
        {tags && (
          <div className="tag-info">
            <div className="tags scrollbar-sm">
              {tagList.length < 1 && <div className="no-tags">NO TAGS</div>}
              {tagList.length > 0 &&
                tagList.map((val, inx) => {
                  return (
                    <Tag key={inx} className="tag" color="white" border>
                      {val}
                      {edit && (
                        <span
                          className="remove"
                          onClick={() => {
                            removeTag(inx);
                          }}
                        >
                          <i className="fa-solid fa-xmark" />
                        </span>
                      )}
                    </Tag>
                  );
                })}
            </div>
            {edit && (
              <div className="tag-button">
                <Button
                  size="xs"
                  color="primary"
                  onClick={() => {
                    setTagOpened(true);
                    setTimeout(() => {
                      if (element.current) {
                        element.current.focus();
                      }
                    }, 100);
                  }}
                >
                  태그 추가
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
      {tags && tagOpened && (
        <div className="tag-change-popup">
          <div>
            <div className="message">태그 추가</div>
            <div className="tag-input">
              <Input
                onRef={e => {
                  element.current = e;
                }}
                placeholder="태그를 입력해주세요."
                size="sm"
                value={tag}
                onChange={val => setTag(val)}
                required
                minLength={1}
                onKeyDown={e => {
                  e.stopPropagation();
                  if (e.keyCode === 13) {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
            </div>
            <div className="tag-buttons">
              <Button
                size="xs"
                outline
                onClick={() => {
                  setTag('');
                  setTagOpened(false);
                }}
              >
                취소
              </Button>
              <Button size="xs" color="primary" outline onClick={addTag}>
                추가
              </Button>
            </div>
          </div>
        </div>
      )}
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
  tags: false,
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
    tags: PropTypes.string,
  }),
  onChangeUserRole: PropTypes.func,
  onUndoRemovalUser: PropTypes.func,
  onRemoveUser: PropTypes.func,

  showRole: PropTypes.bool,
  selected: PropTypes.bool,
  onSelect: PropTypes.func,
  tags: PropTypes.bool,
};

export default MemberCardManager;
