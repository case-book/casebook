import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Message, SequenceEditPage, SequenceInfoPage, SequenceListPage } from '@/pages';

function SequencesRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SequenceListPage />} />
      <Route path="/new" element={<SequenceEditPage type="new" />} />
      <Route path="/:sequenceId/edit" element={<SequenceEditPage type="edit" />} />
      <Route path="/:sequenceId" element={<SequenceInfoPage />} />
      <Route path="*" element={<Message code="404" />} />
    </Routes>
  );
}

export default SequencesRoutes;
