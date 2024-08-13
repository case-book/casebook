import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Message, OpenLinkEditPage, OpenLinkInfoPage, OpenLinkListPage } from '@/pages';

function LinksRoutes() {
  return (
    <Routes>
      <Route path="/:openLinkId" element={<OpenLinkInfoPage />} />
      <Route path="/new" element={<OpenLinkEditPage />} />
      <Route path="/" element={<OpenLinkListPage />} />
      <Route path="*" element={<Message code="404" />} />
    </Routes>
  );
}

export default LinksRoutes;
