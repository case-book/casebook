import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Message, SystemInfoPage, UserEditPage, UserInfoPage, UserListPage } from '@/pages';

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/systems" element={<SystemInfoPage />} />
      <Route path="/users/:userId/edit" element={<UserEditPage />} />
      <Route path="/users/:userId" element={<UserInfoPage />} />
      <Route path="/users" element={<UserListPage />} />
      <Route path="*" element={<Message code="404" />} />
    </Routes>
  );
}

export default AdminRoutes;
