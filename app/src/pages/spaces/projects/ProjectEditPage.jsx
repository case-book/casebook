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

function ProjectEditPage({ type }) {
  const { t } = useTranslation();
  const { id, spaceCode } = useParams();

  console.log(spaceCode);

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
    if (id && type === 'edit') {
      ProjectService.selectProjectInfo(spaceCode, id, info => {
        setProject(info);
      });
    }
  }, [type, id]);

  useEffect(() => {
    SpaceService.selectSpaceInfo(spaceCode, info => {
      setSpace(info);
    });
  }, [spaceCode]);

  const onSubmit = e => {
    e.preventDefault();

    if (type === 'new') {
      ProjectService.createProject(spaceCode, project, () => {
        navigate(`/spaces/${spaceCode}`);
      });
    } else if (type === 'edit') {
      ProjectService.updateProject(project, () => {
        navigate(`/spaces/${spaceCode}`);
      });
    }
  };

  const onDelete = () => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('스페이스 삭제'),
      <div>{t('[{project.name}] 스페이스의 모든 정보가 삭제됩니다. 삭제하시겠습니까?')}</div>,
      () => {
        SpaceService.deleteSpace(project.id, () => {
          navigate(`/spaces/${spaceCode}`);
        });
      },
      null,
      t('삭제'),
    );
  };

  return (
    <Page className="project-edit-page-wrapper">
      <PageTitle>{t('새 프로젝트')}</PageTitle>
      <PageContent>
        <Form onSubmit={onSubmit}>
          <Block className="pt-0">
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
              navigate('/projects');
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
