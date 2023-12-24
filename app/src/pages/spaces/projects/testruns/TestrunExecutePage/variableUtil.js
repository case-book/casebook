/* eslint-disable no-param-reassign */
function convertTestcaseVariables(info, variable) {
  if (info.name?.indexOf('{{') > -1) {
    Object.keys(variable).forEach(key => {
      if (variable[key]) {
        info.name = info.name.replaceAll(`{{${key}}}`, variable[key]);
      }
    });
  }

  if (info.description?.indexOf('{{') > -1) {
    Object.keys(variable).forEach(key => {
      if (variable[key]) {
        info.description = info.description.replaceAll(`{{${key}}}`, variable[key]);
      }
    });
  }

  info.testcaseItems.forEach(item => {
    if (item.value?.indexOf('{{') > -1) {
      Object.keys(variable).forEach(key => {
        if (variable[key]) {
          item.value = item.value.replaceAll(`{{${key}}}`, variable[key]);
        }
      });
    }

    if (item.text?.indexOf('{{') > -1) {
      Object.keys(variable).forEach(key => {
        if (variable[key]) {
          item.text = item.text.replaceAll(`{{${key}}}`, variable[key]);
        }
      });
    }
  });

  return info;
}

function convertTestrun(info, variable) {
  info.testcaseGroups.forEach(group => {
    if (group.name?.indexOf('{{') > -1) {
      Object.keys(variable).forEach(key => {
        if (variable[key]) {
          group.name = group.name.replaceAll(`{{${key}}}`, variable[key]);
        }
      });
    }

    group?.testcases?.forEach(testcase => {
      if (testcase.name?.indexOf('{{') > -1) {
        Object.keys(variable).forEach(key => {
          if (variable[key]) {
            testcase.name = testcase.name.replaceAll(`{{${key}}}`, variable[key]);
          }
        });
      }

      if (testcase.description?.indexOf('{{') > -1) {
        Object.keys(variable).forEach(key => {
          if (variable[key]) {
            testcase.description = testcase.description.replaceAll(`{{${key}}}`, variable[key]);
          }
        });
      }
    });
  });

  return info;
}

export { convertTestcaseVariables, convertTestrun };
