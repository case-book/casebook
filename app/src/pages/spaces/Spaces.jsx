import React, { useEffect, useState } from 'react';

import { Button, Page, PageContent, PageTitle, Tag } from '@/components';
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
        <div className="space-card-list">
          {spaces?.map(space => {
            return (
              <div
                key={space.id}
                className="space-card-wrapper"
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
              </div>
            );
          })}
        </div>
      </PageContent>
    </Page>
  );
}

export default Spaces;
