import React from 'react';
import i18n from 'i18next';

const STATIC_MENUS = [
  {
    key: 'space',
    to: '/',
    icon: <i className="fas fa-home-alt" />,
    name: i18n.t('스페이스'),
    admin: false,
    pc: true,
    selectedAlias: [/^\/$/, /^\/spaces\/[A-Z]+(\/)?(edit|info)$/],
  },
  {
    key: 'project',
    to: '/projects',
    icon: <i className="fas fa-home-alt" />,
    name: i18n.t('프로젝트'),
    admin: false,
    pc: true,
    prefixSpace: true,
    selectedAlias: [/^\/spaces\/[\dA-Z]+\/projects$/],
  },
  {
    key: 'admin',
    to: '/admin',
    icon: <i className="fas fa-home-alt" />,
    name: i18n.t('관리'),
    admin: true,
    pc: true,
    prefixSpace: false,
    selectedAlias: [/^\/admin\/*/],
    list: [
      {
        key: 'systems',
        to: '/systems',
        name: i18n.t('시스템 설정'),
        description: i18n.t('시스템 정보를 확인하고, 캐시 데이터를 관리합니다.'),
        icon: <i className="fa-solid fa-gear" />,
        admin: true,
      },
      {
        key: 'users',
        to: '/users',
        name: i18n.t('사용자 관리'),
        description: i18n.t('시스템에 등록된 모든 사용자 정보를 조회하고, 관리합니다.'),
        icon: <i className="fa-solid fa-universal-access" />,
        admin: true,
      },
      {
        key: 'spaces',
        to: '/spaces',
        name: i18n.t('스페이스 관리'),
        description: i18n.t('모든 스페이스 정보를 확인하고, 관리합니다.'),
        icon: <i className="fa-solid fa-box-archive" />,
        admin: true,
      },
    ],
  },
];

const ADMIN_MENUS = [
  {
    key: 'systems',
    to: '/admin/systems',
    name: i18n.t('시스템 설정'),
  },
  {
    key: 'users',
    to: '/admin/users',
    name: i18n.t('사용자 관리'),
  },
  {
    key: 'spaces',
    to: '/admin/spaces',
    name: i18n.t('스페이스 관리'),
  },
];

const MENUS = [
  {
    key: 'dashboard',
    to: '',
    icon: <i className="fa-solid fa-gauge" />,
    color: '#ffbc4b',
    name: i18n.t('대시보드'),
    admin: false,
    pc: true,
    login: true,
    project: true,
  },
  {
    key: 'testcases',
    to: '/testcases',
    icon: <i className="fa-solid fa-vial-virus" />,
    color: '#3e8ef1',
    name: i18n.t('테스트케이스'),
    admin: false,
    pc: true,
    login: true,
    project: true,
  },
  {
    key: 'testruns',
    to: '/testruns',
    icon: <i className="fa-solid fa-scale-balanced" />,
    color: '#7bde89',
    name: i18n.t('테스트런'),
    admin: false,
    pc: true,
    login: true,
    project: true,
    selectedAlias: [/^\/spaces\/[\dA-Z]+\/projects\/[\dA-Z]+\/testruns\/*/],
    list: [
      {
        key: 'testrun',
        to: '',
        name: i18n.t('테스트런'),
        admin: true,
      },
      {
        key: 'reservations',
        to: '/reservations',
        name: i18n.t('예약 테스트런'),
        admin: true,
      },
      {
        key: 'iterations',
        to: '/iterations',
        name: i18n.t('반복 테스트런'),
        admin: true,
      },
    ],
  },

  {
    key: 'reports',
    to: '/reports',
    icon: <i className="fa-regular fa-newspaper" />,
    color: '#a4c9d8',
    name: i18n.t('리포트'),
    admin: false,
    pc: true,
    login: true,
    project: true,
  },
  {
    key: 'info',
    to: '/info',
    icon: <i className="fa-solid fa-gear" />,
    color: '#837e7e',
    name: i18n.t('설정'),
    admin: false,
    pc: true,
    login: true,
    project: true,
  },
];

export { STATIC_MENUS, MENUS, ADMIN_MENUS };
