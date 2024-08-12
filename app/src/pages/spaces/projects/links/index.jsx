import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Message, OpenLinkEditPage, OpenLinkListPage, ReportInfoPage } from '@/pages';

function LinksRoutes() {
  return (
    <Routes>
      <Route path="/:reportId" element={<ReportInfoPage />} />
      <Route path="/new" element={<OpenLinkEditPage />} />
      <Route path="/" element={<OpenLinkListPage />} />
      <Route path="*" element={<Message code="404" />} />
    </Routes>
  );
}

export default LinksRoutes;
