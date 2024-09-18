import React, { useEffect, useRef, useState } from 'react';
import { Background, Controls, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState } from '@xyflow/react';
import { Button, Page, PageContent, PageTitle, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import ProjectService from '@/services/ProjectService';
import '@xyflow/react/dist/style.css';
import 'react-resizable/css/styles.css';
import SequenceService from '@/services/SequenceService';
import { SequenceEdge, TestcaseNode } from '@/assets';
import './SequenceInfoPage.scss';
import dialogUtil from '@/utils/dialogUtil';
import { MESSAGE_CATEGORY } from '@/constants/constants';

function SequenceInfoPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const reactFlowWrapper = useRef(null);
  const { spaceCode, projectId, sequenceId } = useParams();
  const [project, setProject] = useState(null);

  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const [sequence, setSequence] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    ProjectService.selectProjectName(spaceCode, projectId, info => {
      setProject(info);
    });
  }, [spaceCode, projectId]);

  useEffect(() => {
    if (sequenceId) {
      SequenceService.selectSequence(spaceCode, projectId, sequenceId, info => {
        setSequence({
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
              data: {
                testcaseId: d.testcase.id,
                seqId: d.testcase.seqId,
                label: d.testcase.name,
                resizable: false,
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
                removable: false,
              },
            };
          }),
        );
      });
    }
  }, [sequenceId]);

  const nodeTypes = {
    testcase: TestcaseNode,
  };

  const edgeTypes = {
    buttonEdge: SequenceEdge,
  };

  const onDelete = () => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('시퀀스 삭제'),
      <div>{t('@ 시퀀스 정보가 모두 삭제됩니다. 삭제하시겠습니까?', { name: sequence.name })}</div>,
      () => {
        SequenceService.deleteSequence(spaceCode, projectId, sequenceId, () => {
          navigate(`/spaces/${spaceCode}/projects/${projectId}/sequences`);
        });
      },
      null,
      t('삭제'),
      null,
      'danger',
    );
  };

  return (
    <Page className="sequence-info-page-wrapper">
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
          <Button size="sm" color="danger" onClick={onDelete}>
            {t('시퀀스 삭제')}
          </Button>
        }
        links={[
          {
            to: `/spaces/${spaceCode}/projects/${projectId}/sequences/${sequenceId}/edit`,
            text: t('변경'),
          },
        ]}
        onListClick={() => {
          navigate(`/spaces/${spaceCode}/projects/${projectId}/sequences`);
        }}
      >
        {t('케이스 시퀀스')}
      </PageTitle>
      <PageContent className="page-content" flex>
        <Title border={false} marginBottom={false}>
          {sequence.name}
        </Title>
        <div className="sequence-content">
          <ReactFlowProvider>
            <div className="react-flow-wrapper" ref={reactFlowWrapper}>
              <ReactFlow snapToGrid nodes={nodes} edges={edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes}>
                <Controls />
                <Background variant="dots" gap={12} size={1} />
              </ReactFlow>
            </div>
          </ReactFlowProvider>
        </div>
      </PageContent>
    </Page>
  );
}

SequenceInfoPage.propTypes = {};

SequenceInfoPage.defaultProps = {};

export default SequenceInfoPage;
