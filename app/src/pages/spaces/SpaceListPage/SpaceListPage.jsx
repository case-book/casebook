import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, CardContent, Page, PageContent, Tag } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import SpaceService from '@/services/SpaceService';
import { useResizeDetector } from 'react-resize-detector';
import useStores from '@/hooks/useStores';
import './SpaceListPage.scss';
import SpaceSearchPopup from '@/pages/spaces/SpaceListPage/SpaceSearchPopup';

const scrollUnit = 360 + 16;

function SpaceListPage() {
  const { t } = useTranslation();

  const {
    configStore: { version, openReleasePopup },
  } = useStores();

  const [isSearch, setIsSearch] = useState(false);

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
    }, null);
  }, []);

  useEffect(() => {
    onChangeWidth();
  }, [width, spaces]);

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
    <Page className="space-list-page-wrapper" list>
      <PageContent className="page-content">
        <div className="intro">
          <div className="foreground">
            <div className="intro-button">
              <Button
                size="sm"
                outline
                onClick={() => {
                  navigate('/spaces/new');
                }}
              >
                <i className="fa-solid fa-plus" /> {t('새 스페이스')}
              </Button>
              <Button
                size="sm"
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
                <Button onClick={scrollLeft} color="transparent" outline={false}>
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
                        border
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
                              <Tag border>{space.code}</Tag>
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
                                  <div>{space.userCount}</div>
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
                    border
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
                <Button onClick={scrollRight} color="transparent" outline={false}>
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
          <div className="slash">/</div>
          <div className="api-version">
            <Link
              to="/"
              onClick={e => {
                e.preventDefault();
                openReleasePopup();
              }}
            >
              RELEASE LIST
            </Link>
          </div>
        </div>
        <SpaceSearchPopup isSearch={isSearch} setIsSearch={setIsSearch} />
      </PageContent>
    </Page>
  );
}

export default SpaceListPage;
