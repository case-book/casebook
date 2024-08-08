import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Message, SpaceDashboardPage, SpaceEditPage, SpaceInfoPage, SpaceListPage, SpaceVariableEditPage } from '@/pages';
import ProjectsRoutes from '@/pages/spaces/projects';

function SpacesRoutes() {
  return (
    <Routes>
      <Route path="/:spaceCode/projects/*" element={<ProjectsRoutes />} />
      <Route path="/new" element={<SpaceEditPage />} />
      <Route path="/:spaceCode/dashboard" element={<SpaceDashboardPage />} />
      <Route path="/:spaceCode/edit" element={<SpaceEditPage type="edit" />} />
      <Route path="/:spaceCode/info" element={<SpaceInfoPage />} />
      <Route path="/:spaceCode/variables" element={<SpaceVariableEditPage />} />
      <Route path="/search" element={<SpaceListPage />} />
      <Route path="*" element={<Message code="404" />} />
    </Routes>
  );
}

export default SpacesRoutes;
