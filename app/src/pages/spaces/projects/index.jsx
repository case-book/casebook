import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ProjectEditPage, EditProjectConfig, Message, ProjectConfigInfoPage, ProjectOverviewInfoPage, SpaceProjectListPage } from '@/pages';

function ProjectsRoutes() {
  return (
    <Routes>
      <Route path="/new" element={<ProjectEditPage />} />
      <Route path="/:id/config/edit" element={<EditProjectConfig />} />
      <Route path="/:id/config" element={<ProjectConfigInfoPage />} />
      <Route path="/:id" element={<ProjectOverviewInfoPage />} />
      <Route path="/" element={<SpaceProjectListPage />} />
      <Route path="*" element={<Message code="404111" />} />
    </Routes>
  );
}

export default ProjectsRoutes;
