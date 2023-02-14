import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Message, ReportInfoPage, ReportListPage } from '@/pages';

function ReportsRoutes() {
  return (
    <Routes>
      <Route path="/:reportId" element={<ReportInfoPage />} />
      <Route path="/" element={<ReportListPage />} />
      <Route path="*" element={<Message code="404" />} />
    </Routes>
  );
}

export default ReportsRoutes;
