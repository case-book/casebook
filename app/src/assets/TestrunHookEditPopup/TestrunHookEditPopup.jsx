import React, { useEffect, useState } from 'react';
import { Block, BlockRow, Button, EmptyContent, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Selector, Table, Tbody, Td, Text, Th, THead, Title, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { HTTP_METHOD, TESTRUN_HOOK_TIMINGS } from '@/constants/constants';
import ReactJson from 'react-json-view';
import TestrunService from '@/services/TestrunService';
import './TestrunHookEditPopup.scss';

const labelMinWidth = '100px';

function TestrunHookEditPopup({ spaceCode, projectId, setOpened, onApply, data }) {
  const { t } = useTranslation();

  const [apiInfo, setApiInfo] = useState({
    name: '테스트',
    timing: 'AFTER_START',
    method: 'POST',
    url: 'https://testlab-api.onkakao.net/exec/test-suites/MGJhMzc0YzQtMmRlNS00Yzk0LThlNmMtZDQ5M2ZjZDNmODkzLTE3MDI5NjA5NjU3MzI=',
    headers: [
      {
        key: 'Accept',
        value: 'application/json',
      },
      {
        key: 'Content-Type',
        value: 'application/json',
      },
    ],
  });

  const [executeResult, setExecuteResult] = useState(null);

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

  const executeHook = () => {
    TestrunService.executeTestrunHook(spaceCode, projectId, apiInfo, result => {
      try {
        const json = JSON.parse(result.message);
        setExecuteResult({ ...result, json });
      } catch (e) {
        setExecuteResult(result);
      }
    });
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
          <Block className="header-content">
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
                    <Td align="center" colSpan={3}>
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
          <Title
            border={false}
            marginBottom={false}
            control={
              <Button outline onClick={executeHook}>
                {t('실행 테스트')}
              </Button>
            }
          >
            {t('실행 테스트')}
          </Title>
          <Block>
            {!executeResult && (
              <EmptyContent border fill minHeight="50px">
                {t('실행 정보가 없습니다.')}
              </EmptyContent>
            )}
            {executeResult && (
              <>
                <BlockRow>
                  <Label minWidth={labelMinWidth}>{t('실행 결과')}</Label>
                  <Text>{executeResult?.result}</Text>
                </BlockRow>
                <BlockRow>
                  <Label verticalAlign="baseline" minWidth={labelMinWidth}>
                    {t('메세지')}
                  </Label>
                  <Text>
                    {executeResult?.json && <ReactJson src={executeResult?.json} />}
                    {!executeResult?.json && <div className="message">{executeResult?.message}</div>}
                  </Text>
                </BlockRow>
              </>
            )}
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

TestrunHookEditPopup.defaultProps = {
  data: null,
};

TestrunHookEditPopup.propTypes = {
  spaceCode: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  setOpened: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  data: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
};

export default TestrunHookEditPopup;
