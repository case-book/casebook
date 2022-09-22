import React, { useEffect, useState } from 'react';

import { Button, Card, Page, PageContent, PageTitle, Tag } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import SpaceService from '@/services/SpaceService';
import './Spaces.scss';

function Spaces() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [spaces, setSpaces] = useState([]);

  useEffect(() => {
    SpaceService.selectMySpaceList(list => {
      setSpaces(list);
    });
  }, []);

  return (
    <Page className="spaces-wrapper" list>
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
        <ul className="space-card-list">
          {spaces?.map(space => {
            return (
              <li key={space.id}>
                <Card
                  className="space-card"
                  circle
                  color="gray"
                  point
                  onClick={() => {
                    navigate(`/spaces/${space.code}`);
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
                        <div className="icon bugs">
                          <div>
                            <i className="fa-solid fa-shield-virus" />
                          </div>
                        </div>
                        <div className="label bugs">BUGS</div>
                        <div className="counter bugs">
                          <div>{Math.floor(Math.random() * 20)}</div>
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
          <li>
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
                  <div>새 스페이스</div>
                </div>
              </div>
            </Card>
          </li>
        </ul>
      </PageContent>
    </Page>
  );
}

export default Spaces;
