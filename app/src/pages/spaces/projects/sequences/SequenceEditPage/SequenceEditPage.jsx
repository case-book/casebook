import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { addEdge, Background, Controls, MarkerType, MiniMap, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState } from '@xyflow/react';
import { Button, Input, Liner, Page, PageContent, PageTitle, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import ProjectService from '@/services/ProjectService';
import '@xyflow/react/dist/style.css';
import TestcaseService from '@/services/TestcaseService';
import { SequenceEdge, TestcaseNode } from '@/assets';
import './SequenceEditPage.scss';
import { ResizableBox } from 'react-resizable';
import TestcaseNavigator from '@/pages/spaces/projects/ProjectTestcaseEditPage/TestcaseNavigator/TestcaseNavigator';
import testcaseUtil from '@/utils/testcaseUtil';

import 'react-resizable/css/styles.css';
import * as PropTypes from 'prop-types';
import SequenceService from '@/services/SequenceService';
import useStores from '@/hooks/useStores';

const DEFAULT_BUTTON_EDGE = {
  type: 'buttonEdge',
  data: { curveType: 'bezier', editable: true }, // bezier, straight, smoothstep, step
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
    editable: true,
  },
};

const initialNodes = [
  {
    id: '1',
    position: { x: 100, y: 200 },
    ...DEFAULT_TESTCASE_NODE,
    data: {
      label: 'TC2 링크를 통한 초대',
      editable: true,
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

console.log(initialNodes, initialEdges);

function SequenceEditPage({ type }) {
  const { t } = useTranslation();
  const {
    themeStore: { theme },
  } = useStores();
  const navigate = useNavigate();
  const reactFlowWrapper = useRef(null);
  const { spaceCode, projectId, sequenceId } = useParams();
  const [project, setProject] = useState(null);
  const [testcaseGroups, setTestcaseGroups] = useState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [allTestcaseGroups, setAllTestcaseGroups] = useState([]);
  const [isNameEdit, setIsNameEdit] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [sequence, setSequence] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (type !== 'edit') {
      setSequence({
        name: t('새 케이스 시퀀스'),
        description: '',
      });
    }
  }, [type]);
  console.log(nodes);

  const isEdit = useMemo(() => {
    return type === 'edit';
  }, [type]);

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

  useEffect(() => {
    if (isEdit && sequenceId) {
      SequenceService.selectSequence(spaceCode, projectId, sequenceId, info => {
        console.log(info);
        setSequence({
          id: info.id,
          name: info.name,
          description: info.description,
        });

        setNodes(
          info.nodes.map(d => {
            return {
              id: d.nodeId,
              position: d.position,
              type: d.type,
              style: d.style,
              ...d.style,
              data: {
                testcaseId: d.testcase.id,
                seqId: d.testcase.seqId,
                label: d.testcase.name,
                editable: true,
                id: d.id,
              },
            };
          }),
        );

        setEdges(
          info.edges.map(d => {
            return {
              id: d.edgeId,
              source: d.sourceNodeId,
              target: d.targetNodeId,
              type: d.type,
              style: d.style,
              data: {
                curveType: 'bezier',
                editable: true,
                id: d.id,
              },
              markerEnd: {
                type: MarkerType.Arrow,
                width: 16,
                height: 16,
              },
            };
          }),
        );
      });
    }
  }, [isEdit, sequenceId]);

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
    [setEdges, nodes],
  );

  console.log(edges);

  const nodeTypes = {
    testcase: TestcaseNode,
  };

  const edgeTypes = {
    buttonEdge: SequenceEdge,
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
          testcaseId: testcase.id,
          seqId: testcase.seqId,
          label: testcase.name,
          editable: true,
        },
      };

      setNodes(nds => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  const onDragOver = useCallback(event => {
    const e = event;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDragStart = useCallback((event, testcase) => {
    const e = event;
    e.dataTransfer.setData('application/reactflow', JSON.stringify(testcase));
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleSubmit = e => {
    e.preventDefault();

    if (isEdit) {
      const data = {
        ...sequence,
        nodes: nodes.map(d => {
          return {
            id: d.data.id,
            nodeId: d.id,
            testcaseId: d.data.testcaseId,
            type: d.type,
            style: d.style,
            position: d.position,
          };
        }),
        edges: edges.map(d => {
          return {
            id: d.data.id,
            edgeId: d.id,
            sourceNodeId: d.source,
            targetNodeId: d.target,
            type: d.type,
            style: d.style,
          };
        }),
      };

      console.log(nodes);
      console.log(edges);
      console.log(sequence);
      console.log(data);

      SequenceService.updateSequence(spaceCode, projectId, sequenceId, data, info => {
        console.log(info);
        navigate(`/spaces/${spaceCode}/projects/${projectId}/sequences/${sequenceId}`);
      });
    } else {
      const data = {
        ...sequence,
        nodes: nodes.map(d => {
          return {
            nodeId: d.id,
            testcaseId: d.data.testcaseId,
            type: d.type,
            style: d.style,
            position: d.position,
          };
        }),
        edges: edges.map(d => {
          return {
            edgeId: d.id,
            sourceNodeId: d.source,
            targetNodeId: d.target,
            type: d.type,
            style: d.style,
          };
        }),
      };

      console.log(edges);
      console.log(data);

      SequenceService.createSequence(spaceCode, projectId, data, info => {
        console.log(info);
        navigate(`/spaces/${spaceCode}/projects/${projectId}/sequences`);
      });
    }

    console.log(sequence);
    console.log(nodes);
    console.log(edges);
  };

  const onChangeSequence = useCallback(
    (key, value) => {
      setSequence({
        ...setSequence,
        [key]: value,
      });
    },
    [sequence, setSequence],
  );

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
            to: `/spaces/${spaceCode}/projects/${projectId}/sequences`,
            text: t('케이스 시퀀스 목록'),
          },
        ]}
        control={
          <div>
            <Button
              size="sm"
              onClick={() => {
                navigate(`/spaces/${spaceCode}/projects/${projectId}/sequences`);
              }}
            >
              {t('목록')}
            </Button>
            <Liner className="liner" display="inline-block" width="1px" height="10px" color={theme === 'LIGHT' ? 'black' : 'white'} margin="0 10px 0 0" />
            <Button
              size="sm"
              onClick={() => {
                navigate(`/spaces/${spaceCode}/projects/${projectId}/sequences/${sequenceId}`);
              }}
            >
              {t('취소')}
            </Button>
            <Button size="sm" color="primary" onClick={handleSubmit}>
              {t('저장')}
            </Button>
          </div>
        }
        onListClick={() => {
          navigate(`/spaces/${spaceCode}/projects/${projectId}/sequences`);
        }}
      >
        {!isEdit ? t('새 케이스시퀀스') : t('케이스 시퀀스')}
      </PageTitle>
      <PageContent className="page-content" flex>
        <Title border={false} marginBottom={false}>
          <div className="sequence-title">
            <div>
              {isNameEdit && <Input type="text" size="sm" value={sequence.name} onChange={val => onChangeSequence('name', val)} required minLength={1} />}
              {!isNameEdit && <span>{sequence.name}</span>}
            </div>
            <div>
              <Button
                rounded
                size="xs"
                onClick={() => {
                  setIsNameEdit(!isNameEdit);
                }}
              >
                <i className="fa-solid fa-pencil" />
              </Button>
            </div>
          </div>
        </Title>

        <div className="sequence-content">
          <ReactFlowProvider>
            <div className="react-flow-wrapper" ref={reactFlowWrapper}>
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
              width={360}
              height="100%"
              minConstraints={[200, 100]} // 최소 크기 설정
              maxConstraints={[500, 200]} // 최대 크기 설정
              resizeHandles={['w']} // 좌측에만 핸들을 표시
            >
              <TestcaseNavigator
                testcaseGroups={testcaseGroups}
                onDragStart={(e, testcase) => {
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

SequenceEditPage.propTypes = {
  type: PropTypes.string.isRequired,
};

SequenceEditPage.defaultProps = {};

export default SequenceEditPage;
