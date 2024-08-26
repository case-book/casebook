import React from 'react';
import { Block, Button, Page, PageContent, PageTitle, Title } from '@/components';
import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import useStores from '@/hooks/useStores';
import { Trans, useTranslation } from 'react-i18next';
import dialogUtil from '@/utils/dialogUtil';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import projectDiagram from './project-diagram.webp';
import spaceDiagram from './space-diagram.webp';
import testcaseDiagram from './testcase-diagram.webp';
import testrunDiagram from './testrun-diagram.webp';
import releaseDiagram from './release-diagram.webp';
import reportDiagram from './report-diagram.webp';
import openlinkDiagram from './openlink-diagram.webp';
import './GuidePage.scss';

function GuidePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    contextStore: { space },
  } = useStores();

  return (
    <Page className="guide-page-wrapper">
      <PageTitle
        breadcrumbs={[
          {
            to: '/',
            text: t('HOME'),
          },
        ]}
      >
        WELCOME
      </PageTitle>
      <PageContent className="content">
        <h3>{t('케이스북에 방문하신 것을 환영합니다.')}</h3>
        <p>
          {t(
            '케이스북은 회사 혹은 프로젝트 팀원들이 힘께 테스트케이스를 관리하고, 만들어진 테스트케이스를 다양한 형태와 방식으로 테스트를 수행할 수 있도록 도와주는 오픈 소스 테스트케이스 관리 도구입니다.',
          )}
        </p>
        <p>
          <Trans
            i18nKey="케이스북 사용을 위해서는 먼저 @가 필요합니다. 아래 방법을 참고하여 스페이스에 참여해보세요."
            components={{ span: <span className="bold" /> }}
            values={{ space: '스페이스' }}
          />
        </p>
        <ul className="order">
          <li>
            <Trans i18nKey="@를 생성합니다." components={{ span: <Link to="/spaces/new">새 스페이스</Link> }} values={{ space: t('새 스페이스') }} />
          </li>
          <li>
            <Trans
              i18nKey="@하고, 스페이스에 참여할 수 있습니다."
              components={{
                span: <Link to="/spaces/search">스페이스를 검색</Link>,
              }}
              values={{ space: t('스페이스를 검색') }}
            />
          </li>
          <li>{t('비공개 스페이스에 참여하기 위해서는 스페이스 관리자에게 초대를 요청하세요.')}</li>
        </ul>
        <Title icon={<i className="fa-solid fa-circle-info" />}>{t('스페이스')}</Title>
        <Block>
          <div className="img-description">
            <div className="img">
              <img src={spaceDiagram} alt="SPACE" />
            </div>
            <div className="description">
              <p className="strong">{t('스페이스는 케이스북을 사용하기 위한 논리적인 공간입니다.')}</p>
              <p>
                {t(
                  '스페이스를 만들어 공통의 관심사를 가지는 사용자들과 함께 프로젝트를 만들고, 테스트케이스를 만들 수 있습니다. 사용자는 여러 스페이스에 참여할 수 있지만, 사용시 반드시 1개의 스페이스를 선택해야 합니다. 언제든 다른 스페이스를 선택할 수 있으며, 좌측 상단의 스페이스 이름 우측의 아래 화살표를 클릭하여, 스페이스를 변경할 수 있습니다.',
                )}
              </p>
              <p>
                {t(
                  '스페이스를 만들거나, 혹은 설정을 변경하여 스페이스를 누구나 검색해서, 가입하거나 혹은 가입 요청하도록 설정할 수 있으며, 검색 페이지에 노출되지 않도록 비공개 스페이스로 설정할 수 있습니다. 스페이스를 생성한 사용자가 스페이스의 관리자로 지정되며, 이 후 스페이스 관리화면에서 사용자 및 사용자 권한 등을 설정할 수 있습니다.',
                )}
              </p>
              <p>{t('스페이스를 만들고, 프로젝트를 만들어서, 테스트케이스 작성을 위한 준비를 시작해보세요.')}</p>
              <div className="action">
                <Button
                  color="primary"
                  onClick={() => {
                    navigate('/spaces/new');
                  }}
                >
                  {t('스페이스 만들기')}
                </Button>
              </div>
            </div>
          </div>
        </Block>
        <Title icon={<i className="fa-solid fa-circle-info" />}>{t('프로젝트')}</Title>
        <Block>
          <div className="img-description">
            <div className="img">
              <img src={projectDiagram} alt="SPACE" />
            </div>
            <div className="description">
              <p className="strong">{t('프로젝트를 만들고 테스트케이스를 만들어보세요.')}</p>
              <p>{t('스페이스 안에 여러 프로젝트를 만들 수 있습니다. 프로젝트는 테스트케이스를 관리하기 위한 기본 단위입니다.')}</p>
              <p>
                {t(
                  '스페이스와 마찬가지로, 프로젝트도 프로젝트 사용자를 가지고 있습니다. 프로젝트를 처음 생성한 사용자가 프로젝트의 관리자로 지정되며, 이 후 프로젝트 설정 화면에서 스페이스 사용자를 검색하여, 프로젝트 사용자로 추가할 수 있습니다. (스페이스와 다르게 프로젝트는 검색하거나, 참여 요청 등을 할 수 없으며, 프로젝트 관리자가 프로젝트 참여자를 프로젝트에 추가하는 방식으로 프로젝트에 참여할 수 있습니다.)',
                )}
              </p>
              <p>{t('프로젝트의 모든 사용자는 언제든 프로젝트 설정 페이지에서 프로젝트에서 탈퇴할 수 있습니다.')}</p>
              <div className="action">
                <Button
                  color="primary"
                  onClick={() => {
                    if (!space) {
                      dialogUtil.setMessage(MESSAGE_CATEGORY.WARNING, t('스페이스 미선택'), t('프로젝트를 생성하기 위해서는 먼저 스페이스에 참여하고, 스페이스가 선택되어 있어야 합니다.'));
                      return;
                    }
                    navigate('/spaces/new');
                  }}
                >
                  {t('프로젝트 만들기')}
                </Button>
              </div>
            </div>
          </div>
        </Block>
        <div className="others">
          <Title icon={<i className="fa-solid fa-circle-info" />}>{t('테스트케이스')}</Title>
          <Block>
            <div className="img-description">
              <div className="img">
                <img src={testcaseDiagram} alt="SPACE" />
              </div>
              <div className="description" />
            </div>
          </Block>
          <Title icon={<i className="fa-solid fa-circle-info" />}>{t('테스트런')}</Title>
          <Block>
            <div className="img-description">
              <div className="img">
                <img src={testrunDiagram} alt="SPACE" />
              </div>
              <div className="description" />
            </div>
          </Block>
          <Title icon={<i className="fa-solid fa-circle-info" />}>{t('릴리스')}</Title>
          <Block>
            <div className="img-description">
              <div className="img">
                <img src={releaseDiagram} alt="SPACE" />
              </div>
              <div className="description" />
            </div>
          </Block>
          <Title icon={<i className="fa-solid fa-circle-info" />}>{t('리포트')}</Title>
          <Block>
            <div className="img-description">
              <div className="img">
                <img src={reportDiagram} alt="SPACE" />
              </div>
              <div className="description" />
            </div>
          </Block>
          <Title icon={<i className="fa-solid fa-circle-info" />}>{t('오픈 링크')}</Title>
          <Block>
            <div className="img-description">
              <div className="img">
                <img src={openlinkDiagram} alt="SPACE" />
              </div>
              <div className="description" />
            </div>
          </Block>
        </div>
      </PageContent>
    </Page>
  );
}

export default observer(GuidePage);
