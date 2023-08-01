import React, { useState } from 'react';
import { Block, BlockRow, Button, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const labelMinWidth = '100px';

function JiraIntegrationEditPopup({ data, setOpened, onApply }) {
  const { t } = useTranslation();

  const [info, setInfo] = useState({ ...data });

  const onSubmit = e => {
    e.preventDefault();
    onApply(info);
    setOpened(false);
  };

  return (
    <Modal
      className="jira-integration-edit-popup-wrapper"
      size="lg"
      isOpen
      toggle={() => {
        if (setOpened) {
          setOpened(false);
        }
      }}
    >
      <Form onSubmit={onSubmit}>
        <ModalHeader>{t('설정 변경')}</ModalHeader>
        <ModalBody className="modal-body">
          <Block className="block">
            <BlockRow>
              <Label minWidth={labelMinWidth} required>
                {t('이름')}
              </Label>
              <Input
                type="text"
                value={info.name}
                onChange={val =>
                  setInfo({
                    ...info,
                    name: val,
                  })
                }
                required
                minLength={1}
              />
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth} required>
                {t('API URL')}
              </Label>
              <Input
                type="text"
                value={info.apiUrl}
                onChange={val =>
                  setInfo({
                    ...info,
                    apiUrl: val,
                  })
                }
                required
                minLength={1}
              />
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth} required>
                {t('API Token')}
              </Label>
              <Input
                type="text"
                value={info.apiToken}
                onChange={val =>
                  setInfo({
                    ...info,
                    apiToken: val,
                  })
                }
                required
                minLength={1}
              />
            </BlockRow>
          </Block>
        </ModalBody>
        <ModalFooter className="modal-footer">
          <Button onClick={() => setOpened(false)}>{t('취소')}</Button>
          <Button type="submit">{t('추가')}</Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
}

JiraIntegrationEditPopup.defaultProps = {
  data: null,
};

JiraIntegrationEditPopup.propTypes = {
  data: PropTypes.shape({
    apiUrl: PropTypes.string,
    name: PropTypes.string,
    apiToken: PropTypes.string,
  }),
  setOpened: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
};

export default JiraIntegrationEditPopup;
