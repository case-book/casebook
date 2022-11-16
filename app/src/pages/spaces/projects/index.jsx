import React from 'react';
import { Route, Routes } from 'react-router-dom';
import {
  EditProjectConfig,
  Message,
  ProjectBugInfoPage,
  ProjectConfigInfoPage,
  ProjectEditPage,
  ProjectInfoPage,
  ProjectOverviewInfoPage,
  ProjectReportInfoPage,
  ProjectTestcaseInfoPage,
  ProjectTestrunInfoPage,
  SpaceProjectListPage,
} from '@/pages';

function ProjectsRoutes() {
  return (
    <Routes>
      <Route path="/new" element={<ProjectEditPage />} />
      <Route path="/:projectId/edit" element={<ProjectEditPage type="edit" />} />
      <Route path="/:projectId/info" element={<ProjectInfoPage />} />
      <Route path="/:projectId/config/edit" element={<EditProjectConfig />} />
      <Route path="/:projectId/config" element={<ProjectConfigInfoPage />} />
      <Route path="/:projectId" element={<ProjectOverviewInfoPage />} />
      <Route path="/:projectId/testcases" element={<ProjectTestcaseInfoPage />} />
      <Route path="/:projectId/testruns" element={<ProjectTestrunInfoPage />} />
      <Route path="/:projectId/bugs" element={<ProjectBugInfoPage />} />
      <Route path="/:projectId/reports" element={<ProjectReportInfoPage />} />

      <Route path="/" element={<SpaceProjectListPage />} />
      <Route path="*" element={<Message code="404111" />} />
    </Routes>
  );
}

export default ProjectsRoutes;
