import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AdminIndexInfoPage, Message } from '@/pages';

function ApiRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminIndexInfoPage />} />
      <Route path="*" element={<Message code="404" />} />
    </Routes>
  );
}

export default ApiRoutes;
