import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Message, SequenceEditPage } from '@/pages';

function SequencesRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SequenceEditPage />} />
      <Route path="*" element={<Message code="404" />} />
    </Routes>
  );
}

export default SequencesRoutes;
