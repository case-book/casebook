import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Message, TestrunEditPage, TestrunListPage } from '@/pages';

function TestrunsRoutes() {
  return (
    <Routes>
      <Route path="/new" element={<TestrunEditPage />} />
      <Route path="/" element={<TestrunListPage />} />
      <Route path="*" element={<Message code="404" />} />
    </Routes>
  );
}

export default TestrunsRoutes;
