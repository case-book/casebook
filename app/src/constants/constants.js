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

const SYSTEM_ROLE = {
  ROLE_ADMIN: i18n.t('관리자'),
  ROLE_USER: i18n.t('사용자'),
};

const MESSAGE_CATEGORY = {
  ERROR: 'ERROR',
  WARNING: 'WARNING',
  INFO: 'INFO',
};

const ITEM_TYPE = {
  TESTCASE: 'case',
  TESTCASE_GROUP: 'group',
  TESTRUN: 'testrun',
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

const DEFAULT_TESTRUN_RELEASE_ITEM = {
  label: i18n.t('릴리스'),
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

const DEFAULT_HOLIDAY = {
  KR: [
    {
      id: null,
      date: '0101',
      name: '새해 첫날',
      holidayType: 'YEARLY',
      month: null,
      week: null,
      day: null,
    },
    {
      id: null,
      date: '0301',
      name: '삼일절',
      holidayType: 'YEARLY',
      month: null,
      week: null,
      day: null,
    },
    {
      id: null,
      date: '0505',
      name: '어린이날',
      holidayType: 'YEARLY',
      month: null,
      week: null,
      day: null,
    },
    {
      id: null,
      date: '0606',
      name: '현충일',
      holidayType: 'YEARLY',
      month: null,
      week: null,
      day: null,
    },
    {
      id: null,
      date: '0815',
      name: '광복절',
      holidayType: 'YEARLY',
      month: null,
      week: null,
      day: null,
    },
    {
      id: null,
      date: '1003',
      name: '개천절',
      holidayType: 'YEARLY',
      month: null,
      week: null,
      day: null,
    },
    {
      id: null,
      date: '1009',
      name: '한글날',
      holidayType: 'YEARLY',
      month: null,
      week: null,
      day: null,
    },
    {
      id: null,
      date: '1225',
      name: '성탄절',
      holidayType: 'YEARLY',
      month: null,
      week: null,
      day: null,
    },
  ],
  US: [
    {
      id: null,
      date: '0101',
      name: 'New Year`s Day',
      holidayType: 'YEARLY',
      month: null,
      week: null,
      day: null,
    },
    {
      id: null,
      date: '0619',
      name: 'Juneteenth',
      holidayType: 'YEARLY',
      month: null,
      week: null,
      day: null,
    },
    {
      id: null,
      date: '0704',
      name: 'Independence Day',
      holidayType: 'YEARLY',
      month: null,
      week: null,
      day: null,
    },
    {
      id: null,
      date: '1111',
      name: 'Veterans Day',
      holidayType: 'YEARLY',
      month: null,
      week: null,
      day: null,
    },
    {
      id: null,
      date: '1225',
      name: 'Christmas',
      holidayType: 'YEARLY',
      month: null,
      week: null,
      day: null,
    },
    {
      id: null,
      date: null,
      name: 'Martin Luther King Jr. Day',
      holidayType: 'CONDITION',
      month: 1,
      week: 10,
      day: 1,
    },
    {
      id: null,
      date: null,
      name: 'President`s Day',
      holidayType: 'CONDITION',
      month: 2,
      week: 10,
      day: 1,
    },
    {
      id: null,
      date: null,
      name: 'Memorial Day',
      holidayType: 'CONDITION',
      month: 5,
      week: 7,
      day: 1,
    },
    {
      id: null,
      date: null,
      name: 'Labor Day',
      holidayType: 'CONDITION',
      month: 9,
      week: 8,
      day: 1,
    },
    {
      id: null,
      date: null,
      name: 'Columbus Day',
      holidayType: 'CONDITION',
      month: 10,
      week: 9,
      day: 1,
    },
    {
      id: null,
      date: null,
      name: 'Thanksgiving Day',
      holidayType: 'CONDITION',
      month: 11,
      week: 11,
      day: 1,
    },
  ],
};

const APPROVAL_STATUS_INFO = {
  REQUEST: i18n.t('요청'),
  REQUEST_AGAIN: i18n.t('재요청'),
  APPROVAL: i18n.t('승인'),
  REJECTED: i18n.t('거절'),
};

const HOLIDAY_TYPE_CODE = {
  YEARLY: i18n.t('매년반복'),
  SPECIFIED_DATE: i18n.t('지정일자'),
  CONDITION: i18n.t('월/주/요일 조건'),
};

const HOLIDAY_CONDITION_MONTH_LIST = [
  {
    key: -1,
    value: i18n.t('매월'),
  },
];
for (let i = 1; i <= 12; i += 1) {
  HOLIDAY_CONDITION_MONTH_LIST.push({
    key: i,
    value: i18n.t('@월', { month: i }),
  });
}

const HOLIDAY_CONDITION_WEEK_LIST = [
  {
    key: -1,
    value: i18n.t('매주'),
  },
  {
    key: 6,
    value: i18n.t('마지막주'),
  },
  {
    key: 7,
    value: i18n.t('마지막'),
  },
  {
    key: 8,
    value: i18n.t('첫번째'),
  },
  {
    key: 9,
    value: i18n.t('두번째'),
  },
  {
    key: 10,
    value: i18n.t('세번째'),
  },
  {
    key: 11,
    value: i18n.t('네번째'),
  },
];
for (let i = 1; i <= 5; i += 1) {
  HOLIDAY_CONDITION_WEEK_LIST.push({
    key: i,
    value: i18n.t('@주', { week: i }),
  });
}

const HOLIDAY_CONDITION_DAY_LIST = [
  {
    key: 1,
    value: i18n.t('월요일'),
  },
  {
    key: 2,
    value: i18n.t('화요일'),
  },
  {
    key: 3,
    value: i18n.t('수요일'),
  },
  {
    key: 4,
    value: i18n.t('목요일'),
  },
  {
    key: 5,
    value: i18n.t('금요일'),
  },
  {
    key: 6,
    value: i18n.t('토요일'),
  },
  {
    key: 7,
    value: i18n.t('일요일'),
  },
];

const WORK_CODES = {
  'TESTRUN-SYNC': 'TESTRUN-SYNC',
};

const TESTRUN_ITERATION_USER_FILTER_TYPE_CODE = [
  {
    key: 'NONE',
    value: i18n.t('필터 없음'),
  },
  {
    key: 'TESTRUN',
    value: i18n.t('테스트런별로'),
  },
  {
    key: 'WEEKLY',
    value: i18n.t('주별로'),
  },
  {
    key: 'MONTHLY',
    value: i18n.t('월별로'),
  },
];

const TESTRUN_ITERATION_USER_FILTER_SELECT_RULE = [
  {
    key: 'RANDOM',
    value: i18n.t('랜덤하게'),
  },
  {
    key: 'SEQ',
    value: i18n.t('순서대로'),
  },
];

const TESTRUN_ITERATION_MONTHLY_DATES = [];
/*
TESTRUN_ITERATION_MONTHLY_DATES.push({
  key: -2,
  value: i18n.t('첫번째 워킹 데이'),
});
 */

TESTRUN_ITERATION_MONTHLY_DATES.push({
  key: -1,
  value: i18n.t('마지막일'),
});

for (let i = 1; i <= 31; i += 1) {
  TESTRUN_ITERATION_MONTHLY_DATES.push({
    key: i,
    value: i18n.t('@ 일', { days: i }),
  });
}

const TESTER_CHANGE_REASONS = [
  {
    key: 'SITUATION',
    value: i18n.t('테스트 대상 부적절'),
  },
  {
    key: 'ABSENT',
    value: i18n.t('부재중'),
  },
  {
    key: 'ETC',
    value: i18n.t('기타'),
  },
];

const TESTER_CHANGE_TARGETS = [
  {
    key: 'ONE',
    value: i18n.t('선택된 테스트케이스만'),
  },
  {
    key: 'ALL',
    value: i18n.t('테스터의 모든 테스트케이스'),
  },
];

const TESTRUN_HOOK_TIMINGS = [
  { key: 'BEFORE_START', value: i18n.t('시작 전'), description: i18n.t('테스트런을 생성하기 전에 API 훅이 실행됩니다.') },
  { key: 'AFTER_START', value: i18n.t('시작 후'), description: i18n.t('테스트런 생성 후 훅이 실행됩니다.') },
  { key: 'BEFORE_END', value: i18n.t('종료 전'), description: i18n.t('테스트런을 종료하기 전에 API 훅이 실행됩니다.') },
  { key: 'AFTER_END', value: i18n.t('종료 후'), description: i18n.t('테스트런 종료 후 API 훅이 실행됩니다.') },
];

const HTTP_METHOD = [
  { key: 'POST', value: 'POST' },
  { key: 'GET', value: 'GET' },
  { key: 'PUT', value: 'PUT' },
  { key: 'DEL', value: 'DEL' },
];

export {
  LANGUAGES,
  SYSTEM_ROLE,
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
  DEFAULT_TESTRUN_RELEASE_ITEM,
  TESTRUN_CREATION_TYPES,
  DURATIONS,
  TESTRUN_RESULT_LAYOUTS,
  APPROVAL_STATUS_INFO,
  DEFAULT_HOLIDAY,
  HOLIDAY_TYPE_CODE,
  HOLIDAY_CONDITION_MONTH_LIST,
  HOLIDAY_CONDITION_WEEK_LIST,
  HOLIDAY_CONDITION_DAY_LIST,
  WORK_CODES,
  TESTRUN_ITERATION_USER_FILTER_TYPE_CODE,
  TESTRUN_ITERATION_MONTHLY_DATES,
  TESTRUN_ITERATION_USER_FILTER_SELECT_RULE,
  TESTER_CHANGE_REASONS,
  TESTER_CHANGE_TARGETS,
  TESTRUN_HOOK_TIMINGS,
  HTTP_METHOD,
};
