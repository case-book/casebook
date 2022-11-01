import React from 'react';
import PropTypes from 'prop-types';
import './NotificationList.scss';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Button } from '@/components';

function NotificationList({ className, elementRef, notificationList, lastSeen, onMoreClick, onLinkClick, hasNext }) {
  return (
    <ul className={`notification-list-wrapper ${className}`} ref={elementRef}>
      {notificationList.map(d => {
        return (
          <li key={d.id} className={moment(d.creationDate).isAfter(moment(lastSeen)) ? 'unread' : ''}>
            <div className="message">
              {d.url && (
                <Link
                  to={d.url}
                  onClick={e => {
                    e.stopPropagation();
                    if (onLinkClick) {
                      onLinkClick();
                    }
                  }}
                >
                  {d.message}
                </Link>
              )}
              {!d.url && <span>{d.message}</span>}
            </div>
            <div className="time">{moment(d.creationDate).format('YYYY-MM-DD HH:mm:ss')}</div>
          </li>
        );
      })}
      {!hasNext && <li className="end-list">다음 알림이 없습니다.</li>}
      {hasNext && (
        <li className="has-next">
          <Button
            size="sm"
            color="primary"
            onClick={() => {
              if (hasNext) {
                onMoreClick();
                // getNotificationInfo(notificationInfo.pageNo + 1);
              }
            }}
          >
            더 보기
          </Button>
        </li>
      )}
    </ul>
  );
}

NotificationList.defaultProps = {
  className: '',
  lastSeen: false,
  notificationList: '',
  onLinkClick: null,
  elementRef: null,
  hasNext: false,
  onMoreClick: null,
};

NotificationList.propTypes = {
  className: PropTypes.string,
  elementRef: PropTypes.shape({ current: PropTypes.instanceOf(HTMLUListElement) }),
  notificationList: PropTypes.arrayOf(
    PropTypes.shape({
      message: PropTypes.string,
      url: PropTypes.string,
      creationDate: PropTypes.string,
    }),
  ),
  lastSeen: PropTypes.string,
  onLinkClick: PropTypes.func,
  onMoreClick: PropTypes.func,
  hasNext: PropTypes.bool,
};

export default NotificationList;
