import React, { useEffect, useState } from 'react';
import { CheckBox, Form, Input, Label, LogoIcon, Page, PageButtons, PageContent } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BlockRow from '@/components/BlockRow/BlockRow';
import ConfigService from '@/services/ConfigService';
import dialogUtil from '@/utils/dialogUtil';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import useStores from '@/hooks/useStores';
import { observer } from 'mobx-react';
import './SetUpPage.scss';

const defaultSmtpInfo = {
  enabled: false,
  host: '',
  port: '',
  tls: false,
  auth: false,
  id: '',
  password: '',
  sender: '',
};
const smtpLabelMinWidth = '180px';

function SetUpPage() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const {
    configStore: { setVersion },
  } = useStores();

  const [adminUser, setAdminUser] = useState({
    email: '',
    name: '',
    country: 'KR',
    language: 'ko',
    password: '',
    passwordConfirm: '',
  });

  const [smtpInfo, setSmtpInfo] = useState({
    ...defaultSmtpInfo,
  });

  const getSystemInfo = () => {};

  useEffect(() => {
    window.scrollTo(0, 0);
    getSystemInfo();
  }, []);

  const onSubmit = e => {
    e.preventDefault();

    ConfigService.createSetUpInfo(
      {
        adminUser,
      },
      () => {
        dialogUtil.setMessage(MESSAGE_CATEGORY.WARNING, t('시스템 설정 완료'), t('시스템 설정이 완료되었습니다. 등록된 어드민 사용자로 로그인 할 수 있습니다.'), () => {
          ConfigService.selectSystemInfo(version => {
            setVersion(version);
            navigate('/');
          });
        });
      },
    );
  };

  return (
    <Page className="set-up-page-wrapper">
      <PageContent>
        <Form onSubmit={onSubmit}>
          <div className="logo">
            <div>
              <LogoIcon className="logo-icon" size="md" />
              <div>CASEBOOK</div>
            </div>
          </div>
          <div className="page-description">
            <i className="fa-solid fa-circle-info" />
            {t('정상적인 케이스북 동작을 위한 기본 설정을 시작합니다. 기본적인 시스템 설정 및 시스템 관리를 위한 어드민 사용자가 등록되어야 합니다.')}
          </div>
          <div className="step first">
            <div className="step-number">
              <div className="step-number-line">
                <div />
              </div>
              <div className="step-number-content">
                <div>
                  <span>1</span>
                </div>
              </div>
            </div>
            <div className="step-content">
              <div className="step-title">{t('어드민 사용자 등록')}</div>
              <div className="step-description">
                {t(
                  '어드민 사용자는 시스템 관리 메뉴에 접근할 수 있으며, 케이스북의 시스템 설정, 사용자 정보 및 등록된 모든 데이터를 조회 및 관리할 수 있는 시스템 권한이 부여되는 사용자입니다. 시스템 관리자는 여러 명을 지정할 수 있지만, 본 설정 메뉴에서 최초 1명의 시스템 관리자를 지정한 후, 시스템 관리 메뉴를 통해 추가적인 시스템 관리자를 지정 할 수 있습니다.',
                )}
              </div>
              <BlockRow>
                <Label required>{t('이메일')}</Label>
                <Input
                  value={adminUser.email}
                  onChange={val =>
                    setAdminUser({
                      ...adminUser,
                      email: val,
                    })
                  }
                  required
                  minLength={1}
                />
              </BlockRow>
              <BlockRow>
                <Label required>{t('이름')}</Label>
                <Input
                  value={adminUser.name}
                  onChange={val =>
                    setAdminUser({
                      ...adminUser,
                      name: val,
                    })
                  }
                  required
                  minLength={1}
                />
              </BlockRow>
              <BlockRow>
                <Label required>{t('비밀번호')}</Label>
                <Input
                  type="password"
                  value={adminUser.password}
                  onChange={val =>
                    setAdminUser({
                      ...adminUser,
                      password: val,
                    })
                  }
                  required
                  minLength={1}
                />
              </BlockRow>
              <BlockRow>
                <Label required>{t('비밀번호 확인')}</Label>
                <Input
                  type="password"
                  value={adminUser.passwordConfirm}
                  onChange={val =>
                    setAdminUser({
                      ...adminUser,
                      passwordConfirm: val,
                    })
                  }
                  required
                  minLength={1}
                />
              </BlockRow>
            </div>
          </div>
          <div className="step">
            <div className="step-number">
              <div className="step-number-line">
                <div />
              </div>
              <div className="step-number-content">
                <div>
                  <span>2</span>
                </div>
              </div>
            </div>
            <div className="step-content">
              <div className="step-title">{t('이메일 인증 기능 설정')}</div>
              <div className="step-description">{t('사용자 회원 가입 시 이메일 인증 필수 여부를 설정합니다. 이메일 인증 기능 활성화를 위해 SMTP 설정 정보가 필요합니다.')}</div>
              <BlockRow>
                <Label minWidth={smtpLabelMinWidth}>{t('인증 활성화')}</Label>
                <CheckBox
                  type="checkbox"
                  value={smtpInfo.enabled}
                  onChange={val => {
                    if (val) {
                      setSmtpInfo({
                        ...smtpInfo,
                        enabled: val,
                      });
                    } else {
                      setSmtpInfo({
                        ...defaultSmtpInfo,
                      });
                    }
                  }}
                />
              </BlockRow>
              <div className="sub">
                <BlockRow>
                  <Label minWidth={smtpLabelMinWidth} required={smtpInfo.enabled} disabled={!smtpInfo.enabled}>
                    {t('SMTP 호스트')}
                  </Label>
                  <Input
                    value={smtpInfo.host}
                    onChange={val =>
                      setSmtpInfo({
                        ...smtpInfo,
                        host: val,
                      })
                    }
                    required={smtpInfo.enabled}
                    minLength={1}
                    disabled={!smtpInfo.enabled}
                  />
                </BlockRow>
                <BlockRow>
                  <Label minWidth={smtpLabelMinWidth} required={smtpInfo.enabled} disabled={!smtpInfo.enabled}>
                    {t('SMTP 포트')}
                  </Label>
                  <Input
                    value={smtpInfo.port}
                    onChange={val =>
                      setSmtpInfo({
                        ...smtpInfo,
                        port: val,
                      })
                    }
                    required={smtpInfo.enabled}
                    minLength={1}
                    disabled={!smtpInfo.enabled}
                  />
                </BlockRow>
                <BlockRow>
                  <Label minWidth={smtpLabelMinWidth} required={smtpInfo.tls} disabled={!smtpInfo.enabled}>
                    {t('TLS 사용')}
                  </Label>
                  <CheckBox
                    type="checkbox"
                    value={smtpInfo.tls}
                    onChange={val =>
                      setSmtpInfo({
                        ...smtpInfo,
                        tls: val,
                      })
                    }
                    disabled={!smtpInfo.enabled}
                  />
                </BlockRow>
                <BlockRow>
                  <Label minWidth={smtpLabelMinWidth} disabled={!smtpInfo.enabled}>
                    {t('SMTP 인증')}
                  </Label>
                  <CheckBox
                    type="checkbox"
                    value={smtpInfo.auth}
                    onChange={val =>
                      setSmtpInfo({
                        ...smtpInfo,
                        auth: val,
                      })
                    }
                    disabled={!smtpInfo.enabled}
                  />
                </BlockRow>
                <div className="sub">
                  <BlockRow>
                    <Label minWidth={smtpLabelMinWidth} required={smtpInfo.enabled && smtpInfo.auth} disabled={!(smtpInfo.enabled && smtpInfo.auth)}>
                      {t('SMTP 사용자 아이디')}
                    </Label>
                    <Input
                      value={smtpInfo.id}
                      onChange={val =>
                        setSmtpInfo({
                          ...smtpInfo,
                          id: val,
                        })
                      }
                      required={smtpInfo.enabled && smtpInfo.auth}
                      minLength={1}
                      disabled={!(smtpInfo.enabled && smtpInfo.auth)}
                    />
                  </BlockRow>
                  <BlockRow>
                    <Label minWidth={smtpLabelMinWidth} required={smtpInfo.enabled && smtpInfo.auth} disabled={!(smtpInfo.enabled && smtpInfo.auth)}>
                      {t('SMTP 사용자 비밀번호')}
                    </Label>
                    <Input
                      value={smtpInfo.password}
                      onChange={val =>
                        setSmtpInfo({
                          ...smtpInfo,
                          password: val,
                        })
                      }
                      required={smtpInfo.enabled && smtpInfo.auth}
                      minLength={1}
                      disabled={!(smtpInfo.enabled && smtpInfo.auth)}
                    />
                  </BlockRow>
                </div>
                <BlockRow>
                  <Label minWidth={smtpLabelMinWidth} disabled={!smtpInfo.enabled}>
                    {t('메일 발송자')}
                  </Label>
                  <Input
                    value={smtpInfo.sender}
                    onChange={val =>
                      setSmtpInfo({
                        ...smtpInfo,
                        sender: val,
                      })
                    }
                    disabled={!smtpInfo.enabled}
                  />
                </BlockRow>
              </div>
            </div>
          </div>

          <PageButtons onSubmit={() => {}} onSubmitText={t('저장')} />
        </Form>
      </PageContent>
    </Page>
  );
}

SetUpPage.defaultProps = {};

SetUpPage.propTypes = {};

export default observer(SetUpPage);
