import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Message, SequenceEditPage, SequenceListPage } from '@/pages';

function SequencesRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SequenceListPage />} />
      <Route path="/new" element={<SequenceEditPage type="new" />} />
      <Route path="/:sequenceId/edit" element={<SequenceEditPage type="edit" />} />
      <Route path="*" element={<Message code="404" />} />
    </Routes>
  );
}

export default SequencesRoutes;
