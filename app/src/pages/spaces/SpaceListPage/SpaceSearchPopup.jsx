import React, { useEffect, useRef, useState } from 'react';
import { Button, CloseIcon, EmptyContent, Input, Text } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import SpaceService from '@/services/SpaceService';
import './SpaceSearchPopup.scss';
import PropTypes from 'prop-types';

function SpaceSearchPopup({ className, isSearch, setIsSearch }) {
  const { t } = useTranslation();

  const [query, setQuery] = useState('');
  const [queryList, setQueryList] = useState(null);
  const searchElement = useRef(null);
  const navigate = useNavigate();

  const search = () => {
    SpaceService.selectSpaceList(query, list => {
      setQueryList(list);
    });
  };

  const closeSearch = () => {
    setIsSearch(false);

    setTimeout(() => {
      setQueryList(null);
      setQuery('');
    }, 500);
  };

  const handleOutsideClick = event => {
    if (searchElement.current && !searchElement.current.contains(event.target)) {
      closeSearch();
    }
  };

  useEffect(() => {
    if (isSearch) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isSearch]);

  return (
    <div className={`space-search-popup-wrapper ${className} ${isSearch ? 'on' : 'off'}`} ref={searchElement}>
      <div>
        <CloseIcon className="close-icon" onClick={closeSearch} />
        <div className="search-row">
          <div className="text">{t('스페이스 검색')}</div>
          <div className="icon">
            <i className="fa-solid fa-magnifying-glass" />
          </div>
          <div className="query">
            <Input
              value={query}
              size="md"
              outline
              onKeyDown={e => {
                if (e.keyCode === 13) {
                  search();
                }
              }}
              onChange={setQuery}
              placeholder={t('스페이스 명이나 스페이스 코드를 입력해주세요.')}
            />
          </div>
          <div className="control">
            <Button
              size="md"
              color="primary"
              onClick={() => {
                search();
              }}
            >
              {t('검색')}
            </Button>
          </div>
        </div>
        <div className="search-list">
          {queryList?.length > 0 && (
            <ul>
              {queryList.map(space => {
                return (
                  <li
                    key={space.id}
                    onClick={() => {
                      navigate(`/spaces/${space.code}/info`);
                    }}
                  >
                    <div className={`member ${space.isMember ? 'is-member' : ''}`}>
                      {space.isMember && <span>MEMBER</span>}
                      {!space.isMember && <span>NO AUTH</span>}
                    </div>
                    <Text className="text">{space.name}</Text>
                  </li>
                );
              })}
            </ul>
          )}
          {queryList?.length < 1 && <EmptyContent className="empty-content">{t('검색 결과가 없습니다.')}</EmptyContent>}
          {queryList === null && <EmptyContent className="empty-content">{t('스페이스를 검색할 수 있습니다.')}</EmptyContent>}
        </div>
      </div>
    </div>
  );
}

SpaceSearchPopup.defaultProps = {
  className: '',
  isSearch: false,
  setIsSearch: null,
};

SpaceSearchPopup.propTypes = {
  className: PropTypes.string,
  isSearch: PropTypes.bool,
  setIsSearch: PropTypes.func,
};

export default SpaceSearchPopup;
