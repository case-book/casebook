import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Message, TestrunEditPage, TestrunExecutePage, TestrunInfoPage, TestrunListPage } from '@/pages';

function TestrunsRoutes() {
  return (
    <Routes>
      <Route path="/:testrunId/edit" element={<TestrunEditPage type="edit" />} />
      <Route path="/:testrunId/info" element={<TestrunInfoPage />} />
      <Route path="/:testrunId" element={<TestrunExecutePage />} />
      <Route path="/new" element={<TestrunEditPage />} />
      <Route path="/" element={<TestrunListPage />} />
      <Route path="*" element={<Message code="404" />} />
    </Routes>
  );
}

export default TestrunsRoutes;
