import React, { useEffect, useState } from 'react';
import { Block, BlockRow, Button, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Selector, Table, Tbody, Td, Text, Th, THead, Title, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { HTTP_METHOD, TESTRUN_HOOK_TIMINGS } from '@/constants/constants';
import './TestrunHookPopup.scss';

const labelMinWidth = '100px';

function TestrunHookPopup({ setOpened, onApply, data }) {
  const { t } = useTranslation();

  const [apiInfo, setApiInfo] = useState({
    name: '',
    timing: 'AFTER_START',
    method: 'POST',
    url: '',
    headers: [],
  });

  useEffect(() => {
    if (!data) return;
    setApiInfo({ ...data });
  }, [data]);

  const onSubmit = e => {
    e.preventDefault();
    if (onApply) {
      onApply(apiInfo);
    }

    if (setOpened) {
      setOpened(false);
    }
  };

  return (
    <Modal
      className="testrun-hook-popup-wrapper"
      size="lg"
      isOpen
      toggle={() => {
        if (setOpened) {
          setOpened(false);
        }
      }}
    >
      <Form onSubmit={onSubmit}>
        <ModalHeader className="modal-header">
          <span>{t('테스트런 API 훅')}</span>
        </ModalHeader>
        <ModalBody>
          <Title border={false} marginBottom={false}>
            {t('API 정보')}
          </Title>
          <Block>
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('이름')}</Label>
              <Input type="text" value={apiInfo?.name} onChange={val => setApiInfo({ ...apiInfo, name: val })} required minLength={1} maxLength={100} />
            </BlockRow>
            <BlockRow>
              <Label verticalAlign="baseline" minWidth={labelMinWidth}>
                {t('실행 시기')}
              </Label>
              <div>
                <Selector
                  items={TESTRUN_HOOK_TIMINGS}
                  value={apiInfo?.timing}
                  onChange={val => {
                    setApiInfo({ ...apiInfo, timing: val });
                  }}
                />
                <Text sub>{TESTRUN_HOOK_TIMINGS.find(d => d.key === apiInfo.timing)?.description}</Text>
              </div>
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('메소드')}</Label>
              <Selector
                items={HTTP_METHOD}
                value={apiInfo?.method}
                onChange={val => {
                  setApiInfo({ ...apiInfo, method: val });
                }}
              />
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('URL')}</Label>
              <Input type="text" value={apiInfo?.url} onChange={val => setApiInfo({ ...apiInfo, url: val })} required minLength={1} maxLength={200} />
            </BlockRow>
          </Block>
          <Title
            border={false}
            marginBottom={false}
            control={
              <Button
                outline
                size="sm"
                onClick={() => {
                  setApiInfo({
                    ...apiInfo,
                    headers: [
                      ...apiInfo.headers,
                      {
                        key: '',
                        value: '',
                      },
                    ],
                  });
                }}
              >
                {t('추가')}
              </Button>
            }
          >
            {t('헤더')}
          </Title>
          <Block>
            <Table cols={['200px', '', '70px']} border>
              <THead>
                <Tr>
                  <Th className="key" align="left">
                    {t('키')}
                  </Th>
                  <Th className="value" align="left">
                    {t('값')}
                  </Th>
                  <Th align="center" />
                </Tr>
              </THead>
              <Tbody>
                {apiInfo.headers?.length < 1 && (
                  <Tr>
                    <Td align="center" colSpan={2}>
                      {t('헤더 정보가 없습니다.')}
                    </Td>
                  </Tr>
                )}
                {apiInfo.headers?.length > 0 &&
                  apiInfo.headers?.map((header, inx) => {
                    return (
                      <Tr key={inx}>
                        <Td className="key">
                          <Input
                            type="text"
                            value={header.key}
                            onChange={val => {
                              const headers = [...apiInfo.headers];
                              headers[inx].key = val;
                              setApiInfo({ ...apiInfo, headers });
                            }}
                            required
                            minLength={1}
                          />
                        </Td>
                        <Td className="value">
                          <Input
                            type="text"
                            value={header.value}
                            onChange={val => {
                              const headers = [...apiInfo.headers];
                              headers[inx].value = val;
                              setApiInfo({ ...apiInfo, headers });
                            }}
                            required
                            minLength={1}
                          />
                        </Td>
                        <Td align="center">
                          <Button
                            outline
                            size="sm"
                            onClick={() => {
                              const headers = [...apiInfo.headers];
                              headers.splice(inx, 1);
                              setApiInfo({ ...apiInfo, headers });
                            }}
                          >
                            {t('삭제')}
                          </Button>
                        </Td>
                      </Tr>
                    );
                  })}
              </Tbody>
            </Table>
          </Block>
        </ModalBody>
        <ModalFooter>
          <Button outline onClick={() => setOpened(false)}>
            {t('취소')}
          </Button>
          <Button type="submit" outline>
            {t('확인')}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
}

TestrunHookPopup.defaultProps = {
  data: null,
};

TestrunHookPopup.propTypes = {
  setOpened: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  data: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
};

export default TestrunHookPopup;
