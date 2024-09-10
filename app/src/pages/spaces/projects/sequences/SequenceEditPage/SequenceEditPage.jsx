import React, { useCallback, useEffect, useRef, useState } from 'react';
import { addEdge, Background, Controls, MarkerType, MiniMap, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState } from '@xyflow/react';
import { Page, PageContent, PageTitle } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import ProjectService from '@/services/ProjectService';
import '@xyflow/react/dist/style.css';
import TestcaseService from '@/services/TestcaseService';
import TestcaseNode from '@/pages/spaces/projects/sequences/SequenceEditPage/TestcaseNode/TestcaseNode';
import './SequenceEditPage.scss';
import './over.scss';
import { ResizableBox } from 'react-resizable';
import TestcaseNavigator from '@/pages/spaces/projects/ProjectTestcaseEditPage/TestcaseNavigator/TestcaseNavigator';
import testcaseUtil from '@/utils/testcaseUtil';
import ButtonEdge from './ButtonEdge/ButtonEdge';
import 'react-resizable/css/styles.css';

const DEFAULT_BUTTON_EDGE = {
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
};

const DEFAULT_TESTCASE_NODE = {
  type: 'testcase',
  style: { width: 180, height: 60 },
  data: {
    label: '테스트케이스',
    resizable: true,
  },
};

const initialNodes = [
  {
    id: '1',
    position: { x: 100, y: 200 },
    ...DEFAULT_TESTCASE_NODE,
    data: {
      label: 'TC2 링크를 통한 초대',
      resizable: true,
    },
  },
  {
    id: '3',
    position: { x: 100, y: 400 },
    ...DEFAULT_TESTCASE_NODE,
    data: {
      label: 'TC3 회원 가입',
    },
  },
  {
    id: '4',
    position: { x: 500, y: 300 },
    ...DEFAULT_TESTCASE_NODE,
    data: {
      label: 'TC4 중복 로그인 처리',
    },
  },
];
const initialEdges = [
  {
    id: 'e1-4',
    source: '1',
    target: '4',
    ...DEFAULT_BUTTON_EDGE,
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    ...DEFAULT_BUTTON_EDGE,
  },
];

function SequenceEditPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { spaceCode, projectId } = useParams();
  const [project, setProject] = useState(null);
  const [testcaseGroups, setTestcaseGroups] = useState([]);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [allTestcaseGroups, setAllTestcaseGroups] = useState([]);

  const getTestcaseGroups = () => {
    TestcaseService.selectTestcaseGroupList(spaceCode, projectId, list => {
      setAllTestcaseGroups(list);
    });
  };

  useEffect(() => {
    if (allTestcaseGroups?.length > 0) {
      const nextGroups = testcaseUtil.getTestcaseTreeData(allTestcaseGroups);
      setTestcaseGroups(nextGroups);
    } else {
      setTestcaseGroups([]);
    }
  }, [allTestcaseGroups]);

  useEffect(() => {
    ProjectService.selectProjectName(spaceCode, projectId, info => {
      setProject(info);
    });

    getTestcaseGroups();
  }, [spaceCode, projectId]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    params => {
      setEdges(eds =>
        addEdge(
          {
            ...params,
            ...DEFAULT_BUTTON_EDGE,
          },
          eds,
        ),
      );
    },
    [setEdges],
  );

  console.log(setNodes);

  const nodeTypes = {
    testcase: TestcaseNode,
  };

  const edgeTypes = {
    buttonEdge: ButtonEdge,
  };

  const onDrop = useCallback(
    event => {
      console.log(event);
      console.log(reactFlowInstance);
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const testcase = JSON.parse(event.dataTransfer.getData('application/reactflow'));

      console.log(testcase);

      // 마우스 좌표를 통해 드랍된 위치 계산
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        id: String(testcase.id),
        position,
        ...DEFAULT_TESTCASE_NODE,
        data: {
          seqId: testcase.seqId,
          label: testcase.name,
          resizable: true,
        },
      };

      setNodes(nds => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  const onDragOver = useCallback(event => {
    event.preventDefault();
    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDragStart = (event, testcase) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(testcase));
    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.effectAllowed = 'move';
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
          <ReactFlowProvider>
            <div className="reactflow-wrapper" ref={reactFlowWrapper}>
              <ReactFlow
                snapToGrid
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
              >
                <Controls />
                <MiniMap />
                <Background variant="dots" gap={12} size={1} />
              </ReactFlow>
            </div>
          </ReactFlowProvider>
          <div className="testcase-group-content" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ResizableBox
              width={200}
              height="100%"
              minConstraints={[100, 100]} // 최소 크기 설정
              maxConstraints={[500, 200]} // 최대 크기 설정
              resizeHandles={['w']} // 좌측에만 핸들을 표시
            >
              <TestcaseNavigator
                testcaseGroups={testcaseGroups}
                onDragStart={(e, testcase) => {
                  console.log(testcase);
                  onDragStart(e, testcase);
                }}
              />
            </ResizableBox>
          </div>
        </div>
      </PageContent>
    </Page>
  );
}

SequenceEditPage.propTypes = {};

SequenceEditPage.defaultProps = {};

export default SequenceEditPage;
