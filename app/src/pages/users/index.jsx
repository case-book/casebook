import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Join, Login, Message, MyEditPage, MyInfoPage, PasswordChangePage } from '@/pages';

function UsersRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/my/password" element={<PasswordChangePage />} />
      <Route path="/my/edit" element={<MyEditPage />} />
      <Route path="/my" element={<MyInfoPage />} />
      <Route path="/join" element={<Join />} />
      <Route path="*" element={<Message code="404" />} />
    </Routes>
  );
}

export default UsersRoutes;
