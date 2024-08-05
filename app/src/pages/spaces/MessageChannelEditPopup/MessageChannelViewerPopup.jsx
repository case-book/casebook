import React from 'react';
import { Block, BlockRow, Button, EmptyContent, Label, Modal, ModalBody, ModalFooter, ModalHeader, Table, Tbody, Td, Text, Th, THead, Title, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import './MessageChannelPopup.scss';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import dialogUtil from '@/utils/dialogUtil';
import ConfigService from '@/services/ConfigService';

const labelMinWidth = '100px';

function MessageChannelViewerPopup({ messageChannel, setOpened }) {
  const { t } = useTranslation();

  const onSendTestMessage = () => {
    if (!messageChannel.url) {
      dialogUtil.setMessage(MESSAGE_CATEGORY.WARNING, t('URL 없음'), t('URL을 입력해주세요.'));
      return;
    }

    ConfigService.sendTestMessage(messageChannel, () => {
      dialogUtil.setMessage(MESSAGE_CATEGORY.INFO, t('메세지 발송 완료'), t('입력하신 설정 정보를 통해 메세지가 발송되었습니다.'));
    });
  };

  return (
    <Modal
      className="message-channel-popup-wrapper"
      size="lg"
      isOpen
      toggle={() => {
        if (setOpened) {
          setOpened(false);
        }
      }}
    >
      <ModalHeader>{t('메세지 채널 정보')}</ModalHeader>
      <ModalBody className="modal-body">
        <Block className="block">
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('채널 타입')}</Label>
            <Text>{messageChannel.messageChannelType}</Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('이름')}</Label>
            <Text>{messageChannel.name}</Text>
          </BlockRow>
          <BlockRow>
            <Label verticalAlign="baseline" minWidth={labelMinWidth}>
              {t('URL')}
            </Label>
            <Text>{messageChannel.url}</Text>
          </BlockRow>
        </Block>
        {messageChannel.messageChannelType === 'WEBHOOK' && (
          <>
            <Title type="h3" icon={false} className="webhook-title">
              {t('웹훅 설정')}
            </Title>
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('메소드')}</Label>
              <Text>{messageChannel.httpMethod}</Text>
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('메세지 형식')}</Label>
              <Text>{messageChannel.payloadType}</Text>
            </BlockRow>
            <div className="sub-title border">
              <div>
                <div>{t('요청 헤더')}</div>
              </div>
            </div>
            <div className="sub-content">
              <div className="payload">
                {messageChannel?.headers?.length === 0 && (
                  <EmptyContent border fill minHeight="80px">
                    {t('헤더가 없습니다.')}
                  </EmptyContent>
                )}
                {messageChannel?.headers?.length > 0 && (
                  <Table className="applicant-list" cols={['120px', '100%']} border>
                    <THead>
                      <Tr>
                        <Th align="left">KEY</Th>
                        <Th align="left">VALUE</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      {messageChannel.headers.map(d => {
                        return (
                          <Tr key={d.dataKey}>
                            <Td align="left">{d.dataKey}</Td>
                            <Td align="left">{d.dataValue}</Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                )}
              </div>
            </div>
            <div className="sub-title border">
              <div>
                <div>{t('페이로드')}</div>
              </div>
            </div>
            {messageChannel.payloadType === 'JSON' && (
              <div className="sub-content">
                <div className="json">{messageChannel.json || ''}</div>
              </div>
            )}
            {messageChannel.payloadType === 'FORM_DATA' && (
              <div className="sub-content">
                {messageChannel?.payloads?.length === 0 && (
                  <EmptyContent border fill minHeight="80px">
                    {t('페이로드가 없습니다.')}
                  </EmptyContent>
                )}
                {messageChannel?.payloads?.length > 0 && (
                  <Table className="applicant-list" cols={['120px', '100%']} border>
                    <THead>
                      <Tr>
                        <Th align="left">KEY</Th>
                        <Th align="left">VALUE</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      {messageChannel.payloads.map(d => {
                        return (
                          <Tr key={d.dataKey}>
                            <Td align="left">{d.dataKey}</Td>
                            <Td align="left">{d.dataValue}</Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                )}
              </div>
            )}
          </>
        )}
        <div className="send-message-button">
          <Button onClick={onSendTestMessage}>{t('발송 테스트')}</Button>
        </div>
      </ModalBody>
      <ModalFooter className="modal-footer">
        <Button onClick={() => setOpened(false)}>{t('닫기')}</Button>
      </ModalFooter>
    </Modal>
  );
}

MessageChannelViewerPopup.defaultProps = {
  messageChannel: {},
};

MessageChannelViewerPopup.propTypes = {
  messageChannel: PropTypes.shape({
    headers: PropTypes.arrayOf(
      PropTypes.shape({
        dataKey: PropTypes.string,
        dataValue: PropTypes.string,
      }),
    ),
    httpMethod: PropTypes.string,
    id: PropTypes.number,
    json: PropTypes.string,
    messageChannelType: PropTypes.string,
    name: PropTypes.string,
    payloadType: PropTypes.string,
    payloads: PropTypes.arrayOf(
      PropTypes.shape({
        dataKey: PropTypes.string,
        dataValue: PropTypes.string,
      }),
    ),
    url: PropTypes.string,
  }),
  setOpened: PropTypes.func.isRequired,
};

export default MessageChannelViewerPopup;
