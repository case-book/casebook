import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Page, PageContent, PageTitle, Tag } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import SpaceService from '@/services/SpaceService';
import { useResizeDetector } from 'react-resize-detector';
import './SpaceListPage.scss';

const scrollUnit = 360 + 16;

function SpaceListPage() {
  const { t } = useTranslation();
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

  return (
    <Page className="space-list-page-wrapper" list wide>
      <PageTitle
        className="page-title"
        links={[
          <Link to="/spaces/new">
            <i className="fa-solid fa-plus" /> {t('새 스페이스')}
          </Link>,
        ]}
      >
        {t('내 스페이스')}
      </PageTitle>
      <PageContent>
        <div className="space-list-content" ref={ref}>
          {navigator && (
            <div className="arrow">
              <Button
                onClick={() => {
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
                }}
              >
                <i className="fa-solid fa-chevron-left" />
              </Button>
            </div>
          )}
          <div className="space-card-list" ref={listContentElement}>
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
                      <div className="config-button">
                        <Button
                          outline
                          rounded
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
                          <Tag color="white">{space.code}</Tag>
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
              <Button
                onClick={() => {
                  if (listContentElement.current) {
                    let nextScrollLeft = listContentElement.current.scrollLeft;
                    nextScrollLeft += scrollUnit;
                    nextScrollLeft -= nextScrollLeft % scrollUnit;
                    listContentElement.current.scrollLeft = nextScrollLeft;
                  }
                }}
              >
                <i className="fa-solid fa-chevron-right" />
              </Button>
            </div>
          )}
        </div>
      </PageContent>
    </Page>
  );
}

export default SpaceListPage;
