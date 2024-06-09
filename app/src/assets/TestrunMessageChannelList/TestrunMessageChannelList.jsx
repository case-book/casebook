import React from 'react';
import { Tag } from '@/components';
import PropTypes from 'prop-types';
import { CHANNEL_TYPE_CODE } from '@/constants/constants';
import './TestrunMessageChannelList.scss';

function TestrunMessageChannelList({ projectMessageChannels, messageChannels }) {
  return (
    <div className="testrun-message-channel-list-wrapper">
      {messageChannels?.length > 0 && (
        <ul className="message-channels">
          {messageChannels?.map((channel, inx) => {
            const channelInfo = projectMessageChannels.find(d => d.id === channel.projectMessageChannelId);

            if (!channelInfo) {
              return null;
            }

            return (
              <li key={inx}>
                <div>
                  <Tag size="sm" color="white" border>
                    {CHANNEL_TYPE_CODE[channelInfo.messageChannelType]}
                  </Tag>
                </div>
                <div>{channelInfo.name}</div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

TestrunMessageChannelList.defaultProps = {
  projectMessageChannels: [],
  messageChannels: [],
};

TestrunMessageChannelList.propTypes = {
  projectMessageChannels: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
    }),
  ),
  messageChannels: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
    }),
  ),
};

export default TestrunMessageChannelList;
