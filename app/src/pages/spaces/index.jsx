import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { EditSpace, Message, Spaces } from '@/pages';

function SpacesRoutes() {
  return (
    <Routes>
      <Route path="/new" element={<EditSpace />} />
      <Route path="/:id/edit" element={<EditSpace type="edit" />} />
      <Route path="/" element={<Spaces />} />
      <Route path="*" element={<Message code="404" />} />
    </Routes>
  );
}

export default SpacesRoutes;
