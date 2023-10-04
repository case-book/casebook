import React from 'react';
import PropTypes from 'prop-types';
import './Tag.scss';
import { Button } from '@/components';

function Tag({ className, children, color, border, rounded, uppercase, size, onRemove }) {
  return (
    <div className={`tag-wrapper ${className} color-${color} ${border ? 'border' : ''} ${rounded ? 'rounded' : ''} ${uppercase ? 'uppercase' : ''} size-${size}`}>
      {children}
      {onRemove && (
        <Button className="remove-button" color="danger" rounded size="xs" onClick={onRemove}>
          <i className="fa-solid fa-xmark" />
        </Button>
      )}
    </div>
  );
}

Tag.defaultProps = {
  className: '',
  children: '',
  color: 'light',
  border: false,
  rounded: true,
  uppercase: false,
  size: 'xs',
  onRemove: null,
};

Tag.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  color: PropTypes.string,
  border: PropTypes.bool,
  rounded: PropTypes.bool,
  uppercase: PropTypes.bool,
  size: PropTypes.string,
  onRemove: PropTypes.func,
};

export default Tag;
