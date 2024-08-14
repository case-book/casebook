import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Block, Button, CheckBox, DatePicker, Form, Input, Label, Page, PageButtons, PageContent, PageTitle, Text, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@toast-ui/react-editor';
import PropTypes from 'prop-types';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import { useParams } from 'react-router';
import BlockRow from '@/components/BlockRow/BlockRow';
import ProjectService from '@/services/ProjectService';
import SpaceService from '@/services/SpaceService';
import './OpenLinkEditPage.scss';
import DateCustomInput from '@/components/DateRange/DateCustomInput/DateCustomInput';
import SelectOpenLinkTestrunPopup from '@/pages/spaces/projects/links/OpenLinkEditPage/SelectOpenLinkTestrunPopup/SelectOpenLinkTestrunPopup';
import OpenLinkService from '@/services/OpenLinkService';
import { getBaseURL } from '@/utils/configUtil';
import useStores from '@/hooks/useStores';
import { OpenLinkReportList } from '@/assets';

const labelMinWidth = '160px';

function OpenLinkEditPage({ type }) {
  const { t } = useTranslation();

  const {
    themeStore: { theme },
  } = useStores();

  const editor = useRef(null);

  const { projectId, spaceCode } = useParams();

  const navigate = useNavigate();

  const [project, setProject] = useState({});
  const [openedSelectPopup, setOpenedSelectPopup] = useState(false);
  const [spaceName, setSpaceName] = useState('');

  const [openLink, setOpenLink] = useState({
    id: null,
    name: '',
    token: '',
    testruns: [],
    openEndDateTime: null,
    opened: true,
    comment: '',
  });

  const isEdit = useMemo(() => {
    return type === 'edit';
  }, [type]);

  useEffect(() => {
    window.scrollTo(0, 0);
    ProjectService.selectProjectName(spaceCode, projectId, info => {
      setProject(info);
    });
  }, [projectId]);

  useEffect(() => {
    SpaceService.selectSpaceName(spaceCode, name => {
      setSpaceName(name);
    });
  }, [spaceCode]);

  const onSubmit = e => {
    e.preventDefault();
    const request = {
      ...openLink,
      testrunIds: openLink.testruns.map(report => report.id),
    };
    OpenLinkService.createOpenLinkInfo(spaceCode, projectId, request, () => {
      navigate(`/spaces/${spaceCode}/projects/${projectId}/links`);
    });
  };

  const createProjectImage = (name, size, typeText, file) => {
    return ProjectService.createImage(spaceCode, projectId, name, size, typeText, file);
  };

  return (
    <>
      <Page className="open-link-edit-page-wrapper">
        <PageTitle
          name={isEdit ? t('오픈 링크 변경') : t('오픈 링크 생성')}
          breadcrumbs={
            isEdit
              ? [
                  {
                    to: '/',
                    text: t('HOME'),
                  },
                  {
                    to: `/spaces/${spaceCode}/info`,
                    text: spaceName,
                  },
                  {
                    to: `/spaces/${spaceCode}/projects`,
                    text: t('프로젝트 목록'),
                  },
                  {
                    to: `/spaces/${spaceCode}/projects/${projectId}/info`,
                    text: project?.name,
                  },
                  {
                    to: `/spaces/${spaceCode}/projects/${projectId}/links`,
                    text: t('오픈 링크 목록'),
                  },
                  {
                    to: `/spaces/${spaceCode}/edit`,
                    text: t('변경'),
                  },
                ]
              : [
                  {
                    to: '/',
                    text: t('HOME'),
                  },
                  {
                    to: `/spaces/${spaceCode}/info`,
                    text: spaceName,
                  },
                  {
                    to: `/spaces/${spaceCode}/projects`,
                    text: t('프로젝트 목록'),
                  },
                  {
                    to: `/spaces/${spaceCode}/projects/${projectId}/info`,
                    text: project?.name,
                  },
                  {
                    to: `/spaces/${spaceCode}/projects/${projectId}/links`,
                    text: t('오픈 링크 목록'),
                  },
                  {
                    to: `/spaces/${spaceCode}/projects/new`,
                    text: t('생성'),
                  },
                ]
          }
          onListClick={() => {
            navigate(`/spaces/${spaceCode}/projects`);
          }}
        >
          {type === 'edit' ? t('오픈 링크') : t('새 오픈 링크')}
        </PageTitle>
        <PageContent>
          <Form onSubmit={onSubmit}>
            <Title border={false} marginBottom={false}>
              {t('오픈 링크 정보')}
            </Title>
            <Block>
              <BlockRow>
                <Label minWidth={labelMinWidth}>{t('프로젝트')}</Label>
                <Text>{project.name}</Text>
              </BlockRow>
              <BlockRow>
                <Label minWidth={labelMinWidth} required>
                  {t('이름')}
                </Label>
                <Input
                  value={openLink.name}
                  onChange={val =>
                    setOpenLink({
                      ...openLink,
                      name: val,
                    })
                  }
                  required
                  minLength={1}
                />
              </BlockRow>
              <BlockRow>
                <Label minWidth={labelMinWidth}>{t('공유')}</Label>
                <CheckBox
                  size="sm"
                  type="checkbox"
                  value={openLink.opened}
                  onChange={val =>
                    setOpenLink({
                      ...openLink,
                      opened: val,
                    })
                  }
                />
              </BlockRow>
              <BlockRow>
                <Label minWidth={labelMinWidth} required>
                  {t('공유 기간')}
                </Label>
                <div className="iteration-period">
                  <DatePicker
                    className="date-picker start-date-picker"
                    date={openLink.openEndDateTime}
                    showTimeSelect
                    onChange={date => {
                      setOpenLink({
                        ...openLink,
                        openEndDateTime: date,
                      });
                    }}
                    customInput={<DateCustomInput />}
                  />
                </div>
              </BlockRow>
            </Block>
            <Title
              control={
                <Button
                  outline
                  size="sm"
                  onClick={() => {
                    setOpenedSelectPopup(true);
                  }}
                >
                  {t('추가')}
                </Button>
              }
            >
              {t('리포트 목록')}
            </Title>
            <Block>
              <OpenLinkReportList
                reports={openLink.testruns}
                onRemove={id => {
                  setOpenLink({
                    ...openLink,
                    testruns: openLink.testruns.filter(report => report.id !== id),
                  });
                }}
              />
            </Block>
            <Title>{t('코멘트')}</Title>
            <Block className="editor-block">
              <Editor
                ref={editor}
                theme={theme === 'DARK' ? 'dark' : 'white'}
                placeholder="내용을 입력해주세요."
                previewStyle="vertical"
                height="100%"
                initialEditType="wysiwyg"
                hideModeSwitch
                plugins={[colorSyntax]}
                autofocus={false}
                toolbarItems={[
                  ['heading', 'bold', 'italic', 'strike'],
                  ['hr', 'quote'],
                  ['ul', 'ol', 'task', 'indent', 'outdent'],
                  ['table', 'image', 'link'],
                  ['code', 'codeblock'],
                ]}
                hooks={{
                  addImageBlobHook: async (blob, callback) => {
                    const result = await createProjectImage(blob.name, blob.size, blob.type, blob);
                    callback(`${getBaseURL()}/api/${result.data.spaceCode}/projects/${result.data.projectId}/images/${result.data.id}?uuid=${result.data.uuid}`);
                  },
                }}
                initialValue={openLink.comment}
                onChange={() => {
                  setOpenLink({
                    ...openLink,
                    comment: editor.current?.getInstance()?.getHTML(),
                  });
                }}
              />
            </Block>
            <PageButtons
              onCancel={() => {
                navigate(-1);
              }}
              onSubmit={() => {}}
              onSubmitText={t('저장')}
            />
          </Form>
        </PageContent>
      </Page>
      {openedSelectPopup && (
        <SelectOpenLinkTestrunPopup
          spaceCode={spaceCode}
          projectId={projectId}
          setOpened={setOpenedSelectPopup}
          onApply={selectedTestruns => {
            setOpenedSelectPopup(false);
            setOpenLink({
              ...openLink,
              testruns: selectedTestruns,
            });
          }}
          testruns={openLink.testruns}
        />
      )}
    </>
  );
}

OpenLinkEditPage.defaultProps = {
  type: 'new',
};

OpenLinkEditPage.propTypes = {
  type: PropTypes.string,
};

export default OpenLinkEditPage;
