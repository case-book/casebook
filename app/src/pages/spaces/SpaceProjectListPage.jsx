import React, { useEffect, useState } from 'react';

import { Button, Page, PageContent, PageTitle } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { useParams } from 'react-router';
import ProjectService from '@/services/ProjectService';
import './SpaceProjectListPage.scss';

function Spaces() {
  const { t } = useTranslation();
  const { spaceCode } = useParams();

  console.log(spaceCode);

  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    ProjectService.selectProjectList(spaceCode, list => {
      console.log(list);
      setProjects(list);
    });
  }, []);

  return (
    <Page className="space-project-list-page-wrapper" list>
      <PageTitle
        className="page-title"
        links={[
          <Link to={`/spaces/${spaceCode}/projects/new`}>
            <i className="fa-solid fa-plus" /> {t('프로젝트')}
          </Link>,
        ]}
      >
        {t('프로젝트')}
      </PageTitle>
      <PageContent>
        <div className="space-card-list">
          {projects?.map(project => {
            return (
              <div
                key={project.id}
                className="space-card-wrapper"
                onClick={() => {
                  navigate(`/spaces/${spaceCode}/projects/${project.id}`);
                }}
              >
                <div className="config-button">
                  <Button
                    outline
                    rounded
                    size="sm"
                    onClick={e => {
                      e.stopPropagation();
                      navigate(`/spaces/${spaceCode}/projects/${project.id}`);
                    }}
                  >
                    <i className="fa-solid fa-gear" />
                  </Button>
                </div>
                <div className="name-and-code">
                  <div className="name">{project.name}</div>
                </div>
                <div className="description">
                  <div>{project.description}</div>
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
