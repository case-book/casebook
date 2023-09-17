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

function UserAvatar({ className, size, avatarInfo }) {
  const avatar = useMemo(() => {
    if (avatarInfo?.type) {
      return createAvatar(schemas[avatarInfo.type], {
        ...avatarInfo.options,
        size,
      }).toDataUriSync();
    }
    return null;
  }, [avatarInfo]);

  return (
    <div className={`user-avatar-wrapper ${className}`}>
      {avatar && <img src={avatar} alt="avator" />}
      {!avatar && <div>NO</div>}
    </div>
  );
}

UserAvatar.defaultProps = {
  className: '',
  avatarInfo: null,
  size: 100,
};

UserAvatar.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
  avatarInfo: PropTypes.shape({
    type: PropTypes.string,
    options: PropTypes.shape({
      [PropTypes.string]: PropTypes.string,
    }),
  }),
};

export default UserAvatar;
