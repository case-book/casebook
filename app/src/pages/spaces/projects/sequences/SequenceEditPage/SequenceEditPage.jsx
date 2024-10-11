import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { addEdge, Background, MarkerType, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState } from '@xyflow/react';
import { Button, Input, Liner, Page, PageContent, PageTitle, Radio, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import ProjectService from '@/services/ProjectService';
import '@xyflow/react/dist/style.css';
import TestcaseService from '@/services/TestcaseService';
import { CurveTypeChoice, MiniMap, SequenceControls, SequenceEdge, TestcaseNode } from '@/assets';
import { useResizeDetector } from 'react-resize-detector';
import { ResizableBox } from 'react-resizable';
import TestcaseNavigator from '@/pages/spaces/projects/ProjectTestcaseEditPage/TestcaseNavigator/TestcaseNavigator';
import testcaseUtil from '@/utils/testcaseUtil';
import 'react-resizable/css/styles.css';
import * as PropTypes from 'prop-types';
import SequenceService from '@/services/SequenceService';
import useStores from '@/hooks/useStores';
import './SequenceEditPage.scss';
import { getOption, setOption } from '@/utils/storageUtil';

const DEFAULT_BUTTON_EDGE = {
  type: 'buttonEdge',
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
  style: { width: 240, height: 60 },
};

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
  const [isInteractive, setIsInteractive] = useState(true);

  const { height, ref } = useResizeDetector({
    handleHeight: true,
    refreshMode: 'throttle',
    refreshRate: 100,
  });

  const [sequence, setSequence] = useState({
    name: '',
    description: '',
  });

  const [curveType, setCurveType] = useState(
    (() => {
      return getOption('sequence', 'options', 'curveType') || 'step';
    })(),
  );
  const [viewTestcaseNavigator, setViewTestcaseNavigator] = useState(true);

  useEffect(() => {
    if (type !== 'edit') {
      setSequence({
        name: t('새 케이스시퀀스'),
        description: '',
      });
    }
  }, [type]);

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
                curveType,
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
            data: { curveType, editable: true },
          },
          eds,
        ),
      );
    },
    [setEdges, nodes],
  );

  const nodeTypes = {
    testcase: TestcaseNode,
  };

  const edgeTypes = {
    buttonEdge: SequenceEdge,
  };

  const onDrop = useCallback(
    event => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const testcase = JSON.parse(event.dataTransfer.getData('application/reactflow'));

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

      SequenceService.updateSequence(spaceCode, projectId, sequenceId, data, () => {
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

      SequenceService.createSequence(spaceCode, projectId, data, () => {
        navigate(`/spaces/${spaceCode}/projects/${projectId}/sequences`);
      });
    }
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

  const nodeById = useMemo(() => {
    return nodes.reduce((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {});
  }, [nodes]);

  useEffect(() => {
    setEdges(eds =>
      eds.map(edge => {
        return {
          ...edge,
          data: {
            ...edge.data,
            curveType,
          },
        };
      }),
    );
  }, [curveType]);

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
            text: t('케이스시퀀스 목록'),
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
                if (isEdit) {
                  navigate(`/spaces/${spaceCode}/projects/${projectId}/sequences/${sequenceId}`);
                } else {
                  navigate(`/spaces/${spaceCode}/projects/${projectId}/sequences`);
                }
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
        {!isEdit ? t('새 케이스시퀀스') : t('케이스시퀀스')}
      </PageTitle>
      <PageContent className="page-content" flex>
        <Title
          border={false}
          marginBottom={false}
          control={
            <div className="controls">
              <CurveTypeChoice
                curveType={curveType}
                setCurveType={d => {
                  setOption('sequence', 'options', 'curveType', d);
                  setCurveType(d);
                }}
              />
              <div>
                <Liner width="1px" height="10px" margin="0 0.5rem" />
              </div>
              <div>
                <Radio
                  className="option"
                  type="inline"
                  size="xs"
                  value
                  checked={viewTestcaseNavigator}
                  onChange={() => {
                    setViewTestcaseNavigator(true);
                  }}
                  label={<i className="fa-regular fa-window-maximize" />}
                />
                <Radio
                  className="option"
                  type="inline"
                  size="xs"
                  value={false}
                  checked={!viewTestcaseNavigator}
                  onChange={() => {
                    setViewTestcaseNavigator(false);
                  }}
                  label={<i className="fa-solid fa-minus" />}
                />
              </div>
            </div>
          }
        >
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
                nodesDraggable={isInteractive} // 노드 드래그 가능 여부
                nodesConnectable={isInteractive} // 노드 연결 가능 여부
                elementsSelectable={isInteractive} // 엘리먼트 선택 가능 여부
                zoomOnScroll={isInteractive} // 스크롤로 줌 가능 여부
                panOnDrag={isInteractive} // 드래그로 패닝 가능 여부
              >
                <SequenceControls isInteractive={isInteractive} setIsInteractive={setIsInteractive} />
                <MiniMap />
                <Background variant="dots" gap={12} size={1} />
              </ReactFlow>
            </div>
          </ReactFlowProvider>
          {viewTestcaseNavigator && (
            <div ref={ref} className="testcase-group-content" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <ResizableBox
                width={360}
                height={height}
                minConstraints={[200, 100]} // 최소 너비, 높이
                maxConstraints={[Infinity, Infinity]} // 최대 너비, 높이
                resizeHandles={['w']} // 좌측에만 핸들을 표시
              >
                <TestcaseNavigator
                  testcaseGroups={testcaseGroups}
                  nodeById={nodeById}
                  onDragStart={(e, testcase) => {
                    onDragStart(e, testcase);
                  }}
                />
              </ResizableBox>
            </div>
          )}
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
