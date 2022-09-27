import React, { useEffect, useState } from 'react';
import { Button, Card, Liner, Page, PageContent, PageTitle } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import ProjectService from '@/services/ProjectService';
import './ProjectListPage.scss';
import { MENUS } from '@/constants/menu';

function Spaces() {
  const { t } = useTranslation();
  const { spaceCode } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    ProjectService.selectProjectList(spaceCode, list => {
      console.log(list);
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
        <ul className="project-list white">
          {projects?.map(project => {
            return (
              <li key={project.id}>
                <div className="project-info">
                  <div
                    className="name"
                    onClick={() => {
                      navigate(`/spaces/${spaceCode}/projects/${project.id}`);
                    }}
                  >
                    {project.name}
                  </div>
                  <ul className="project-menu">
                    {MENUS.map((menu, inx) => {
                      return (
                        <li key={inx}>
                          <div
                            onClick={() => {
                              navigate(`/spaces/${spaceCode}/projects/${project.id}${menu.to}`);
                            }}
                          >
                            {menu.name}
                          </div>
                          <div>
                            <Liner className="liner" display="inline-block" width="1px" height="8px" color="black" margin="0 0.5rem" />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="project-status">
                  <div>
                    <div
                      onClick={() => {
                        navigate(`/spaces/${spaceCode}/projects/${project.id}/testcases`);
                      }}
                    >
                      <div className="icon">
                        <i className="fa-solid fa-briefcase" />
                      </div>
                      <div className="count">{project.testcaseCount}</div>
                      <div className="label">TESTCASES</div>
                    </div>
                    <div
                      onClick={() => {
                        navigate(`/spaces/${spaceCode}/projects/${project.id}/bugs`);
                      }}
                    >
                      <div className="icon">
                        <i className="fa-solid fa-virus" />
                      </div>
                      <div className="count bugs">{project.bugCount}</div>
                      <div className="label">BUGS</div>
                    </div>
                    <div
                      onClick={() => {
                        navigate(`/spaces/${spaceCode}/projects/${project.id}/testruns`);
                      }}
                    >
                      <div className="icon">
                        <i className="fa-regular fa-newspaper" />
                      </div>
                      <div className="count">{project.testrunCount}</div>
                      <div className="label">TESTRUN</div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

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
