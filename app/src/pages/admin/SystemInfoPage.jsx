import React, { useEffect, useState } from 'react';
import { Block, Button, Label, Page, PageButtons, PageContent, PageTitle, Text, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BlockRow from '@/components/BlockRow/BlockRow';
import AdminService from '@/services/AdminService';
import dialogUtil from '@/utils/dialogUtil';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import './SystemInfoPage.scss';

const labelMinWidth = '120px';

function SystemInfoPage() {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [info, setInfo] = useState({});

  const getSystemInfo = () => {
    AdminService.selectSystemInfo(d => {
      const next = {};

      if (d.db0) {
        const list = d.db0.split(',');
        list.forEach(item => {
          if (item.indexOf('keys') >= 0) {
            const [, value] = item.split('=');
            next.keyCount = value;
          }
        });
      }

      next.maxMemory = d.maxmemory_human;
      next.peakMemory = d.used_memory_peak_human;
      next.usedMemory = d.used_memory_human;
      next.usedPercent = d.maxmemory > 0 ? Math.round((d.used_memory / d.maxmemory) * 10000) / 100 : '-';
      next.peakPercent = d.maxmemory > 0 ? Math.round((d.used_memory_peak / d.maxmemory) * 10000) / 100 : '-';

      setInfo(next);
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getSystemInfo();
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
    <Page className="system-info-page-wrapper">
      <PageTitle>{t('시스템 관리')}</PageTitle>
      <PageContent>
        <Title>{t('레디스 정보')}</Title>
        <Block>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('키 카운트')}</Label>
            <Text>{info?.keyCount || 0}</Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('메모리 사용률')}</Label>
            <Text>
              {info.usedMemory} / {info.maxMemory} ({info.usedPercent}%)
            </Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('피크 메모리')}</Label>
            <Text>
              {info.peakMemory} ({info.peakPercent}%)
            </Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('레디스 초기화')}</Label>
            <Text>
              <Button className="remove-button" color="danger" onClick={flushRedis}>
                {t('레디스의 모든 정보를 삭제합니다.')}
              </Button>
            </Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth}>{t('캐시 초기화')}</Label>
            <Text>
              <Button className="remove-button" color="danger" onClick={deleteRedis}>
                {t('스페이스, 프로젝트 관련 캐시 데이터를 삭제합니다.')}
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
