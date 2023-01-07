import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { USER_ASSIGNED_OPERATIONS } from '@/constants/constants';
import { getUserText } from '@/utils/userUtil';
import './UserSelector.scss';
import { Tag } from '@/components';

function UserSelector({ className, users, type, value, size, disabled, onChange, placeholder, selectUserOnly, tags }) {
  const [opened, setOpened] = useState(false);
  const [bottomList, setBottomList] = useState(true);
  const [text, setText] = useState('');
  const [focus, setFocus] = useState(false);
  const element = useRef(null);
  const list = useRef(null);

  const handleChange = (t, v) => {
    onChange(t, v);
    setOpened(false);
    setText('');
  };

  const filteredUser = users.filter(d => {
    if (text) {
      return d.name.toLowerCase().indexOf(text.toLowerCase()) > -1 || d.email.toLowerCase().indexOf(text.toLowerCase()) > -1;
    }

    return true;
  });

  const handleOutsideClick = event => {
    if (element.current && !element.current.contains(event.target)) {
      setOpened(false);
    }
  };

  useEffect(() => {
    if (opened) {
      document.addEventListener('mousedown', handleOutsideClick);

      if (element.current) {
        const elementRect = element.current.getClientRects();
        if (elementRect.length > 0) {
          const gab = window.innerHeight - elementRect[0].top;

          if (gab < 200) {
            setBottomList(false);
          } else {
            setBottomList(true);
          }
        }
      }

      if (list.current) {
        const selectedItem = list.current.querySelector('.selected');
        if (selectedItem) {
          list.current.scrollTop = selectedItem.offsetTop;
        }
      }
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [opened]);

  console.log(tags);

  return (
    <div className={`user-selector-wrapper g-no-select ${className} size-${size} ${opened ? 'opened' : ''}`} ref={element}>
      <div className="control">
        <input
          type="text"
          disabled={disabled}
          placeholder={placeholder}
          onChange={e => {
            setText(e.target.value);
          }}
          onFocus={() => {
            if (type === 'user') {
              setText(getUserText(users, type, value, tags) || '');
            }
            setOpened(true);
            setFocus(true);
          }}
          onBlur={() => {
            setFocus(false);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              const filteredList = users.filter(d => d.name.toLowerCase().indexOf(text.toLowerCase()) > -1 || d.email.toLowerCase().indexOf(text.toLowerCase()) > -1);
              if (filteredList.length === 1) {
                handleChange('user', filteredList[0].id);
                element.current.blur();
                setText(getUserText(users, 'user', filteredList[0].id, tags) || '');
              } else {
                setOpened(true);
              }
            }

            if (e.key === 'Escape') {
              setOpened(false);
              setText(getUserText(users, type, value, tags) || '');
              element.current.blur();
            }
          }}
          value={focus ? text : getUserText(users, type, value, tags) || ''}
        />
      </div>
      <div
        className="icon"
        onClick={() => {
          setText('');
          setOpened(!opened);
        }}
      >
        <div>
          <i className={`fas fa-chevron-${opened ? 'up' : 'down'} normal`} />
        </div>
      </div>
      {opened && (
        <div className={`user-list g-no-select ${bottomList ? '' : 'bottom-top'}`} ref={list}>
          <ul>
            {!selectUserOnly && (
              <>
                <li
                  className={`special-option ${type === 'operation' && value === 'RND' ? 'selected' : ''}`}
                  onClick={() => {
                    handleChange('operation', 'RND');
                  }}
                >
                  <div className="name">{USER_ASSIGNED_OPERATIONS.RND}</div>
                </li>
                <li
                  className={`special-option ${type === 'operation' && value === 'SEQ' ? 'selected' : ''}`}
                  onClick={() => {
                    handleChange('operation', 'SEQ');
                  }}
                >
                  <div className="name">{USER_ASSIGNED_OPERATIONS.SEQ}</div>
                </li>
              </>
            )}
            {tags?.length > 0 && (
              <>
                {tags.map(tag => {
                  return (
                    <li
                      className={`tag-option ${type === 'tag' && value === tag ? 'selected' : ''}`}
                      onClick={() => {
                        handleChange('tag', tag);
                      }}
                    >
                      <div className="name">
                        <Tag className="tag">TAG</Tag>
                        <div className="tag-value">{tag}</div>
                      </div>
                    </li>
                  );
                })}
              </>
            )}
            {filteredUser?.length < 1 && (
              <li className="empty">
                <div className="name">&#39;{text}&#39; 일치하는 사용자가 없습니다.</div>
              </li>
            )}
            {filteredUser?.map(user => {
              return (
                <li
                  key={user.id}
                  className={`user-options ${type === 'user' && user.id === value ? 'selected' : ''}`}
                  onClick={() => {
                    handleChange('user', user.id);
                  }}
                >
                  <div className="name">{user.name}</div>
                  <div className="email">
                    <span>{user.email}</span>
                  </div>
                  {filteredUser?.length === 1 && (
                    <div className="enter">
                      <span>
                        enter <i className="fa-solid fa-caret-up" />
                      </span>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

UserSelector.defaultProps = {
  className: '',
  size: 'md',
  type: '',
  value: '',
  disabled: false,
  onChange: null,
  placeholder: '',
  users: [],
  selectUserOnly: false,
  tags: [],
};

UserSelector.propTypes = {
  className: PropTypes.string,

  size: PropTypes.oneOf(['xxl', 'xl', 'lg', 'md', 'sm', 'xs']),
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      email: PropTypes.string,
    }),
  ),
  selectUserOnly: PropTypes.bool,
  tags: PropTypes.arrayOf(PropTypes.string),
};

export default UserSelector;
