import React, { useEffect, useState } from 'react';
import { Block, BlockRow, Button, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Radio, TextArea } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import './MessageChannelEditPopup.scss';
import { CHANNEL_TYPE_CODE } from '@/constants/constants';
import KeyValueEditor from '@/pages/spaces/MessageChannelEditPopup/KeyValueEditor';

const labelMinWidth = '100px';

function MessageChannelEditPopup({ data, setOpened, onApply, messageChannelTypeList }) {
  const { t } = useTranslation();

  const isEdit = data.index !== null;

  const [messageChannel, setMessageChannel] = useState({
    id: null,
    index: null,
    messageChannelType: 'WEBHOOK',
    name: '',
    url: '',
    httpMethod: 'POST',
    payloadType: 'FORM_DATA',
    headers: [],
    payloads: [],
    json: '',
  });

  useEffect(() => {
    if (data?.index !== null) {
      setMessageChannel({ ...data });
    }
  }, []);

  const onSubmit = e => {
    e.preventDefault();
    onApply(messageChannel);
    setOpened(false);
  };

  console.log(messageChannel);

  return (
    <Modal
      className="message-channel-edit-popup-wrapper"
      size="lg"
      isOpen
      toggle={() => {
        if (setOpened) {
          setOpened(false);
        }
      }}
    >
      <Form onSubmit={onSubmit}>
        <ModalHeader>{isEdit ? t('메세지 채널 변경') : t('메세지 채널 등록')}</ModalHeader>
        <ModalBody className="modal-body">
          <Block className="block">
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('채널 타입')}</Label>
              {messageChannelTypeList.map(channelType => {
                return (
                  <Radio
                    key={channelType}
                    type="inline"
                    value={channelType}
                    checked={messageChannel.messageChannelType === channelType}
                    onChange={val => {
                      if (messageChannel.messageChannelType !== val) {
                        setMessageChannel({
                          ...messageChannel,
                          messageChannelType: val,
                        });
                      }
                    }}
                    label={CHANNEL_TYPE_CODE[channelType]}
                  />
                );
              })}
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth} required>
                {t('이름')}
              </Label>
              <Input
                type="text"
                value={messageChannel.name}
                onChange={val =>
                  setMessageChannel({
                    ...messageChannel,
                    name: val,
                  })
                }
                required
                minLength={1}
              />
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth} required>
                {t('URL')}
              </Label>
              <Input
                type="text"
                value={messageChannel.url}
                onChange={val =>
                  setMessageChannel({
                    ...messageChannel,
                    url: val,
                  })
                }
                required
                minLength={1}
              />
            </BlockRow>
            {messageChannel.messageChannelType === 'WEBHOOK' && (
              <>
                <BlockRow>
                  <Label minWidth={labelMinWidth}>{t('메소드')}</Label>
                  {['POST', 'PUT', 'GET', 'DELETE'].map(httpMethod => {
                    return (
                      <Radio
                        key={httpMethod}
                        type="inline"
                        value={httpMethod}
                        checked={messageChannel.httpMethod === httpMethod}
                        onChange={val => {
                          if (messageChannel.httpMethod !== val) {
                            setMessageChannel({
                              ...messageChannel,
                              httpMethod: val,
                            });
                          }
                        }}
                        label={httpMethod}
                      />
                    );
                  })}
                </BlockRow>
                <BlockRow>
                  <Label minWidth={labelMinWidth}>{t('헤더')}</Label>
                  <div className="payload">
                    <KeyValueEditor
                      list={messageChannel.headers}
                      onChange={list => {
                        setMessageChannel({
                          ...messageChannel,
                          headers: list,
                        });
                      }}
                    />
                    <div className="add-button">
                      <Button
                        onClick={() => {
                          setMessageChannel({
                            ...messageChannel,
                            headers: [...messageChannel.headers, { key: '', value: '' }],
                          });
                        }}
                      >
                        {t('추가')}
                      </Button>
                    </div>
                  </div>
                </BlockRow>
                <BlockRow>
                  <Label minWidth={labelMinWidth}>{t('메세지 형식')}</Label>
                  <div>
                    {['FORM_DATA', 'JSON'].map(httpMethod => {
                      return (
                        <Radio
                          key={httpMethod}
                          type="inline"
                          value={httpMethod}
                          checked={messageChannel.payloadType === httpMethod}
                          onChange={val => {
                            if (messageChannel.payloadType !== val) {
                              setMessageChannel({
                                ...messageChannel,
                                payloadType: val,
                              });
                            }
                          }}
                          label={httpMethod}
                        />
                      );
                    })}
                  </div>
                </BlockRow>
                {messageChannel.payloadType === 'FORM_DATA' && (
                  <BlockRow>
                    <Label minWidth={labelMinWidth}>{t('페이로드')}</Label>
                    <div className="payload">
                      <KeyValueEditor
                        list={messageChannel.payloads}
                        onChange={list => {
                          setMessageChannel({
                            ...messageChannel,
                            payloads: list,
                          });
                        }}
                      />
                      <div className="add-button">
                        <Button
                          onClick={() => {
                            setMessageChannel({
                              ...messageChannel,
                              payloads: [...messageChannel.payloads, { key: '', value: '' }],
                            });
                          }}
                        >
                          {t('추가')}
                        </Button>
                      </div>
                    </div>
                  </BlockRow>
                )}
                {messageChannel.payloadType === 'JSON' && (
                  <BlockRow>
                    <Label minWidth={labelMinWidth}>{t('메세지')}</Label>
                    <TextArea />
                  </BlockRow>
                )}
              </>
            )}
            <BlockRow>
              <Label minWidth={labelMinWidth} />
              <Button onClick={() => {}}>{t('발송 테스트')}</Button>
            </BlockRow>
          </Block>
        </ModalBody>
        <ModalFooter className="modal-footer">
          <Button onClick={() => setOpened(false)}>{t('취소')}</Button>
          <Button type="submit">{isEdit ? t('변경') : t('추가')}</Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
}

MessageChannelEditPopup.defaultProps = {
  data: null,
  messageChannelTypeList: [],
};

MessageChannelEditPopup.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
    holidayType: PropTypes.string,
    index: PropTypes.number,
    date: PropTypes.string,
    name: PropTypes.string,
    month: PropTypes.number,
    week: PropTypes.number,
    day: PropTypes.number,
  }),
  messageChannelTypeList: PropTypes.arrayOf(PropTypes.string),
  setOpened: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
};

export default MessageChannelEditPopup;
