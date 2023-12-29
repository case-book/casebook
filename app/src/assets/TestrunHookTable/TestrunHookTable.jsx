import React from 'react';
import { Button, Table, Tbody, Td, Th, THead, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './TestrunHookTable.scss';
import { HTTP_METHOD, TESTRUN_HOOK_TIMINGS } from '@/constants/constants';

function TestrunHookTable({ hooks, onDeleteClick, onNameClick, onResultClick, edit }) {
  const { t } = useTranslation();

  return (
    <Table cols={['200px', '100px', '100px', '100%', '50px']} border>
      <THead>
        <Tr>
          <Th align="left">{t('이름')}</Th>
          <Th align="center">{t('실행 시기')}</Th>
          <Th align="center">{t('메소드')}</Th>
          <Th align="left">{t('URL')}</Th>
          {edit && <Th align="center" />}
          {!edit && <Th align="left">{t('실행 결과')}</Th>}
        </Tr>
      </THead>
      <Tbody>
        {(!hooks || hooks?.length < 1) && (
          <Tr>
            <Td align="center" colSpan={5}>
              {t('데이터가 없습니다.')}
            </Td>
          </Tr>
        )}
        {hooks?.length > 0 &&
          hooks?.map((hook, inx) => {
            return (
              <Tr key={inx}>
                <Td>
                  <Link
                    to="/"
                    onClick={e => {
                      e.preventDefault();
                      if (onNameClick) {
                        onNameClick(hook, inx);
                      }
                    }}
                  >
                    {hook.name}
                  </Link>
                </Td>
                <Td align="center">{TESTRUN_HOOK_TIMINGS.find(d => d.key === hook.timing)?.value || hook.timing}</Td>
                <Td align="center">{HTTP_METHOD.find(d => d.key === hook.method)?.value || hook.method}</Td>
                <Td>{hook.url}</Td>
                {edit && (
                  <Td align="center">
                    <Button
                      outline
                      size="xs"
                      color="danger"
                      onClick={() => {
                        if (onDeleteClick) {
                          onDeleteClick(hook, inx);
                        }
                      }}
                    >
                      {t('삭제')}
                    </Button>
                  </Td>
                )}
                {!edit && (
                  <Td>
                    {hook.result && (
                      <Link
                        className="result-link"
                        to="/"
                        onClick={e => {
                          e.preventDefault();
                          onResultClick(hook, inx);
                        }}
                      >
                        {hook.result}
                      </Link>
                    )}
                  </Td>
                )}
              </Tr>
            );
          })}
      </Tbody>
    </Table>
  );
}

TestrunHookTable.defaultProps = {
  hooks: [],
  onDeleteClick: null,
  onNameClick: null,
  onResultClick: null,
  edit: false,
};

TestrunHookTable.propTypes = {
  hooks: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      timing: PropTypes.string,
      method: PropTypes.string,
      url: PropTypes.string,
    }),
  ),
  edit: PropTypes.bool,
  onDeleteClick: PropTypes.func,
  onNameClick: PropTypes.func,
  onResultClick: PropTypes.func,
};

export default TestrunHookTable;
