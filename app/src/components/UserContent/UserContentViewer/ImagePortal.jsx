import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './ImagePortal.scss';

function ContentViewer({ children, portalRoot, onImageClick }) {
  return ReactDOM.createPortal(
    <div className="image-portal-wrapper" onClick={onImageClick}>
      {children}
    </div>,
    portalRoot,
  );
}

ContentViewer.defaultProps = {
  content: '',
  portalRoot: document.body,
};

ContentViewer.propTypes = {
  content: PropTypes.string,
  children: PropTypes.node.isRequired,
  onImageClick: PropTypes.func.isRequired,
  portalRoot: PropTypes.instanceOf(Element),
};

export default ContentViewer;
