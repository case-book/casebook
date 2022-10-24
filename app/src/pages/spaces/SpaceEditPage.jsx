import React, { useEffect, useState } from 'react';
import { Block, Button, CheckBox, Form, Input, Label, Page, PageButtons, PageContent, PageTitle, Text, TextArea, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import SpaceService from '@/services/SpaceService';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import moment from 'moment';
import BlockRow from '@/components/BlockRow/BlockRow';
import useStores from '@/hooks/useStores';
import dialogUtil from '@/utils/dialogUtil';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import './SpaceEditPage.scss';

function SpaceEditPage({ type }) {
  const { t } = useTranslation();
  const { id } = useParams();

  const {
    userStore: { addSpace },
  } = useStores();

  const navigate = useNavigate();

  const [space, setSpace] = useState({
    name: '',
    code: '',
    description: '',
    activated: true,
    token: uuidv4(),
    allowSearch: true,
    allowAutoJoin: false,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id && type === 'edit') {
      SpaceService.selectSpaceInfo(id, info => {
        const data = { ...info };
        if (data.permissionDate) {
          data.permissionDate = moment(data.permissionDate, 'YYYY-MM-DD').format('YYYYMMDD');
        }
        setSpace(data);
      });
    }
  }, [type, id]);

  const onSubmit = e => {
    e.preventDefault();

    if (type === 'new') {
      SpaceService.createSpace(space, result => {
        addSpace(result);
        navigate('/spaces');
      });
    } else if (type === 'edit') {
      SpaceService.updateSpace(space, () => {
        navigate('/spaces');
      });
    }
  };

  const onDelete = () => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('스페이스 삭제'),
      <div>{t(`${space.name} 스페이스 및 스페이스에 포함된 프로젝트를 비롯한 모든 정보가 삭제됩니다. 삭제하시겠습니까?`)}</div>,
      () => {
        SpaceService.deleteSpace(space.id, result => {
          addSpace(result);
          navigate('/spaces');
        });
      },
      null,
      t('삭제'),
    );
  };

  return (
    <Page className="space-edit-page-wrapper">
      <PageTitle>{type === 'edit' ? t('스페이스') : t('새 스페이스')}</PageTitle>
      <PageContent>
        <Form onSubmit={onSubmit}>
          <Title>기본 정보</Title>
          <Block className="pt-0">
            <BlockRow>
              <Label required>{t('이름')}</Label>
              <Input
                placeholder="스페이스 이름을 입력해주세요."
                value={space.name}
                onChange={val =>
                  setSpace({
                    ...space,
                    name: val,
                  })
                }
                required
                minLength={1}
              />
            </BlockRow>
            <BlockRow>
              <Label required>{t('코드')}</Label>
              <Input
                className="code"
                value={space.code}
                placeholder="영문자 및 숫자, -, _ 기호로 코드를 입력할 수 있습니다."
                pattern="^[A-Z\d_-]+$"
                onChange={val =>
                  setSpace({
                    ...space,
                    code: val.toUpperCase(),
                  })
                }
                required
                minLength={1}
              />
            </BlockRow>
            <BlockRow>
              <Label>{t('설명')}</Label>
              <TextArea
                placeholder="스페이스에 대한 설명을 입력해주세요."
                value={space.description || ''}
                rows={4}
                onChange={val => {
                  setSpace({
                    ...space,
                    description: val,
                  });
                }}
              />
            </BlockRow>
            <BlockRow>
              <Label>{t('사용 여부')}</Label>
              <CheckBox
                type="checkbox"
                value={space.activated}
                label="전체 스페이스의 기능을 ON/OFF 할 수 있습니다."
                onChange={val =>
                  setSpace({
                    ...space,
                    activated: val,
                  })
                }
              />
            </BlockRow>
            <BlockRow>
              <Label>{t('검색 허용')}</Label>
              <CheckBox
                type="checkbox"
                value={space.allowSearch}
                label="스페이스 검색 결과 포함 여부를 설정할 수 있습니다."
                onChange={val =>
                  setSpace({
                    ...space,
                    allowSearch: val,
                  })
                }
              />
            </BlockRow>
            <BlockRow>
              <Label>{t('자동 가입')}</Label>
              <CheckBox
                type="checkbox"
                value={space.allowAutoJoin}
                label="가입 신청 과정 없이 바로 스페이스에 사용자가 참여할 수 있습니다."
                onChange={val =>
                  setSpace({
                    ...space,
                    allowAutoJoin: val,
                  })
                }
              />
            </BlockRow>
            <BlockRow>
              <Label>{t('토큰')}</Label>
              <Text inline>{space.token}</Text>
              <Button
                rounded
                size="sm"
                onClick={() => {
                  setSpace({
                    ...space,
                    token: uuidv4(),
                  });
                }}
              >
                <i className="fa-solid fa-arrows-rotate" />
              </Button>
            </BlockRow>
          </Block>
          <PageButtons
            onDelete={type === 'edit' ? onDelete : null}
            onDeleteText="스페이스 삭제"
            onCancel={() => {
              if (type === 'edit') {
                navigate(`/spaces/${id}/info`);
              } else {
                navigate('/');
              }
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

SpaceEditPage.defaultProps = {
  type: 'new',
};

SpaceEditPage.propTypes = {
  type: PropTypes.string,
};

export default SpaceEditPage;
