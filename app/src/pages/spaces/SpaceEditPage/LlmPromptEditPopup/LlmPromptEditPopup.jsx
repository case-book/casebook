import React, { useEffect, useState } from 'react';
import { Block, BlockRow, Button, CheckBox, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, TextArea } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import './LlmPromptEditPopup.scss';

const labelMinWidth = '100px';

function LlmPromptEditPopup({ data, setOpened, onApply, systemLlmConfigList }) {
  const { t } = useTranslation();

  const isEdit = data.index !== null;

  const [llmPrompt, setLlmPrompt] = useState({
    id: null,
    index: null,
    systemRole: '',
    name: '',
    prompt: '',
    activated: false,
  });

  useEffect(() => {
    if (data?.index !== null) {
      setLlmPrompt({
        ...data,
      });
    }
  }, []);

  const onSubmit = e => {
    e.preventDefault();
    onApply(llmPrompt);
    setOpened(false);
  };

  return (
    <Modal
      className="llm-prompt-edit-popup-wrapper"
      size="lg"
      isOpen
      toggle={() => {
        if (setOpened) {
          setOpened(false);
        }
      }}
    >
      <Form onSubmit={onSubmit}>
        <ModalHeader>{isEdit ? t('LLM 프롬프트 변경') : t('LLM 프롬프트 등록')}</ModalHeader>
        <ModalBody className="modal-body">
          <Block className="block">
            <BlockRow>
              <Label minWidth={labelMinWidth} required>
                {t('이름')}
              </Label>
              <Input
                type="text"
                value={llmPrompt.name}
                onChange={val =>
                  setLlmPrompt({
                    ...llmPrompt,
                    name: val,
                  })
                }
                required
                minLength={1}
              />
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth} required>
                {t('시스템 롤')}
              </Label>
              <TextArea
                required
                size="md"
                value={llmPrompt.systemRole || ''}
                rows={4}
                onChange={val => {
                  setLlmPrompt({
                    ...llmPrompt,
                    systemRole: val,
                  });
                }}
              />
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth} required>
                {t('프롬프트')}
              </Label>
              <TextArea
                required
                size="md"
                value={llmPrompt.prompt || ''}
                rows={4}
                onChange={val => {
                  setLlmPrompt({
                    ...llmPrompt,
                    prompt: val,
                  });
                }}
              />
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('활성화')}</Label>
              <CheckBox
                type="checkbox"
                value={llmPrompt.activated}
                onChange={val => {
                  setLlmPrompt({
                    ...llmPrompt,
                    activated: val,
                  });
                }}
              />
            </BlockRow>
            <div className="single-button">
              <Button
                onClick={() => {
                  const prompt = systemLlmConfigList.find(d => d.code === 'LLM_PROMPT');
                  const systemRole = systemLlmConfigList.find(d => d.code === 'LLM_SYSTEM_ROLE');

                  setLlmPrompt({
                    ...llmPrompt,
                    systemRole: systemRole?.value || '',
                    prompt: prompt?.value || '',
                  });
                }}
              >
                {t('기본 값 불러오기')}
              </Button>
            </div>
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

LlmPromptEditPopup.defaultProps = {
  data: null,
  systemLlmConfigList: [],
};

LlmPromptEditPopup.propTypes = {
  data: PropTypes.shape({
    index: PropTypes.number,
    id: PropTypes.number,
    llmTypeCode: PropTypes.string,
    openAi: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      url: PropTypes.string,
      apiKey: PropTypes.string,
      models: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          name: PropTypes.string,
          code: PropTypes.string,
        }),
      ),
    }),
  }),
  setOpened: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  systemLlmConfigList: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
};

export default LlmPromptEditPopup;
