import PropTypes from 'prop-types';

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
  isDefault: PropTypes.bool,
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

export { NullableNumber, NullableString, KeyValuePropTypes, TestcaseTemplateEditPropTypes, TestcaseGroupPropTypes, TestcaseGroupSettingPropTypes, TestcaseTemplatePropTypes };
