import PropTypes from 'prop-types';
import moment from 'moment';

const TeePropTypes = PropTypes.shape({
  id: PropTypes.number,
  course: PropTypes.string,
  teeOffDate: PropTypes.string,
  teeOffTime: PropTypes.string,
  nonMemberGreenFee: PropTypes.number,
  memberGreenFee: PropTypes.number,
  caddyYn: PropTypes.bool,
});

const ClubInfoPropTypes = PropTypes.shape({
  id: PropTypes.number,
  img: PropTypes.string,
  name: PropTypes.string,
  address: PropTypes.string,
  position: PropTypes.string,
  rating: PropTypes.number,
  time: PropTypes.instanceOf(moment),
  cost: PropTypes.number,
  url: PropTypes.string,
});

const ClubInfoListPropTypes = PropTypes.arrayOf(ClubInfoPropTypes);

const ClubSummaryPropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    club: PropTypes.shape({
      id: PropTypes.number,
      img: PropTypes.string,
      name: PropTypes.string,
      address: PropTypes.string,
      position: PropTypes.string,
      rating: PropTypes.number,
      time: PropTypes.instanceOf(moment),
      cost: PropTypes.number,
      url: PropTypes.string,
      shortWeatherList: PropTypes.arrayOf(
        PropTypes.shape({
          date: PropTypes.string,
          precipitationForm: PropTypes.number,
          rain: PropTypes.number,
          rainfall: PropTypes.string,
          sky: PropTypes.number,
          temperature: PropTypes.number,
          time: PropTypes.string,
        }),
      ),
    }),
    tees: PropTypes.arrayOf(TeePropTypes),
  }),
);

const KeyValuePropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    key: PropTypes.string,
    value: PropTypes.string,
  }),
);

const RegionalSummaryListPropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    name: PropTypes.string,
    list: ClubSummaryPropTypes,
  }),
);

const NoticePropTypes = PropTypes.shape({
  losingDate: PropTypes.string,
  content: PropTypes.string,
  enabled: PropTypes.bool,
  id: PropTypes.number,
  noticeYn: PropTypes.bool,
  subject: PropTypes.string,
});

const BatchInfoPropTypes = PropTypes.shape({
  id: PropTypes.number,
  batchJobPackage: PropTypes.string,
  batchJobClass: PropTypes.string,
  batchJobName: PropTypes.string,
  batchJobDescription: PropTypes.string,
  cronExpression: PropTypes.string,
  useYn: PropTypes.bool,
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
  token: PropTypes.string,
  duration: PropTypes.number,
});

export {
  ClubSummaryPropTypes,
  KeyValuePropTypes,
  RegionalSummaryListPropTypes,
  ClubInfoPropTypes,
  ClubInfoListPropTypes,
  TeePropTypes,
  NoticePropTypes,
  BatchInfoPropTypes,
  TestcaseTemplatePropTypes,
};
