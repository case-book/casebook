import React from 'react';

const MENUS = [
  {
    to: '/',
    icon: <i className="fas fa-home-alt" />,
    name: '스페이스',
    admin: false,
    pc: true,
    theme: 'white',
    login: true,
    project: false,
  },
  {
    to: '',
    icon: <i className="fas fa-home-alt" />,
    name: 'Overview',
    admin: false,
    pc: true,
    theme: 'white',
    login: true,
    project: true,
  },
  {
    to: '/testcases',
    icon: <i className="fa-solid fa-vial-virus" />,
    name: 'Testcases',
    admin: false,
    pc: true,
    theme: 'black',
    login: true,
    project: true,
  },
  {
    to: '/testruns',
    icon: <i className="fa-solid fa-circle-play" />,
    name: 'Test Runs',
    admin: false,
    pc: true,
    login: true,
    project: true,
  },
  {
    to: '/bugs',
    icon: <i className="fa-solid fa-viruses" />,
    name: 'Bugs',
    admin: false,
    pc: true,
    login: true,
    project: true,
  },
  {
    to: '/reports',
    icon: <i className="fa-regular fa-newspaper" />,
    name: 'Reports',
    admin: false,
    pc: true,
    login: true,
    project: true,
  },
  {
    to: '/config',
    icon: <i className="fa-regular fa-newspaper" />,
    name: 'Config',
    admin: false,
    pc: true,
    login: true,
    project: true,
  },
];

const DUMMY = {};

export { MENUS, DUMMY };
