import React, { useEffect, useState } from 'react';
import { Block, Button, EmptyContent, Label, Page, PageButtons, PageContent, PageTitle, Text, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BlockRow from '@/components/BlockRow/BlockRow';
import AdminService from '@/services/AdminService';
import dialogUtil from '@/utils/dialogUtil';
import { LLM_CONFIGS, MESSAGE_CATEGORY } from '@/constants/constants';
import ConfigService from '@/services/ConfigService';
import './SystemConfigInfoPage.scss';

const labelMinWidth = '150px';

function SystemInfoPage() {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [info, setInfo] = useState({
    redis: {},
    system: {},
  });
  const [llmConfigs, setLlmConfigs] = useState([]);

  const getSystemInfo = () => {
    AdminService.selectSystemInfo(d => {
      const nextRedis = {};

      if (d?.redis?.db0) {
        const list = d?.redis?.db0.split(',');
        list.forEach(item => {
          if (item.indexOf('keys') >= 0) {
            const [, value] = item.split('=');
            nextRedis.keyCount = value;
          }
        });
      }

      nextRedis.maxMemory = d?.redis?.maxmemory_human;
      nextRedis.peakMemory = d?.redis?.used_memory_peak_human;
      nextRedis.usedMemory = d?.redis?.used_memory_human;
      nextRedis.usedPercent = d?.redis?.maxmemory > 0 ? Math.round((d.redis.used_memory / d.redis.maxmemory) * 10000) / 100 : '-';
      nextRedis.peakPercent = d?.redis?.maxmemory > 0 ? Math.round((d.redis.used_memory_peak / d.redis.maxmemory) * 10000) / 100 : '-';

      setInfo({ ...d, redis: nextRedis });
    });
  };

  const getSystemLlmConfigList = () => {
    ConfigService.selectLlmConfigList(d => {
      setLlmConfigs(d);
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getSystemInfo();
    getSystemLlmConfigList();
  }, []);

  const flushRedis = () => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('레디스 초기화'),
      <div>{t('레디스를 초기화합니다. 레디스의 모든 데이터가 삭제됩니다. 삭제하시겠습니까?')}</div>,
      () => {
        AdminService.flushRedis(() => {
          getSystemInfo();
        });
      },
      null,
      t('삭제'),
    );
  };

  const deleteRedis = () => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('캐시 초기화'),
      <div>{t('스페이스 및 프로젝트 관련 캐시 데이터를 삭제합니다. 삭제하시겠습니까?')}</div>,
      () => {
        AdminService.deleteRedis(() => {
          getSystemInfo();
        });
      },
      null,
      t('삭제'),
    );
  };

  return (
    <Page className="system-config-info-page-wrapper">
      <PageTitle
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
        ]}
        links={[
          {
            to: '/admin/systems/config/edit',
            text: t('변경'),
            color: 'primary',
          },
        ]}
        onListClick={() => {
          navigate('/');
        }}
      >
        {t('시스템 설정')}
      </PageTitle>
      <PageContent>
        <Title>{t('LLM 프롬프트 설정')}</Title>
        <Block>
          {!(llmConfigs?.length > 0) && (
            <EmptyContent className="empty-content">
              <div>{t('등록된 프롬프트가 없습니다.')}</div>
            </EmptyContent>
          )}
          {llmConfigs.map(d => {
            return (
              <BlockRow key={d.code}>
                <Label minWidth={labelMinWidth}>{LLM_CONFIGS[d.code] || d.code}</Label>
                <Text whiteSpace="pre-wrap">{d.value}</Text>
              </BlockRow>
            );
          })}
        </Block>
        <Title>{t('캐시 관리')}</Title>
        <Block>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('키 카운트')}</Label>
            <Text>{info?.redis?.keyCount || 0}</Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('메모리 사용률')}</Label>
            <Text>
              {info?.redis?.usedMemory} / {info?.redis?.maxMemory} ({info?.redis?.usedPercent}%)
            </Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('피크 메모리')}</Label>
            <Text>
              {info?.redis?.peakMemory} ({info?.redis?.peakPercent}%)
            </Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('캐시 초기화')}</Label>
            <Text>
              <Button size="sm" className="remove-button" color="danger" onClick={deleteRedis}>
                {t('스페이스, 프로젝트 관련 캐시 데이터를 삭제합니다.')}
              </Button>
            </Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('레디스 초기화')}</Label>
            <Text>
              <Button size="sm" className="remove-button" color="danger" onClick={flushRedis}>
                {t('레디스의 모든 정보를 삭제합니다.')}
              </Button>
            </Text>
          </BlockRow>
        </Block>
        <Title>{t('기타')}</Title>
        <Block>
          <BlockRow>
            <Label minWidth={labelMinWidth} tip={t('스크립트 및 서버에서 에러를 생성합니다. 발생한 에러를 인지하고, 모니터링 할 수 있는지 확인하기 위해 인위적으로 에러를 생성합니다.')}>
              {t('에러 생성')}
            </Label>
            <Text className="exception">
              <Button
                size="sm"
                className="remove-button"
                color="warning"
                onClick={() => {
                  const a = 10;
                  a.none();
                }}
              >
                {t('스크립트 오류 생성')}
              </Button>
              <Button
                size="sm"
                className="remove-button"
                color="warning"
                onClick={() => {
                  ConfigService.createArithmeticException(null, () => {
                    dialogUtil.setMessage(MESSAGE_CATEGORY.INFO, t('요청 완료'), t('서버에서 예외가 정상적으로 발생하였습니다.'));
                    return true;
                  });
                }}
              >
                {t('런타임 예외 생성')}
              </Button>
              <Button
                size="sm"
                className="remove-button"
                color="warning"
                onClick={() => {
                  ConfigService.createServiceException(null, () => {
                    dialogUtil.setMessage(MESSAGE_CATEGORY.INFO, t('요청 완료'), t('서버에서 예외가 정상적으로 발생하였습니다.'));
                    return true;
                  });
                }}
              >
                {t('서비스 예외 생성')}
              </Button>
            </Text>
          </BlockRow>
        </Block>
        <PageButtons
          onBack={() => {
            navigate('/');
          }}
          onCancelIcon=""
        />
      </PageContent>
    </Page>
  );
}

SystemInfoPage.defaultProps = {};

SystemInfoPage.propTypes = {};

export default SystemInfoPage;
