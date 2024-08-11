import React from 'react';
import { Button } from '@/components';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import './CommentBadge.scss';

function CommentBadge({ count, onClick }) {
  return (
    <div className={classNames('comment-badge-wrapper', { 'has-comment': count > 0 })}>
      <Button color="primary" rounded onClick={onClick}>
        <i className="fa-solid fa-message" />
        <span className="badge">
          <span>{count}</span>
        </span>
      </Button>
    </div>
  );
}

CommentBadge.defaultProps = {
  count: 0,
};

CommentBadge.propTypes = {
  count: PropTypes.number,
  onClick: PropTypes.func.isRequired,
};

export default CommentBadge;
