import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Viewer } from '@toast-ui/react-editor';
import PropTypes from 'prop-types';
import useStores from '@/hooks/useStores';
import './UserContentViewer.scss';
import ImagePortal from '@/components/UserContent/UserContentViewer/ImagePortal';

function UserContentViewer({ className, content }) {
  const {
    themeStore: { theme },
  } = useStores();

  const element = useRef();
  const [image, setImage] = useState(null);

  const handleImageClick = useCallback(e => {
    if (e.target.tagName === 'IMG') {
      setImage(e.target.src);
    }
  }, []);

  useEffect(() => {
    let editorContent;
    if (element.current) {
      editorContent = element.current?.querySelector('.toastui-editor-contents');
      editorContent?.addEventListener('click', handleImageClick);
    }

    return () => {
      editorContent?.removeEventListener('click', handleImageClick);
    };
  }, [element?.current, content]);

  return (
    <div className={`user-content-viewer-wrapper ${className}`} ref={element}>
      <Viewer theme={theme === 'DARK' ? 'dark' : 'white'} initialValue={content || '<span>&nbsp;</span>'} />
      {image && (
        <ImagePortal onImageClick={() => setImage(null)}>
          <img src={image} alt="MAX" />
        </ImagePortal>
      )}
    </div>
  );
}

UserContentViewer.defaultProps = {
  className: '',
  content: '',
};

UserContentViewer.propTypes = {
  className: PropTypes.string,
  content: PropTypes.string,
};

export default UserContentViewer;
