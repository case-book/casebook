import React from 'react';
import PropTypes from 'prop-types';
import './CommentList.scss';
import { EmptyContent, Liner, UserAvatar } from '@/components';
import { Viewer } from '@toast-ui/react-editor';
import dateUtil from '@/utils/dateUtil';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useStores from '@/hooks/useStores';

function CommentList({ className, comments, onDeleteComment }) {
  const { t } = useTranslation();

  const {
    themeStore: { theme },
    userStore: {
      user: { id: userId },
    },
  } = useStores();

  return (
    <div className={`comment-list-wrapper ${className}`}>
      {(!comments || comments?.length < 1) && (
        <EmptyContent minHeight="auto" className="empty-comments" border>
          <div>{t('코멘트가 없습니다.')}</div>
        </EmptyContent>
      )}
      {comments?.length > 0 && (
        <ul>
          {comments.map(comment => {
            return (
              <li key={comment.id}>
                <div>
                  <div className="writer">
                    <UserAvatar className="user-icon" avatarInfo={comment.user?.avatarInfo} size={48} fill rounded />
                  </div>
                  <div className="comment-content">
                    <Viewer theme={theme === 'DARK' ? 'dark' : 'white'} initialValue={comment.comment || '<span className="none-text">&nbsp;</span>'} />
                  </div>
                </div>

                <div className="comment-user-info">
                  <div>{dateUtil.getDateString(comment.lastUpdateDate)}</div>
                  <div>
                    <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 0.5rem" />
                  </div>

                  <div>{comment.user?.name}</div>
                  {onDeleteComment && comment.user?.id === userId && (
                    <>
                      <div>
                        <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 0.5rem" />
                      </div>
                      <div>
                        <Link
                          className="comment-delete-link"
                          to="/"
                          onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDeleteComment(comment.id);
                          }}
                        >
                          {t('삭제')}
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

CommentList.defaultProps = {
  className: '',
  comments: [],
  onDeleteComment: null,
};

CommentList.propTypes = {
  className: PropTypes.string,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
    }),
  ),
  onDeleteComment: PropTypes.func,
};

export default CommentList;
