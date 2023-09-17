import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from '@/components';
import {
  adventurer,
  adventurerNeutral,
  avataaars,
  avataaarsNeutral,
  bigEars,
  bigEarsNeutral,
  bigSmile,
  bottts,
  botttsNeutral,
  croodles,
  croodlesNeutral,
  funEmoji,
  icons,
  identicon,
  lorelei,
  loreleiNeutral,
  micah,
  notionists,
  notionistsNeutral,
  openPeeps,
  personas,
  pixelArt,
  pixelArtNeutral,
} from '@dicebear/collection';
import './UserIconEditorPopup.scss';
import { createAvatar } from '@dicebear/core';

const schemas = {
  adventurer,
  adventurerNeutral,
  avataaars,
  avataaarsNeutral,
  bigEars,
  bigEarsNeutral,
  bigSmile,
  bottts,
  botttsNeutral,
  croodles,
  croodlesNeutral,
  funEmoji,
  icons,
  identicon,
  // initials,
  lorelei,
  loreleiNeutral,
  micah,
  notionists,
  notionistsNeutral,
  openPeeps,
  personas,
  pixelArt,
  pixelArtNeutral,
  // rings,
  // shapes,
  // thumbs,
};

const colors = ['e74645', 'FB7756', 'facd60', 'fdfa66', '1ac0c6'];
const imgSize = 100;

function UserIconEditorPopup({ className, data, setOpened, onChange }) {
  const { t } = useTranslation();
  const buttonElement = useRef(null);
  const [styles, setStyles] = useState([]);
  const [tab, setTab] = useState('type');

  const [avatarInfo, setAvatarInfo] = useState(
    data
      ? { ...data }
      : {
          type: 'adventurer',
          options: {},
        },
  );

  useEffect(() => {
    const list = [];
    Object.keys(schemas).forEach(schemaName => {
      const currentSchema = schemas[schemaName];
      const schemaImg = createAvatar(currentSchema, {
        size: imgSize,
      }).toDataUriSync();

      list.push({
        name: schemaName,
        img: schemaImg,
        properties: currentSchema.schema.properties,
      });
    });
    setStyles(list);
  }, []);

  const currentAvatar = useMemo(() => {
    return createAvatar(schemas[avatarInfo.type], {
      size: imgSize,
      ...avatarInfo.options,
    }).toDataUriSync();
  }, [avatarInfo]);

  const currentProperty = schemas[avatarInfo.type]?.schema?.properties[tab];
  const hasProbability = !!schemas[avatarInfo.type]?.schema?.properties[`${tab}Probability`];
  return (
    <Modal className={`${className} user-icon-editor-popup-wrapper`} size="xl" isOpen>
      <ModalHeader
        className="modal-header"
        onClose={() => {
          setOpened(false);
        }}
      >
        {t('사용자 아이콘')}
      </ModalHeader>
      <ModalBody>
        <div className="current-avatar">
          <div className="avatar-case">
            <img src={currentAvatar} alt="avatar" />
          </div>
        </div>
        <div className="menu">
          <ul>
            <li
              className={tab === 'type' ? 'selected' : ''}
              onClick={() => {
                setTab('type');
              }}
            >
              {t('타입')}
            </li>
            {schemas[avatarInfo.type]?.schema.properties &&
              Object.keys(schemas[avatarInfo.type].schema.properties)
                .filter(propertyKey => {
                  return propertyKey.indexOf('Probability') < 0;
                })
                .map(propertyKey => {
                  return (
                    <li
                      key={propertyKey}
                      className={tab === propertyKey ? 'selected' : ''}
                      onClick={() => {
                        setTab(propertyKey);
                      }}
                    >
                      {t(propertyKey)}
                    </li>
                  );
                })}
          </ul>
        </div>
        <div className="property-content">
          {tab === 'type' && (
            <div className="styles">
              <ul>
                {styles.map((style, inx) => {
                  return (
                    <li
                      key={inx}
                      onClick={() => {
                        setAvatarInfo({
                          type: style.name,
                          options: {},
                        });
                      }}
                    >
                      <img src={style.img} alt="avatar" />
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {currentProperty && tab !== 'type' && (
            <div className="options">
              {currentProperty.type === 'array' && (
                <ul>
                  {hasProbability && (
                    <li
                      onClick={() => {
                        const nextAvatarInfo = { ...avatarInfo };
                        nextAvatarInfo.options[tab] = schemas[avatarInfo.type]?.schema?.properties[`${tab}Probability`].minimum;
                        setAvatarInfo(nextAvatarInfo);
                      }}
                    >
                      <img
                        src={createAvatar(schemas[avatarInfo.type], {
                          size: imgSize,
                          ...avatarInfo.options,
                          [`${tab}Probability`]: schemas[avatarInfo.type]?.schema?.properties[`${tab}Probability`].minimum,
                        }).toDataUriSync()}
                        alt="avatar"
                      />
                    </li>
                  )}
                  {currentProperty.items?.pattern &&
                    currentProperty.items.pattern === '^(transparent|[a-fA-F0-9]{6})$' &&
                    [currentProperty.default || 'transparent'].concat(colors).map(color => {
                      const options = {
                        size: imgSize,
                        ...avatarInfo.options,
                        [tab]: [color],
                      };

                      const img = createAvatar(schemas[avatarInfo.type], { ...options }).toDataUriSync();

                      return (
                        <li
                          key={color}
                          onClick={() => {
                            const nextAvatarInfo = { ...avatarInfo };
                            nextAvatarInfo.options = { ...options };
                            setAvatarInfo(nextAvatarInfo);
                          }}
                        >
                          <img src={img} alt="avatar" />
                        </li>
                      );
                    })}
                  {currentProperty.default?.length > 1 &&
                    currentProperty.default.map(item => {
                      const options = {
                        size: imgSize,
                        ...avatarInfo.options,
                        [tab]: [item],
                      };

                      if (hasProbability) {
                        options[`${tab}Probability`] = schemas[avatarInfo.type]?.schema?.properties[`${tab}Probability`].maximum;
                      }

                      const img = createAvatar(schemas[avatarInfo.type], { ...options }).toDataUriSync();

                      return (
                        <li
                          key={item}
                          onClick={() => {
                            const nextAvatarInfo = { ...avatarInfo };
                            nextAvatarInfo.options = { ...options };
                            setAvatarInfo(nextAvatarInfo);
                          }}
                        >
                          <img src={img} alt="avatar" />
                        </li>
                      );
                    })}
                </ul>
              )}
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          outline
          onClick={() => {
            setOpened(false);
          }}
        >
          {t('취소')}
        </Button>
        <Button
          ref={buttonElement}
          color="primary"
          onClick={() => {
            onChange(avatarInfo);
            setOpened(false);
          }}
        >
          {t('변경')}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

UserIconEditorPopup.defaultProps = {
  className: '',
  setOpened: null,
  data: null,
};

UserIconEditorPopup.propTypes = {
  className: PropTypes.string,
  setOpened: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  data: PropTypes.shape({
    type: PropTypes.string,
    options: PropTypes.shape({
      [PropTypes.string]: PropTypes.string,
    }),
  }),
};

export default UserIconEditorPopup;
