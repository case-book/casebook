import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Join, Login, Message } from '@/pages';

function UsersRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/join" element={<Join />} />
      <Route path="*" element={<Message code="404" />} />
    </Routes>
  );
}

export default UsersRoutes;
