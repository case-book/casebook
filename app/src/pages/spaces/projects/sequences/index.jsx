import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Message, SequenceEditPage, SequenceListPage } from '@/pages';

function SequencesRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SequenceListPage />} />
      <Route path="/:sequenceId" element={<SequenceEditPage />} />
      <Route path="*" element={<Message code="404" />} />
    </Routes>
  );
}

export default SequencesRoutes;
