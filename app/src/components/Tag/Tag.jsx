import React from 'react';
import PropTypes from 'prop-types';
import './Tag.scss';
import { Button } from '@/components';

const getTagButtonSize = size => {
  switch (size) {
    case 'xs':
      return 'xxxs';
    case 'sm':
      return 'xxxs';
    case 'md':
      return 'xxs';
    case 'lg':
      return 'xs';
    case 'xl':
      return 'xs';
    case 'xxl':
      return 'xs';
    default:
      return 'xs';
  }
};

function Tag({ className, children, color, border, rounded, uppercase, size, onRemove }) {
  return (
    <div className={`tag-wrapper ${className} color-${color} ${border ? 'border' : ''} ${rounded ? 'rounded' : ''} ${uppercase ? 'uppercase' : ''} size-${size}`}>
      {children}
      {onRemove && (
        <Button className="remove-button" color="danger" rounded size={getTagButtonSize(size)} onClick={onRemove}>
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
