import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Message } from '@/pages';
import ApiIndexInfoPage from '@/pages/apis/ApiIndexInfoPage';

function ApiRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ApiIndexInfoPage />} />
      <Route path="*" element={<Message code="404" />} />
    </Routes>
  );
}

export default ApiRoutes;
