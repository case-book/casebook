import React, { useEffect, useState } from 'react';
import { Button, Card, Page, PageContent, PageTitle } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import ProjectService from '@/services/ProjectService';
import './ProjectListPage.scss';

function Spaces() {
  const { t } = useTranslation();
  const { spaceCode } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    ProjectService.selectProjectList(spaceCode, list => {
      setProjects(list);
    });
  }, []);

  return (
    <Page className="project-list-page-wrapper" list>
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
        <ul className="project-card-list">
          {projects?.map(project => {
            return (
              <li key={project.id}>
                <Card
                  className="project-card-wrapper"
                  color="gray"
                  point
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
                        navigate(`/spaces/${spaceCode}/projects/${project.id}/info`);
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
                </Card>
              </li>
            );
          })}
        </ul>
      </PageContent>
    </Page>
  );
}

export default Spaces;
