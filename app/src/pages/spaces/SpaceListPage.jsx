import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, CardContent, CloseIcon, EmptyContent, Input, Page, PageContent, Tag } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import SpaceService from '@/services/SpaceService';
import { useResizeDetector } from 'react-resize-detector';
import useStores from '@/hooks/useStores';
import './SpaceListPage.scss';

const scrollUnit = 360 + 16;

function SpaceListPage() {
  const { t } = useTranslation();

  const {
    configStore: { version },
  } = useStores();

  const [isSearch, setIsSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [queryList, setQueryList] = useState(null);
  const searchElement = useRef(null);

  const navigate = useNavigate();
  const [spaces, setSpaces] = useState([]);
  const listContentElement = useRef(null);
  const listElement = useRef(null);
  const [navigator, setNavigator] = useState(false);

  const { width, ref } = useResizeDetector({
    handleHeight: false,
    refreshMode: 'throttle',
    refreshRate: 100,
  });

  const onChangeWidth = () => {
    if (listContentElement?.current && listElement?.current) {
      const contentWidth = listContentElement.current?.offsetWidth;
      const listWidth = listElement.current?.offsetWidth;

      if (contentWidth < listWidth && navigator === false) {
        setNavigator(true);
      }

      if (contentWidth > listWidth && navigator) {
        setNavigator(false);
      }
    }
  };

  useEffect(() => {
    SpaceService.selectMySpaceList(list => {
      setSpaces(list);
      onChangeWidth();
    });
  }, []);

  useEffect(() => {
    onChangeWidth();
  }, [width, spaces]);

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

  const scrollLeft = () => {
    if (listContentElement.current) {
      let nextScrollLeft = listContentElement.current.scrollLeft;
      nextScrollLeft -= scrollUnit;
      if (nextScrollLeft < 0) {
        nextScrollLeft = 0;
      } else {
        nextScrollLeft -= nextScrollLeft % scrollUnit;
      }

      listContentElement.current.scrollLeft = nextScrollLeft;
    }
  };

  const scrollRight = () => {
    if (listContentElement.current) {
      let nextScrollLeft = listContentElement.current.scrollLeft;
      nextScrollLeft += scrollUnit;
      nextScrollLeft -= nextScrollLeft % scrollUnit;
      listContentElement.current.scrollLeft = nextScrollLeft;
    }
  };

  return (
    <Page className="space-list-page-wrapper" list wide>
      <PageContent className="page-content">
        <div className="intro">
          <div className="foreground">
            <div className="intro-button">
              <Button
                outline
                onClick={() => {
                  navigate('/spaces/new');
                }}
              >
                <i className="fa-solid fa-plus" /> {t('새 스페이스')}
              </Button>
              <Button
                outline
                onClick={e => {
                  e.preventDefault();
                  setIsSearch(true);
                }}
              >
                <i className="fa-solid fa-magnifying-glass" /> {t('스페이스 검색')}
              </Button>
            </div>
            <div className="space-message">
              <div>
                {t('스페이스를 선택해주세요.')}
                <div className="icons">
                  <div className="snow">
                    <i className="fa-solid fa-star-of-life" />
                  </div>
                  <div className="star">
                    <i className="fa-solid fa-star" />
                  </div>
                  <div className="heart">
                    <i className="fa-solid fa-heart" />
                  </div>
                  <div className="book">
                    <i className="fa-solid fa-book" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-list-content" ref={ref}>
          <div>
            {navigator && (
              <div className="arrow">
                <Button shadow={false} onClick={scrollLeft}>
                  <i className="fa-solid fa-chevron-left" />
                </Button>
              </div>
            )}
            <div
              className="space-card-list scrollbar-sm"
              ref={listContentElement}
              onWheel={e => {
                if (e.deltaY > 0) {
                  scrollRight();
                } else {
                  scrollLeft();
                }
              }}
            >
              <ul ref={listElement}>
                {spaces?.map((space, inx) => {
                  return (
                    <li
                      key={space.id}
                      style={{
                        animationDelay: `${inx * 0.1}s`,
                      }}
                    >
                      <Card
                        className="space-card"
                        circle
                        color="gray"
                        point
                        onClick={() => {
                          navigate(`/spaces/${space.code}/projects`);
                        }}
                      >
                        <CardContent className="space-card-content">
                          <div className="config-button">
                            <Button
                              rounded
                              outline
                              size="sm"
                              onClick={e => {
                                e.stopPropagation();
                                navigate(`/spaces/${space.code}/info`);
                              }}
                            >
                              <i className="fa-solid fa-gear" />
                            </Button>
                          </div>
                          <div className="name-and-code">
                            <div className="name">{space.name}</div>
                            <div className="code">
                              <Tag>{space.code}</Tag>
                            </div>
                          </div>
                          <div className="description">
                            <div>{space.description}</div>
                          </div>
                          <div className="counter-info">
                            <div>
                              <div>
                                <div className="icon projects">
                                  <div>
                                    <i className="fa-solid fa-shield-heart" />
                                  </div>
                                </div>
                                <div className="label projects">PROJECTS</div>
                                <div className="counter projects">
                                  <div>{space.projectCount}</div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div>
                                <div className="icon users">
                                  <div>
                                    <i className="fa-solid fa-shield-cat" />
                                  </div>
                                </div>
                                <div className="label users">USERS</div>
                                <div className="counter users">
                                  <div>{space.users?.length}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </li>
                  );
                })}
                <li
                  style={{
                    animationDelay: `${(spaces?.length || 1) * 0.1}s`,
                  }}
                >
                  <Card
                    className="space-card"
                    color="gray"
                    point
                    onClick={() => {
                      navigate('/spaces/new');
                    }}
                  >
                    <div className="new-space-card-content">
                      <div>
                        <div className="plus-icon">
                          <i className="fa-solid fa-plus" />
                        </div>
                        <div>{t('새 스페이스')}</div>
                      </div>
                    </div>
                  </Card>
                </li>
              </ul>
            </div>
            {navigator && (
              <div className="arrow">
                <Button shadow={false} onClick={scrollRight}>
                  <i className="fa-solid fa-chevron-right" />
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="version">
          <div className="app-version">
            {process.env.REACT_APP_NAME}-{process.env.REACT_APP_VERSION}
          </div>
          <div className="slash">/</div>
          <div className="api-version">
            {version?.name}-{version?.version}
          </div>
        </div>
        <div className={`space-search-content ${isSearch ? 'on' : 'off'}`} ref={searchElement}>
          <div>
            <CloseIcon className="close-icon" onClick={closeSearch} />
            <div className="search-row">
              <div className="text">스페이스 검색</div>
              <div className="icon">
                <i className="fa-solid fa-magnifying-glass" />
              </div>
              <div className="query">
                <Input
                  value={query}
                  color="white"
                  size="lg"
                  onKeyDown={e => {
                    if (e.keyCode === 13) {
                      search();
                    }
                  }}
                  onChange={setQuery}
                  placeholder="스페이스 명이나 스페이스 코드"
                />
              </div>
              <div className="control">
                <Button
                  size="lg"
                  color="primary"
                  onClick={() => {
                    search();
                  }}
                >
                  검색
                </Button>
              </div>
            </div>
            <div className="search-list">
              {queryList?.length > 0 && (
                <ul>
                  {queryList.map(space => {
                    return (
                      <li key={space.id}>
                        {space.isMember && <span className="member">MEMBER</span>}
                        <Link to={`/spaces/${space.code}/info`}>{space.name}</Link>
                      </li>
                    );
                  })}
                </ul>
              )}
              {queryList?.length < 1 && <EmptyContent className="empty-content">검색 결과가 없습니다.</EmptyContent>}
              {queryList === null && <EmptyContent className="empty-content">스페이스를 검색할 수 있습니다.</EmptyContent>}
            </div>
          </div>
        </div>
      </PageContent>
    </Page>
  );
}

export default SpaceListPage;
