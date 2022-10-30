import React, { useEffect, useState } from 'react';
import './ProjectEditPage.scss';
import { Block, Button, CheckBox, Form, Input, Label, Page, PageButtons, PageContent, PageTitle, Text, TextArea } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import SpaceService from '@/services/SpaceService';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import BlockRow from '@/components/BlockRow/BlockRow';
import dialogUtil from '@/utils/dialogUtil';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import ProjectService from '@/services/ProjectService';
import TestcaseService from '@/services/TestcaseService';

const defaultProjectConfig = {
  testcaseTemplates: [
    {
      name: '기본 템플릿',
      testcaseTemplateItems: [
        { category: 'CASE', type: 'RADIO', itemOrder: 0, label: '중요도', options: ['상', '중', '하'], size: 4, defaultValue: '중' },
        { category: 'CASE', type: 'URL', itemOrder: 1, label: 'URL', options: [], size: 4 },
        { category: 'CASE', type: 'CHECKBOX', itemOrder: 2, label: 'E2E', options: [], size: 4 },
        { category: 'CASE', type: 'USER', itemOrder: 3, label: '테스터', options: [], size: 4 },
        { category: 'CASE', type: 'USER', itemOrder: 4, label: '담당자', options: [], size: 4 },
        { category: 'CASE', type: 'CHECKBOX', itemOrder: 5, label: '회귀 테스트', options: [], size: 4 },
        { category: 'CASE', type: 'EDITOR', itemOrder: 6, label: '테스트 준비 절차', options: [], size: 12 },
        { category: 'CASE', type: 'EDITOR', itemOrder: 7, label: '테스트 절차', options: [], size: 12 },
        { category: 'CASE', type: 'EDITOR', itemOrder: 8, label: '예상 절차', options: [], size: 12 },
        { category: 'RESULT', type: 'RADIO', itemOrder: 0, label: '테스트 결과', options: ['성공', '실패', '수행 불가능'], size: 6 },
        { category: 'RESULT', type: 'RADIO', itemOrder: 1, label: '테스트케이스 평가', options: ['1', '2', '3', '4', '5'], size: 6 },
        { category: 'RESULT', type: 'EDITOR', itemOrder: 2, label: '비고', options: [], size: 12 },
      ],
      isDefault: true,
    },
  ],
};

function ProjectEditPage({ type }) {
  const { t } = useTranslation();
  const { projectId, spaceCode } = useParams();

  const navigate = useNavigate();

  const [space, setSpace] = useState(null);

  const [project, setProject] = useState({
    name: '',
    code: '',
    description: '',
    activated: true,
    token: uuidv4(),
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (projectId && type === 'edit') {
      ProjectService.selectProjectInfo(spaceCode, projectId, info => {
        setProject(info);
      });
    }
  }, [type, projectId]);

  useEffect(() => {
    SpaceService.selectSpaceInfo(spaceCode, info => {
      setSpace(info);
    });
  }, [spaceCode]);

  const onSubmit = e => {
    e.preventDefault();

    if (type === 'new') {
      ProjectService.createProject(spaceCode, project, info => {
        TestcaseService.updateConfig(spaceCode, info.id, defaultProjectConfig, () => {
          navigate(`/spaces/${spaceCode}/projects/${info.id}/info`);
        });
      });
    } else if (type === 'edit') {
      ProjectService.updateProject(spaceCode, project, () => {
        navigate(`/spaces/${spaceCode}/projects/${project.id}/info`);
      });
    }
  };

  const onDelete = () => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('프로젝트 삭제'),
      <div>{t(`"${project.name}" 프로젝트 및 프로젝트에 포함된 모든 정보가 삭제됩니다. 삭제하시겠습니까?`)}</div>,
      () => {
        ProjectService.deleteProject(spaceCode, project, () => {
          navigate(`/spaces/${spaceCode}/projects`);
        });
      },
      null,
      t('삭제'),
    );
  };

  return (
    <Page className="project-edit-page-wrapper">
      <PageTitle>{type === 'edit' ? t('프로젝트') : t('새 프로젝트')}</PageTitle>
      <PageContent>
        <Form onSubmit={onSubmit}>
          <Block>
            <BlockRow>
              <Label>{t('스페이스')}</Label>
              <Text>{space?.name}</Text>
            </BlockRow>
            <BlockRow>
              <Label required>{t('이름')}</Label>
              <Input
                value={project.name}
                onChange={val =>
                  setProject({
                    ...project,
                    name: val,
                  })
                }
                required
                minLength={1}
              />
            </BlockRow>
            <BlockRow>
              <Label>{t('설명')}</Label>
              <TextArea
                value={project.description || ''}
                rows={4}
                onChange={val => {
                  setProject({
                    ...project,
                    description: val,
                  });
                }}
              />
            </BlockRow>
            <BlockRow>
              <Label>{t('활성화')}</Label>
              <CheckBox
                size="sm"
                type="checkbox"
                value={project.activated}
                onChange={val =>
                  setProject({
                    ...project,
                    activated: val,
                  })
                }
              />
            </BlockRow>
            <BlockRow>
              <Label>{t('토큰')}</Label>
              <Text>{project.token}</Text>
              <Button
                outline
                onClick={() => {
                  setProject({
                    ...project,
                    token: uuidv4(),
                  });
                }}
              >
                <i className="fa-solid fa-arrows-rotate" />
              </Button>
            </BlockRow>
          </Block>
          <PageButtons
            onDelete={onDelete}
            onCancel={() => {
              navigate(-1);
            }}
            onSubmit={() => {}}
            onSubmitText="저장"
            onCancelIcon=""
          />
        </Form>
      </PageContent>
    </Page>
  );
}

ProjectEditPage.defaultProps = {
  type: 'new',
};

ProjectEditPage.propTypes = {
  type: PropTypes.string,
};

export default ProjectEditPage;
