import React from 'react';
import { Page, PageButtons, PageContent } from '@/components';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import './Message.scss';

function Message({ code }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Page className="message-wrapper">
      <PageContent className="content">
        <div className="code">{code}</div>
        <div className="message">{code === '404' && <p>{t('경로가 잘못되었거나, 페이지를 찾을 수 없습니다.')}</p>}</div>
        <PageButtons
          onList={() => {
            navigate(-1);
          }}
          onListText={t('뒤로')}
        />
      </PageContent>
    </Page>
  );
}

Message.defaultProps = {
  code: '',
};

Message.propTypes = {
  code: PropTypes.string,
};

export default Message;
