import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Message, SystemInfoPage } from '@/pages';

function ConfigsRoutes() {
  return (
    <Routes>
      <Route path="/system" element={<SystemInfoPage />} />
      <Route path="*" element={<Message code="404" />} />
    </Routes>
  );
}

export default ConfigsRoutes;
