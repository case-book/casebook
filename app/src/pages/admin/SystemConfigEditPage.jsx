import React, { useEffect, useState } from 'react';
import { Button, EmptyContent, Form, Label, Page, PageButtons, PageContent, PageTitle, TextArea, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AdminService from '@/services/AdminService';
import ConfigService from '@/services/ConfigService';
import { LLM_CONFIGS } from '@/constants/constants';
import BlockRow from '../../components/BlockRow/BlockRow';

const labelMinWidth = '140px';

function SystemInfoPage() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [defaultPromptInfo, setDefaultPromptInfo] = useState({});
  const [llmConfigs, setLlmConfigs] = useState([]);

  const getDefaultPromptInfo = () => {
    ConfigService.selectDefaultPromptInfo(d => {
      setDefaultPromptInfo(d);
    });
  };

  const getSystemLlmConfigList = () => {
    ConfigService.selectLlmConfigList(d => {
      setLlmConfigs(d);
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getSystemLlmConfigList();
    getDefaultPromptInfo();
  }, []);

  const onSubmit = e => {
    e.preventDefault();
    AdminService.updateSystemInfo(llmConfigs, () => {
      navigate('/admin/systems/config');
    });
  };

  return (
    <Page>
      <PageTitle
        name="시스템 설정 변경"
        breadcrumbs={[
          {
            to: '/',
            text: t('HOME'),
          },
          {
            to: '/admin',
            text: t('시스템 관리'),
          },
          {
            to: '/admin/systems/config',
            text: t('시스템 설정'),
          },
          {
            to: '/admin/systems/config/edit',
            text: t('시스템 설정 변경'),
          },
        ]}
        onListClick={() => {
          navigate('/');
        }}
      >
        {t('시스템 설정 변경')}
      </PageTitle>
      <PageContent>
        <Form onSubmit={onSubmit}>
          <Title
            control={
              <Button
                size="xs"
                color="primary"
                onClick={() => {
                  const nextLlmConfigs = llmConfigs.slice(0);

                  const prompt = nextLlmConfigs.find(d => d.code === 'LLM_PROMPT');
                  if (prompt) {
                    prompt.value = defaultPromptInfo.prompt;
                  } else {
                    llmConfigs.push({
                      code: 'LLM_PROMPT',
                      value: defaultPromptInfo.prompt,
                    });
                  }

                  const systemRole = nextLlmConfigs.find(d => d.code === 'LLM_SYSTEM_ROLE');
                  if (systemRole) {
                    systemRole.value = defaultPromptInfo.systemRole;
                  } else {
                    llmConfigs.push({
                      code: 'LLM_SYSTEM_ROLE',
                      value: defaultPromptInfo.systemRole,
                    });
                  }

                  const prefix = nextLlmConfigs.find(d => d.code === 'LLM_PREFIX');
                  if (prefix) {
                    prefix.value = defaultPromptInfo.prefix;
                  } else {
                    llmConfigs.push({
                      code: 'LLM_PREFIX',
                      value: defaultPromptInfo.prefix,
                    });
                  }

                  setLlmConfigs(nextLlmConfigs);
                }}
              >
                {t('초기화')}
              </Button>
            }
          >
            {t('OPENAPI 프롬프트 설정')}
          </Title>
          {!(llmConfigs?.length > 0) && (
            <EmptyContent className="empty-content">
              <div>{t('등록된 프롬프트가 없습니다.')}</div>
            </EmptyContent>
          )}
          {llmConfigs.map(d => {
            return (
              <BlockRow key={d.code}>
                <Label minWidth={labelMinWidth}>{LLM_CONFIGS[d.code] || d.code}</Label>
                <TextArea
                  value={d.value}
                  onChange={val => {
                    const nextLlmConfigs = llmConfigs.slice(0);
                    const nextConfig = nextLlmConfigs.find(c => c.code === d.code);
                    nextConfig.value = val;
                    setLlmConfigs(nextLlmConfigs);
                  }}
                />
              </BlockRow>
            );
          })}
          <PageButtons
            onCancel={() => {
              navigate('/admin/systems/config');
            }}
            onSubmit={() => {}}
            onCancelIcon=""
          />
        </Form>
      </PageContent>
    </Page>
  );
}

SystemInfoPage.defaultProps = {};

SystemInfoPage.propTypes = {};

export default SystemInfoPage;
