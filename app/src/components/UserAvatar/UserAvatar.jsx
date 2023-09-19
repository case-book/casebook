import React, { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
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
import PropTypes from 'prop-types';
import './UserAvatar.scss';

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

function UserAvatar({ className, size, avatarInfo, rounded, fill, outline }) {
  const avatar = useMemo(() => {
    let jsonAvatarInfo = avatarInfo;
    if (typeof avatarInfo === 'string') {
      jsonAvatarInfo = JSON.parse(avatarInfo);
    }
    if (jsonAvatarInfo?.type) {
      return createAvatar(schemas[jsonAvatarInfo.type], {
        ...jsonAvatarInfo.options,
        size,
      }).toDataUriSync();
    }
    return null;
  }, [avatarInfo]);

  return (
    <div className={`user-avatar-wrapper ${className} ${rounded ? 'rounded' : ''} ${fill ? 'fill' : ''} ${outline ? 'outline' : ''}`}>
      {avatar && <img src={avatar} alt="avator" />}
      {!avatar && (
        <div style={{ width: `${size}px`, height: `${size}px`, fontSize: `${size ? size / 2 - 2 : 16}px` }} className="empty-icon">
          <i className="fa-solid fa-skull" />
        </div>
      )}
    </div>
  );
}

UserAvatar.defaultProps = {
  className: '',
  avatarInfo: null,
  size: 100,
  rounded: false,
  fill: false,
  outline: false,
};

UserAvatar.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
  avatarInfo: PropTypes.string,
  rounded: PropTypes.bool,
  fill: PropTypes.bool,
  outline: PropTypes.bool,
};

export default UserAvatar;
