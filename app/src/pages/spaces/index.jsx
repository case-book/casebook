import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { EditProject, EditProjectConfig, EditSpace, Message, ProjectConfig, ProjectOverview, Projects, Space, SpaceProjectListPage, Spaces } from '@/pages';

function SpacesRoutes() {
  return (
    <Routes>
      <Route path="/new" element={<EditSpace />} />
      <Route path="/:id/edit" element={<EditSpace type="edit" />} />
      <Route path="/:id/info" element={<Space />} />
      <Route path="/:spaceCode/projects/new" element={<EditProject />} />
      <Route path="/:spaceCode/projects/:id/config/edit" element={<EditProjectConfig />} />
      <Route path="/:spaceCode/projects/:id/config" element={<ProjectConfig />} />
      <Route path="/:spaceCode/projects/:id" element={<ProjectOverview />} />

      <Route path="/:spaceCode" element={<SpaceProjectListPage />} />
      <Route path="/" element={<Projects />} />
      <Route path="/" element={<Spaces />} />
      <Route path="*" element={<Message code="404" />} />
    </Routes>
  );
}

export default SpacesRoutes;
