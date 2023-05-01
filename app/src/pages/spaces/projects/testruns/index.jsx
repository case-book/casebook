import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Message, TestrunEditPage, TestrunExecutePage, TestrunInfoPage, TestrunListPage, TestrunReservationEditPage, TestrunReservationInfoPage, TestrunReservationListPage } from '@/pages';

function TestrunsRoutes() {
  return (
    <Routes>
      <Route path="/:testrunId/edit" element={<TestrunEditPage type="edit" />} />
      <Route path="/:testrunId/info" element={<TestrunInfoPage />} />
      <Route path="/:testrunId" element={<TestrunExecutePage />} />
      <Route path="/new" element={<TestrunEditPage />} />
      <Route path="/reservations/new" element={<TestrunReservationEditPage />} />
      <Route path="/reservations/:testrunReservationId/info" element={<TestrunReservationInfoPage />} />
      <Route path="/reservations/:testrunReservationId/edit" element={<TestrunReservationEditPage type="edit" />} />
      <Route path="/reservations" element={<TestrunReservationListPage />} />
      <Route path="/" element={<TestrunListPage />} />
      <Route path="*" element={<Message code="404" />} />
    </Routes>
  );
}

export default TestrunsRoutes;
