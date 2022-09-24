import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { EditProjectConfig, Message, ProjectConfigInfoPage, ProjectEditPage, ProjectInfoPage, ProjectOverviewInfoPage, SpaceProjectListPage } from '@/pages';

function ProjectsRoutes() {
  return (
    <Routes>
      <Route path="/new" element={<ProjectEditPage />} />
      <Route path="/:projectId/edit" element={<ProjectEditPage type="edit" />} />
      <Route path="/:projectId/info" element={<ProjectInfoPage />} />
      <Route path="/:projectId/config/edit" element={<EditProjectConfig />} />
      <Route path="/:projectId/config" element={<ProjectConfigInfoPage />} />
      <Route path="/:projectId" element={<ProjectOverviewInfoPage />} />
      <Route path="/" element={<SpaceProjectListPage />} />
      <Route path="*" element={<Message code="404111" />} />
    </Routes>
  );
}

export default ProjectsRoutes;
