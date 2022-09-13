import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Message, Projects } from '@/pages';

function ProjectsRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Projects />} />
      <Route path="*" element={<Message code="404" />} />
    </Routes>
  );
}

export default ProjectsRoutes;
