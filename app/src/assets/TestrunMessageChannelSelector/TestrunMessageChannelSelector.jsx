import React from 'react';
import { CheckBox, EmptyContent, Tag } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { CHANNEL_TYPE_CODE } from '@/constants/constants';
import './TestrunMessageChannelSelector.scss';

function TestrunMessageChannelSelector({ projectMessageChannels, messageChannels, onChange }) {
  const { t } = useTranslation();
  return (
    <div className="testrun-message-channel-selector-wrapper">
      {!(projectMessageChannels?.length > 0) && (
        <EmptyContent className="empty-content">
          <div>{t('등록된 메세지 채널이 없습니다.')}</div>
        </EmptyContent>
      )}
      {projectMessageChannels?.length > 0 && (
        <ul className="message-channels">
          {projectMessageChannels.map((messageChannel, inx) => {
            return (
              <li key={inx}>
                <div>
                  <CheckBox
                    type="checkbox"
                    size="xs"
                    value={!!messageChannels?.find(d => d.projectMessageChannelId === messageChannel.id)}
                    onChange={val => {
                      const nextMessageChannels = messageChannels.slice(0);

                      if (val) {
                        nextMessageChannels.push({ projectMessageChannelId: messageChannel.id });
                      } else {
                        const index = nextMessageChannels.findIndex(d => d.projectMessageChannelId === messageChannel.id);
                        if (index > -1) {
                          nextMessageChannels.splice(index, 1);
                        }
                      }

                      onChange(nextMessageChannels);
                    }}
                  />
                </div>
                <div>
                  <Tag size="sm" color="white" border>
                    {CHANNEL_TYPE_CODE[messageChannel.messageChannelType]}
                  </Tag>
                </div>
                <div>{messageChannel.name}</div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

TestrunMessageChannelSelector.defaultProps = {
  projectMessageChannels: [],
  messageChannels: [],
};

TestrunMessageChannelSelector.propTypes = {
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
  onChange: PropTypes.func.isRequired,
};

export default TestrunMessageChannelSelector;
