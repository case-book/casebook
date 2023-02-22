import React from 'react';
import PropTypes from 'prop-types';
import Button from '@/components/Button/Button';
import Liner from '@/components/Liner/Liner';
import i18n from 'i18next';
import './PageButtons.scss';

function PageButtons(props) {
  const { className, size, outline } = props;
  const {
    onList,
    onListText,
    onListIcon,
    onInfo,
    onInfoText,
    onInfoIcon,
    onDelete,
    onDeleteText,
    onDeleteIcon,
    onSubmit,
    onSubmitText,
    onSubmitIcon,
    onEdit,
    onEditText,
    onEditIcon,
    onCancel,
    onCancelText,
    onCancelIcon,
    border,
    onBack,
    onBackText,
    onBackIcon,
  } = props;
  return (
    <div className={`page-buttons-wrapper ${className} ${onDelete ? 'has-delete' : ''}`}>
      {border && <div className="bottom-liner" />}
      <div className="button-content">
        {onDelete && (
          <div className="delete-buttons">
            <Button className="delete-button" type="button" size={size} color="danger" outline={outline} onClick={onDelete}>
              <div>
                {onDeleteIcon && (
                  <div className="icon delete-icon">
                    <span>{onDeleteIcon}</span>
                  </div>
                )}
                <div>{onDeleteText}</div>
              </div>
            </Button>
          </div>
        )}
        <div className="other-buttons">
          {onBack && (
            <Button type="button" size={size} color="white" outline={outline} onClick={onBack}>
              <div>
                {onBackIcon && (
                  <div className="icon">
                    <span>{onBackIcon}</span>
                  </div>
                )}
                <div>{onBackText}</div>
              </div>
            </Button>
          )}
          {onCancel && (
            <Button type="button" size={size} color="white" outline={outline} onClick={onCancel}>
              <div>
                {onCancelIcon && (
                  <div className="icon">
                    <span>{onCancelIcon}</span>
                  </div>
                )}
                <div>{onCancelText}</div>
              </div>
            </Button>
          )}
          {onList && (
            <>
              {(onBack || onCancel) && <Liner display="inline-block" width="1px" height="10px" margin="0 0.5rem" />}
              <Button type="button" size={size} color="white" outline={outline} onClick={onList}>
                <div>
                  {onListIcon && (
                    <div className="icon">
                      <span>{onListIcon}</span>
                    </div>
                  )}
                  <div>{onListText}</div>
                </div>
              </Button>
            </>
          )}
          {onInfo && (
            <>
              {(onBack || onCancel || onList) && <Liner display="inline-block" width="1px" height="10px" margin="0 0.5rem" />}
              <Button type="button" size={size} color="white" outline={outline} onClick={onInfo}>
                <div>
                  {onInfoIcon && (
                    <div className="icon">
                      <span>{onInfoIcon}</span>
                    </div>
                  )}
                  <div>{onInfoText}</div>
                </div>
              </Button>
            </>
          )}
          {onEdit && (
            <>
              {(onBack || onCancel || onList || onInfo) && <Liner display="inline-block" width="1px" height="10px" margin="0 0.5rem" />}
              <Button type="button" size={size} color="white" outline={outline} onClick={onEdit}>
                <div>
                  {onEditIcon && (
                    <div className="icon">
                      <span>{onEditIcon}</span>
                    </div>
                  )}
                  <div>{onEditText}</div>
                </div>
              </Button>
            </>
          )}
          {onSubmit && (
            <>
              {(onBack || onCancel || onList || onInfo || onEdit) && <Liner display="inline-block" width="1px" height="10px" margin="0 0.5rem" />}
              <Button type="submit" size={size} color="white" outline={outline}>
                <div>
                  {onSubmitIcon && (
                    <div className="icon">
                      <span>{onSubmitIcon}</span>
                    </div>
                  )}
                  <div>{onSubmitText}</div>
                </div>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

PageButtons.defaultProps = {
  className: '',
  size: 'lg',
  outline: true,
  onListText: i18n.t('목록'),
  onListIcon: '', // <i className="far fa-file-alt" />,
  onInfoText: i18n.t('정보'),
  onInfoIcon: '', // <i className="far fa-file-alt" />,
  onDeleteText: i18n.t('삭제'),
  onDeleteIcon: '', // <i className="far fa-trash-alt" />,
  onSubmitText: i18n.t('저장'),
  onSubmitIcon: '', // <i className="far fa-paper-plane" />,
  onEditText: i18n.t('편집'),
  onEditIcon: '', // <i className="fas fa-pen-nib" />,
  onCancelText: i18n.t('취소'),
  onCancelIcon: '', // <i className="fas fa-chevron-left" />,
  onList: null,
  onInfo: null,
  onDelete: null,
  onSubmit: null,
  onEdit: null,
  onCancel: null,
  border: false,
  onBackText: i18n.t('뒤로'),
  onBackIcon: '', // <i className="fas fa-chevron-left" />
  onBack: null,
};

PageButtons.propTypes = {
  className: PropTypes.string,
  size: PropTypes.string,
  outline: PropTypes.bool,
  onList: PropTypes.func,
  onListText: PropTypes.string,
  onListIcon: PropTypes.node,
  onInfo: PropTypes.func,
  onInfoText: PropTypes.string,
  onInfoIcon: PropTypes.node,
  onDelete: PropTypes.func,
  onDeleteText: PropTypes.string,
  onDeleteIcon: PropTypes.node,
  onSubmit: PropTypes.func,
  onSubmitText: PropTypes.string,
  onSubmitIcon: PropTypes.node,
  onEdit: PropTypes.func,
  onEditText: PropTypes.string,
  onEditIcon: PropTypes.node,
  onCancel: PropTypes.func,
  onCancelText: PropTypes.string,
  onCancelIcon: PropTypes.node,
  border: PropTypes.bool,
  onBack: PropTypes.func,
  onBackText: PropTypes.string,
  onBackIcon: PropTypes.node,
};

export default PageButtons;
