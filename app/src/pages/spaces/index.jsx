import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Message, SpaceEditPage, SpaceInfoPage, SpaceListPage } from '@/pages';
import ProjectsRoutes from '@/pages/spaces/projects';

function SpacesRoutes() {
  return (
    <Routes>
      <Route path="/:spaceCode/projects/*" element={<ProjectsRoutes />} />
      <Route path="/new" element={<SpaceEditPage />} />
      <Route path="/:spaceCode/edit" element={<SpaceEditPage type="edit" />} />
      <Route path="/:spaceCode/info" element={<SpaceInfoPage />} />
      <Route path="/" element={<SpaceListPage />} />
      <Route path="*" element={<Message code="404" />} />
    </Routes>
  );
}

export default SpacesRoutes;
