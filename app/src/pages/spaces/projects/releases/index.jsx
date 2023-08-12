import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ReleaseListPage, ReleaseEditPage } from '@/pages';

function ReleasesRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ReleaseListPage />} />
      <Route path="/new" element={<ReleaseEditPage />} />
      <Route path="/:releaseId/edit" element={<ReleaseEditPage type="edit" />} />
    </Routes>
  );
}

export default ReleasesRoutes;
