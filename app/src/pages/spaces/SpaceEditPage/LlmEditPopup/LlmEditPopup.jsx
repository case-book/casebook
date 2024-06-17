import React, { useEffect, useState } from 'react';
import { Block, BlockRow, Button, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Radio } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import './LlmEditPopup.scss';
import { LLM_TYPE_CODE, MESSAGE_CATEGORY } from '@/constants/constants';
import dialogUtil from '@/utils/dialogUtil';
import ConfigService from '@/services/ConfigService';

const labelMinWidth = '100px';

function LlmEditPopup({ data, setOpened, onApply }) {
  const { t } = useTranslation();

  const isEdit = data.index !== null;

  const [llm, setLlm] = useState({
    id: null,
    llmTypeCode: null,
    openAi: {
      id: null,
      name: '',
      url: '',
      apiKey: '',
      models: [],
    },
  });

  useEffect(() => {
    if (data?.index === null) {
      setLlm({
        ...data,
        llmTypeCode: LLM_TYPE_CODE.OPENAI,
        openAi: {
          ...(data.openAi || {}),
          url: 'https://api.openai.com/v1',
        },
      });
    } else {
      setLlm({
        ...data,
      });
    }
  }, []);

  const onSubmit = e => {
    e.preventDefault();
    onApply(llm);
    setOpened(false);
  };

  const onApiInfoTest = () => {
    if (!llm.openAi.url) {
      dialogUtil.setMessage(MESSAGE_CATEGORY.WARNING, t('URL 없음'), t('URL을 입력해주세요.'));
      return;
    }

    if (!llm.openAi.apiKey) {
      dialogUtil.setMessage(MESSAGE_CATEGORY.WARNING, t('API KEY 없음'), t('API KEY를 입력해주세요.'));
      return;
    }

    ConfigService.llmConfigTest(
      llm,
      e => {
        dialogUtil.setMessage(MESSAGE_CATEGORY.INFO, t('API 설정 확인'), e);
      },
      (e, a) => {
        dialogUtil.setMessage(MESSAGE_CATEGORY.ERROR, t('API 설정 오류'), a);
        return true;
      },
    );
  };

  return (
    <Modal
      className="holiday-edit-popup-wrapper"
      size="lg"
      isOpen
      toggle={() => {
        if (setOpened) {
          setOpened(false);
        }
      }}
    >
      <Form onSubmit={onSubmit}>
        <ModalHeader>{isEdit ? t('LLM API 변경') : t('LLM API 등록')}</ModalHeader>
        <ModalBody className="modal-body">
          <Block className="block">
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('LLM 타입')}</Label>
              <div>
                {Object.keys(LLM_TYPE_CODE).map(key => {
                  return (
                    <Radio
                      key={key}
                      type="inline"
                      value={key}
                      checked={llm.llmTypeCode === key}
                      onChange={val => {
                        setLlm({
                          ...llm,
                          llmTypeCode: val,
                        });
                      }}
                      label={LLM_TYPE_CODE[key]}
                    />
                  );
                })}
              </div>
            </BlockRow>
            {llm.llmTypeCode === LLM_TYPE_CODE.OPENAI && (
              <>
                <BlockRow>
                  <Label minWidth={labelMinWidth} required>
                    {t('이름')}
                  </Label>
                  <Input
                    type="text"
                    value={llm.openAi.name}
                    onChange={val =>
                      setLlm({
                        ...llm,
                        openAi: {
                          ...llm.openAi,
                          name: val,
                        },
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
                    value={llm.openAi.url}
                    placeholder="https://api.openai.com/v1"
                    onChange={val =>
                      setLlm({
                        ...llm,
                        openAi: {
                          ...llm.openAi,
                          url: val,
                        },
                      })
                    }
                    required
                    minLength={1}
                  />
                </BlockRow>
                <BlockRow>
                  <Label minWidth={labelMinWidth} required>
                    {t('API KEY')}
                  </Label>
                  <Input
                    type="text"
                    value={llm.openAi.apiKey}
                    onChange={val =>
                      setLlm({
                        ...llm,
                        openAi: {
                          ...llm.openAi,
                          apiKey: val,
                        },
                      })
                    }
                    required
                    minLength={1}
                  />
                </BlockRow>
              </>
            )}
          </Block>
          <div className="api-config-test-button">
            <Button onClick={onApiInfoTest}>{t('설정 테스트')}</Button>
          </div>
        </ModalBody>
        <ModalFooter className="modal-footer">
          <Button onClick={() => setOpened(false)}>{t('취소')}</Button>
          <Button type="submit">{isEdit ? t('변경') : t('추가')}</Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
}

LlmEditPopup.defaultProps = {
  data: null,
};

LlmEditPopup.propTypes = {
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
};

export default LlmEditPopup;
