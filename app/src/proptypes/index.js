import PropTypes from 'prop-types';
import moment from 'moment';

const NullableNumber = PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]);

const NullableString = PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]);

const KeyValuePropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    key: PropTypes.string,
    value: PropTypes.string,
  }),
);

const TestcaseGroupPropTypes = PropTypes.shape({
  depth: PropTypes.number,
  id: PropTypes.number,
  itemOrder: PropTypes.number,
  name: PropTypes.string,
  parentId: PropTypes.number,
  creationType: PropTypes.string,
  children: PropTypes.arrayOf(
    PropTypes.shape({
      depth: PropTypes.number,
      id: PropTypes.number,
      itemOrder: PropTypes.number,
      name: PropTypes.string,
      parentId: PropTypes.number,
    }),
  ),
});

const TestcaseTemplateEditPropTypes = PropTypes.shape({
  activated: PropTypes.bool,
  creationDate: PropTypes.string,
  description: PropTypes.string,
  id: PropTypes.number,
  name: PropTypes.string,
  spaceName: PropTypes.string,
  testcaseTemplates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      testcaseTemplateItems: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          itemOrder: PropTypes.number,
          label: PropTypes.string,
          options: PropTypes.arrayOf(PropTypes.string),
          size: PropTypes.number,
          type: PropTypes.string,
          editable: PropTypes.bool,
        }),
      ),
    }),
  ),
  testcases: PropTypes.arrayOf(
    PropTypes.shape({
      closed: PropTypes.bool,
      id: PropTypes.number,
      itemOrder: PropTypes.number,
      name: PropTypes.string,
    }),
  ),
  token: PropTypes.string,
  duration: PropTypes.number,
});

const TestcaseTemplatePropTypes = PropTypes.shape({
  id: PropTypes.number,
  defaultTemplate: PropTypes.bool,
  name: PropTypes.string,
  testcaseTemplateItems: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string,
      id: PropTypes.number,
      itemOrder: PropTypes.number,
      label: PropTypes.string,
      options: PropTypes.arrayOf(PropTypes.string),
      size: PropTypes.number,
      type: PropTypes.string,
    }),
  ),
});

const TestcaseGroupSettingPropTypes = PropTypes.shape({
  show: PropTypes.bool,
  testcaseGroupColumns: PropTypes.shape({
    id: PropTypes.shape({
      show: PropTypes.bool,
      name: PropTypes.string,
    }),

    itemOrder: PropTypes.shape({
      show: PropTypes.bool,
      name: PropTypes.string,
    }),

    testcase: PropTypes.shape({
      show: PropTypes.bool,
      name: PropTypes.string,
    }),
    testcaseCount: PropTypes.shape({
      show: PropTypes.bool,
      name: PropTypes.string,
    }),
  }),
  testcaseColumns: PropTypes.shape({
    id: PropTypes.shape({
      show: PropTypes.bool,
      name: PropTypes.string,
    }),
    itemOrder: PropTypes.shape({
      show: PropTypes.bool,
      name: PropTypes.string,
    }),
    closed: PropTypes.shape({
      show: PropTypes.bool,
      name: PropTypes.string,
    }),
  }),
});

const SpacePropTypes = PropTypes.shape({
  name: PropTypes.string,
  code: PropTypes.string,
  description: PropTypes.string,
  activated: PropTypes.bool,
  allowSearch: PropTypes.bool,
  allowAutoJoin: PropTypes.bool,
  token: PropTypes.string,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      email: PropTypes.string,
    }),
  ),
  admins: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      email: PropTypes.string,
    }),
  ),
  applicants: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      userName: PropTypes.string,
      userEmail: PropTypes.string,
    }),
  ),
  applicant: PropTypes.shape({}),
});

const TestrunPropTypes = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  startDateTime: PropTypes.string,
  endDateTime: PropTypes.string,
  reserveExpired: PropTypes.bool,
  days: PropTypes.string,
  excludeHoliday: PropTypes.bool,
  startTime: PropTypes.string,
  durationHours: PropTypes.number,
  opened: PropTypes.bool,
  totalTestcaseCount: PropTypes.number,
  passedTestcaseCount: PropTypes.number,
  failedTestcaseCount: PropTypes.number,
});

const TestrunReservationPropTypes = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  description: PropTypes.string,
  startDateTime: PropTypes.string,
  endDateTime: PropTypes.string,
  expired: PropTypes.bool,
  deadlineClose: PropTypes.bool,
  testcaseGroupCount: PropTypes.number,
  testcaseCount: PropTypes.number,
});

const ColorPropTypes = PropTypes.oneOf([undefined, 'black', 'white', 'primary', 'danger']);

const TestcaseSelectorFilterPropTypes = PropTypes.shape({
  name: PropTypes.string,
  minDate: PropTypes.instanceOf(moment),
  maxDate: PropTypes.instanceOf(moment),
  releases: PropTypes.arrayOf(PropTypes.shape({ key: PropTypes.number, value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) })),
});

const SelectedTestcaseGroupPropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    testcaseGroupId: PropTypes.number,
    testcases: PropTypes.arrayOf(
      PropTypes.shape({
        testcaseId: PropTypes.number,
      }),
    ),
  }),
);

const ProjectReleasePropTypes = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  description: PropTypes.string,
  testcases: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number })),
});

const ParaphraseInfoPropTypes = PropTypes.shape({
  testcaseId: PropTypes.number,
  result: PropTypes.bool,
  isLoading: PropTypes.bool,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string,
      text: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    }),
  ),
});

const LlmPropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.number,
    llmTypeCode: PropTypes.string,
    openAi: PropTypes.shape({
      apiKey: PropTypes.string,
      models: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          name: PropTypes.string,
          code: PropTypes.string,
        }),
      ),
    }),
  }),
);

export {
  NullableNumber,
  NullableString,
  KeyValuePropTypes,
  TestcaseTemplateEditPropTypes,
  TestcaseGroupPropTypes,
  TestcaseGroupSettingPropTypes,
  TestcaseTemplatePropTypes,
  SpacePropTypes,
  TestrunPropTypes,
  TestrunReservationPropTypes,
  ColorPropTypes,
  TestcaseSelectorFilterPropTypes,
  SelectedTestcaseGroupPropTypes,
  ProjectReleasePropTypes,
  LlmPropTypes,
  ParaphraseInfoPropTypes,
};
