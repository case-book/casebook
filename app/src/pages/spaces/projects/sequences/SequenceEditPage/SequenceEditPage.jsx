import React, { useCallback, useEffect, useState } from 'react';
import { addEdge, Background, Controls, MarkerType, MiniMap, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react';
import { Page, PageContent, PageTitle } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import ProjectService from '@/services/ProjectService';
import '@xyflow/react/dist/style.css';
import TestcaseService from '@/services/TestcaseService';
import TestcaseNode from '@/pages/spaces/projects/sequences/SequenceEditPage/TestcaseNode/TestcaseNode';
import ButtonEdge from './ButtonEdge/ButtonEdge';
import './SequenceEditPage.scss';
import './over.scss';

const initialNodes = [
  {
    id: '1',
    type: 'testcase',
    position: { x: 100, y: 200 },
    data: {
      label: 'TC2 링크를 통한 초대',
      resizable: true,
    },
    style: { width: 180, height: 60 },
  },
  {
    id: '3',
    type: 'testcase',
    position: { x: 100, y: 400 },
    data: {
      label: 'TC3 회원 가입',
    },
    style: { width: 180, height: 60 },
  },
  {
    id: '4',
    type: 'testcase',
    position: { x: 500, y: 300 },
    data: {
      label: 'TC4 중복 로그인 처리',
    },
    style: { width: 180, height: 60 },
  },
];
const initialEdges = [
  {
    id: 'e1-4',
    source: '1',
    target: '4',
    type: 'buttonEdge',
    data: { curveType: 'step' },
    markerEnd: {
      type: MarkerType.Arrow,
      width: 16,
      height: 16,
    },
    style: {
      strokeWidth: 2,
    },
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    type: 'buttonEdge',
    data: { curveType: 'step' },
    markerEnd: {
      type: MarkerType.Arrow,
      width: 16,
      height: 16,
    },
    style: {
      strokeWidth: 2,
    },
  },
];

function SequenceEditPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { spaceCode, projectId } = useParams();
  const [project, setProject] = useState(null);
  const [projectTestcaseList, setProjectTestcaseList] = useState([]);

  useEffect(() => {
    ProjectService.selectProjectName(spaceCode, projectId, info => {
      setProject(info);
    });

    TestcaseService.selectTestcaseList(spaceCode, projectId, list => {
      setProjectTestcaseList(list);
    });
  }, [spaceCode, projectId]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(params => setEdges(eds => addEdge(params, eds)), [setEdges]);

  console.log(projectTestcaseList, setNodes);

  const nodeTypes = {
    testcase: TestcaseNode,
  };

  const edgeTypes = {
    buttonEdge: ButtonEdge,
  };

  return (
    <Page className="sequence-edit-page-wrapper">
      <PageTitle
        borderBottom={false}
        marginBottom={false}
        breadcrumbs={[
          { to: '/', text: t('HOME') },
          {
            to: `/spaces/${spaceCode}/info`,
            text: spaceCode,
          },
          {
            to: `/spaces/${spaceCode}/projects`,
            text: t('프로젝트 목록'),
          },
          {
            to: `/spaces/${spaceCode}/projects/${projectId}`,
            text: project?.name,
          },
          {
            to: `/spaces/${spaceCode}/projects/${projectId}/releases`,
            text: t('릴리스 목록'),
          },
        ]}
        links={[
          {
            to: `/spaces/${spaceCode}/projects/${projectId}/releases/new`,
            text: t('릴리스'),
            color: 'primary',
            icon: <i className="fa-solid fa-plus" />,
          },
        ]}
        onListClick={() => {
          navigate(`/spaces/${spaceCode}/projects`);
        }}
      >
        {t('케이스 시퀀스')}
      </PageTitle>
      <PageContent className="page-content">
        <div>
          <div>
            <ReactFlow snapToGrid nodes={nodes} edges={edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect}>
              <Controls />
              <MiniMap />
              <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
          </div>
        </div>
      </PageContent>
    </Page>
  );
}

SequenceEditPage.propTypes = {};

SequenceEditPage.defaultProps = {};

export default SequenceEditPage;
