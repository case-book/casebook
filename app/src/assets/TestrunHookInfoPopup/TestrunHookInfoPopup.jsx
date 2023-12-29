import React, { useEffect, useState } from 'react';
import { Block, BlockRow, Button, EmptyContent, Label, Modal, ModalBody, ModalFooter, ModalHeader, Table, Tbody, Td, Text, Th, THead, Title, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { HTTP_METHOD, TESTRUN_HOOK_TIMINGS } from '@/constants/constants';
import './TestrunHookInfoPopup.scss';

const labelMinWidth = '100px';

function TestrunHookInfoPopup({ setOpened, data }) {
  const { t } = useTranslation();

  const [apiInfo, setApiInfo] = useState({
    name: '',
    timing: '',
    method: '',
    url: '',
    headers: [],
  });

  useEffect(() => {
    if (!data) return;
    setApiInfo({ ...data });
  }, [data]);

  return (
    <Modal
      className="testrun-hook-info-popup-wrapper"
      size="lg"
      isOpen
      toggle={() => {
        if (setOpened) {
          setOpened(false);
        }
      }}
    >
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
            <Text>{apiInfo?.name}</Text>
          </BlockRow>
          <BlockRow>
            <Label verticalAlign="baseline" minWidth={labelMinWidth}>
              {t('실행 시기')}
            </Label>
            <Text>{TESTRUN_HOOK_TIMINGS.find(d => d.key === apiInfo.timing)?.value || apiInfo.timing}</Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('메소드')}</Label>
            <Text>{HTTP_METHOD.find(d => d.key === apiInfo.method)?.value || apiInfo.method}</Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('URL')}</Label>
            <Text>{apiInfo?.url}</Text>
          </BlockRow>
        </Block>
        <Title border={false} marginBottom={false}>
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
                      <Td className="key">{header.key}</Td>
                      <Td className="value">{header.value}</Td>
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </Block>
        <Title border={false} marginBottom={false}>
          {t('API 호출 결과')}
        </Title>
        <Block>
          {!apiInfo?.result && <EmptyContent>{t('API 호출 결과가 없습니다.')}</EmptyContent>}
          {apiInfo?.result && (
            <>
              <BlockRow>
                <Label minWidth={labelMinWidth}>{t('응답 결과 코드')}</Label>
                <Text>{apiInfo?.result}</Text>
              </BlockRow>
              <BlockRow>
                <Label verticalAlign="baseline" minWidth={labelMinWidth}>
                  {t('메세지')}
                </Label>
                <Text>{apiInfo?.message && <div className="message">{apiInfo?.message}</div>}</Text>
              </BlockRow>
            </>
          )}
        </Block>
      </ModalBody>
      <ModalFooter>
        <Button outline onClick={() => setOpened(false)}>
          {t('닫기')}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

TestrunHookInfoPopup.defaultProps = {
  data: null,
};

TestrunHookInfoPopup.propTypes = {
  setOpened: PropTypes.func.isRequired,
  data: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
};

export default TestrunHookInfoPopup;
