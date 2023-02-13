import i18n from 'i18next';

const THEMES = {
  DARK: 'DARK',
  LIGHT: 'LIGHT',
};

const LANGUAGES = {
  ko: '한글',
  en: 'English',
};

const COUNTRIES = {
  KR: '한국',
  US: 'US',
};

const USER_ROLE = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
};

const MESSAGE_CATEGORY = {
  ERROR: 'ERROR',
  WARNING: 'WARNING',
  INFO: 'INFO',
};

const ITEM_TYPE = {
  TESTCASE: 'case',
  TESTCASE_GROUP: 'group',
};

const USER_ASSIGNED_OPERATIONS = {
  SEQ: i18n.t('< 랜덤(SEQ) 사용자 >'),
  RND: i18n.t('< 랜덤(RND) 사용자 >'),
};

const TESTRUN_RESULT_CODE = {
  UNTESTED: i18n.t('미수행'),
  UNTESTABLE: i18n.t('수행불가능'),
  FAILED: i18n.t('실패'),
  PASSED: i18n.t('성공'),
  OTHERS: i18n.t('미수행&수행불가'),
};

const DEFAULT_TESTRUN_RESULT_ITEM = {
  type: 'RADIO',
  label: i18n.t('테스트 결과'),
  size: 6,
  options: ['PASSED', 'FAILED', 'UNTESTABLE', 'UNTESTED'],
};

const DEFAULT_TESTRUN_TESTER_ITEM = {
  type: 'USER',
  label: i18n.t('테스터'),
  size: 6,
};

const TESTRUN_RESULT_LAYOUTS = {
  POPUP: i18n.t('팝업'),
  RIGHT: i18n.t('우측'),
  BOTTOM: i18n.t('하단'),
};

const DATE_FORMATS = {
  ko_KR: {
    full: { moment: 'YYYY년 MM월 DD일 HH시 mm분', picker: 'yyyy년 MM월 dd일 HH시 mm분' },
    yearsDays: { moment: 'YYYY년 MM월 DD일', picker: 'yyyy년 MM월 dd일 (eee)' },
    days: { moment: 'MM월 DD일', picker: 'MM월 dd일 (eee)' },
    monthsDaysHoursMinutes: { moment: 'MM월 DD일 HH시 mm분', picker: 'MM월 dd일 HH시 mm분' },
    daysHoursMinutes: { moment: 'DD일 HH시 mm분', picker: 'dd일 HH시 mm분' },
    dayHours: { moment: 'MM월 DD일 HH시 mm분', picker: 'MM월 dd일 HH시 mm분' },
    hoursMinutes: { moment: 'HH시 mm분', picker: 'HH시 mm분' },
    hours: { moment: 'HH시', picker: 'HH시' },
    minutes: { moment: 'mm분 ss초', picker: 'mm시 ss초' },
  },
  ko_US: {
    full: { moment: 'MM월/DD일/YYYY년 HH시 mm분', picker: 'MM월/dd일/yyyy년 HH시 mm분' },
    yearsDays: { moment: 'MM월/DD일/YYYY년', picker: 'MM월/dd일/yyyy년 (eee)' },
    days: { moment: 'MM월/DD일', picker: 'MM월/dd일 (eee)' },
    monthsDaysHoursMinutes: { moment: 'MM월/DD일 HH시 mm분', picker: 'MM월/dd일 HH시 mm분' },
    daysHoursMinutes: { moment: 'DD일 HH시 mm분', picker: 'dd일 HH시 mm분' },
    dayHours: { moment: 'MM월/DD일 HH시 mm분', picker: 'MM월/dd일 HH시 mm분' },
    hoursMinutes: { moment: 'HH시 mm분', picker: 'HH시 mm분' },
    hours: { moment: 'HH시', picker: 'HH시' },
    minutes: { moment: 'mm분 ss초', picker: 'mm시 ss초' },
  },
  en_US: {
    full: { moment: 'MM/DD/YYYY HH:mm', picker: 'MM/dd/yyyy HH:mm' },
    yearsDays: { moment: 'MM/DD/YYYY', picker: 'MM/dd/yyyy (eee)' },
    days: { moment: 'MM/DD', picker: 'MM/dd (eee)' },
    monthsDaysHoursMinutes: { moment: 'MM/DD HH:mm', picker: 'MM/dd HH:mm' },
    daysHoursMinutes: { moment: 'DD HH:mm', picker: 'dd HH:mm' },
    dayHours: { moment: 'MM/DD HH:mm', picker: 'MM/dd HH:mm' },
    hoursMinutes: { moment: 'HH:mm', picker: 'HH:mm' },
    hours: { moment: 'HH', picker: 'HH' },
    minutes: { moment: 'mm:ss', picker: 'mm:ss' },
  },
  en_KR: {
    full: { moment: 'YYYY-MM-DD HH:mm', picker: 'yyyy-MM-dd HH:mm' },
    yearsDays: { moment: 'YYYY-MM-DD', picker: 'yyyy-MM-dd (eee)' },
    days: { moment: 'MM-DD', picker: 'MM-dd (eee)' },
    monthsDaysHoursMinutes: { moment: 'MM-DD HH:mm', picker: 'MM-dd HH:mm' },
    daysHoursMinutes: { moment: 'DD HH:mm', picker: 'dd HH:mm' },
    dayHours: { moment: 'DD-MM HH:mm', picker: 'dd-MM HH:mm' },
    hoursMinutes: { moment: 'HH:mm', picker: 'HH:mm' },
    hours: { moment: 'HH', picker: 'HH' },
    minutes: { moment: 'mm:ss', picker: 'mm:ss' },
  },
};

const DATE_FORMATS_TYPES = {
  full: 'full',
  yearsDays: 'yearsDays',
  days: 'days',
  monthsDaysHoursMinutes: 'monthsDaysHoursMinutes',
  daysHoursMinutes: 'daysHoursMinutes',
  hoursMinutes: 'hoursMinutes',
  hours: 'hours',
  dayHours: 'dayHours',
  minutes: 'minutes',
};

const TIMEZONES = {
  'Asia/Seoul': {
    name: 'Asia/Seoul (GMT +9:00)',
    dir: +1,
    hours: 9,
    minutes: 0,
  },
  'US/HST': {
    name: 'US/HST (GMT -10:00)',
    dir: -1,
    hours: 10,
    minutes: 0,
  },
  'US/AKST': {
    name: 'US/AKST (GMT -9:00)',
    dir: -1,
    hours: 9,
    minutes: 0,
  },
  'US/PST': {
    name: 'US/PST (GMT -8:00)',
    dir: -1,
    hours: 8,
    minutes: 0,
  },
  'US/MST': {
    name: 'US/MST(GMT -7:00)',
    dir: -1,
    hours: 7,
    minutes: 0,
  },
  'US/CST': {
    name: 'US/CST(GMT -6:00)',
    dir: -1,
    hours: 6,
    minutes: 0,
  },
  'US/EST': {
    name: 'US/EST(GMT -5:00)',
    dir: -1,
    hours: 5,
    minutes: 0,
  },
};

const TESTRUN_CREATION_TYPES = [
  {
    key: 'CREATE',
    value: '지금 생성',
  },
  {
    key: 'RESERVE',
    value: '예약',
  },
  {
    key: 'ITERATION',
    value: '반복',
  },
];

const DURATIONS = (() => {
  const list = [];
  for (let i = 1; i <= 23; i += 1) {
    list.push({
      key: i,
      value: `${i18n.t('@ 시간', { hours: i })}`,
    });
  }

  list.push({
    key: 24,
    value: `${i18n.t('@ 일', { days: 1 })}`,
  });

  list.push({
    key: 48,
    value: `${i18n.t('@ 일', { days: 2 })}`,
  });

  list.push({
    key: 72,
    value: `${i18n.t('@ 일', { days: 3 })}`,
  });

  list.push({
    key: 96,
    value: `${i18n.t('@ 일', { days: 4 })}`,
  });

  list.push({
    key: 120,
    value: `${i18n.t('@ 일', { days: 5 })}`,
  });

  list.push({
    key: 148,
    value: `${i18n.t('@ 일', { days: 6 })}`,
  });

  list.push({
    key: 172,
    value: `${i18n.t('@ 일', { days: 7 })}`,
  });

  return list;
})();

export {
  LANGUAGES,
  USER_ROLE,
  MESSAGE_CATEGORY,
  COUNTRIES,
  ITEM_TYPE,
  USER_ASSIGNED_OPERATIONS,
  THEMES,
  DATE_FORMATS,
  DATE_FORMATS_TYPES,
  TIMEZONES,
  TESTRUN_RESULT_CODE,
  DEFAULT_TESTRUN_RESULT_ITEM,
  DEFAULT_TESTRUN_TESTER_ITEM,
  TESTRUN_CREATION_TYPES,
  DURATIONS,
  TESTRUN_RESULT_LAYOUTS,
};
