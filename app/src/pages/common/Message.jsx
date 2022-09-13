import React from 'react';
import { Page, PageButtons, PageContent, PageTitle } from '@/components';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Message.scss';

function Message({ code }) {
  const navigate = useNavigate();

  return (
    <Page className="message-wrapper">
      {code === '404' && <PageTitle>404</PageTitle>}
      <PageContent className="content">
        <div>
          <div className="icon">
            <span>
              <span>
                <i className="fal fa-sensor-alert" />
              </span>
            </span>
          </div>
          {code === '404' && <p>경로가 잘못되었거나, 페이지를 찾을 수 없습니다.</p>}
        </div>
        <PageButtons
          onList={() => {
            navigate(-1);
          }}
          onListText="뒤로"
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
