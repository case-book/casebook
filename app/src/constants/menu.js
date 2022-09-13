import React from 'react';

const MENUS = [
  {
    to: '/overview',
    icon: <i className="fas fa-home-alt" />,
    name: 'Overview',
    admin: false,
    pc: true,
    theme: 'white',
  },
  {
    to: '/testcases',
    icon: <i className="fa-solid fa-vial-virus" />,
    name: 'Testcases',
    admin: false,
    pc: true,
    theme: 'black',
  },
  {
    to: '/testruns',
    icon: <i className="fa-solid fa-circle-play" />,
    name: 'Test Runs',
    admin: false,
    pc: true,
  },
  {
    to: '/bugs',
    icon: <i className="fa-solid fa-viruses" />,
    name: 'Bugs',
    admin: false,
    pc: true,
  },
  {
    to: '/reports',
    icon: <i className="fa-regular fa-newspaper" />,
    name: 'Reports',
    admin: false,
    pc: true,
  },
];

const DUMMY = {};

export { MENUS, DUMMY };
