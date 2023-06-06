import React from 'react';
import PropTypes from 'prop-types';
import './TokenList.scss';
import { Button, EmptyContent, Liner, Table, Tbody, Td, Th, THead, Tr } from '@/components';
import dateUtil from '@/utils/dateUtil';
import { useTranslation } from 'react-i18next';

function TokenList({ className, tokens, onDeleteButtonClick, onChangeButtonClick }) {
  const { t } = useTranslation();

  return (
    <div className={`token-list-wrapper ${className}`}>
      {tokens?.length < 1 && (
        <EmptyContent className="empty-content" border>
          <div>{t('등록된 인증 토큰이 없습니다.')}</div>
        </EmptyContent>
      )}
      {tokens?.length > 0 && (
        <Table cols={['100%', '1px', '1px', '1px', '1px']} border>
          <THead>
            <Tr>
              <Th align="left">{t('이름')}</Th>
              <Th align="left">{t('인증 토큰')}</Th>
              <Th align="center">{t('활성화 여부')}</Th>
              <Th align="center">{t('마지막 사용일시')}</Th>
              <Th align="center" />
            </Tr>
          </THead>
          <Tbody>
            {tokens?.map(userToken => {
              return (
                <Tr key={userToken.id}>
                  <Td>{userToken.name}</Td>
                  <Td align="center">{userToken.token}</Td>
                  <Td align="center">{userToken.enabled ? 'Y' : 'N'}</Td>
                  <Td align="center">{dateUtil.getDateString(userToken.lastAccess)}</Td>
                  <Td align="center">
                    <Button
                      size="xs"
                      color="danger"
                      onClick={() => {
                        onDeleteButtonClick(userToken.id);
                      }}
                    >
                      {t('삭제')}
                    </Button>
                    <Liner width="1px" height="10px" display="inline-block" color="gray" margin="0 0.5rem " />
                    <Button
                      color="primary"
                      size="xs"
                      onClick={() => {
                        onChangeButtonClick(userToken);
                      }}
                    >
                      {t('변경')}
                    </Button>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      )}
    </div>
  );
}

TokenList.defaultProps = {
  className: '',
  tokens: [],
};

TokenList.propTypes = {
  className: PropTypes.string,
  tokens: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      token: PropTypes.string,
      lastAccess: PropTypes.string,
      enabled: PropTypes.bool,
    }),
  ),
  onDeleteButtonClick: PropTypes.func.isRequired,
  onChangeButtonClick: PropTypes.func.isRequired,
};

export default TokenList;
