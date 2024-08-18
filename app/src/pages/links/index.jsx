import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Message, OpenLinkPage } from '@/pages';

function LinksRoutes() {
  return (
    <Routes>
      <Route path="/:token" element={<OpenLinkPage />} />
      <Route path="*" element={<Message code="404" />} />
    </Routes>
  );
}

export default LinksRoutes;
