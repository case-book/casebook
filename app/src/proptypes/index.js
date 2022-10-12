import PropTypes from 'prop-types';

const NullableNumber = PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]);

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

const TestcaseTemplatePropTypes = PropTypes.shape({
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

export { NullableNumber, KeyValuePropTypes, TestcaseTemplatePropTypes, TestcaseGroupPropTypes };
