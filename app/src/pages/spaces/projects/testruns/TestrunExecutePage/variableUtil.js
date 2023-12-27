/* eslint-disable no-param-reassign */
import i18n from 'i18next';

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

      testcase.testcaseItems.forEach(item => {
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
    });
  });

  return info;
}

function getVariableList(variables, onClick) {
  const popup = document.createElement('div');
  popup.setAttribute('class', 'toastui-editor-variable-list-popup');

  if (variables?.length > 0) {
    const ul = document.createElement('ul');
    variables.forEach(variable => {
      const { name } = variable;
      const li = document.createElement('li');
      li.textContent = name;
      li.onclick = onClick;
      ul.appendChild(li);
    });
    popup.appendChild(ul);
  } else {
    const div = document.createElement('div');
    div.setAttribute('class', 'empty');
    div.textContent = i18n.t('일치 또는 사용 가능한 변수가 없습니다.');
    popup.appendChild(div);
  }

  return popup;
}

export { convertTestrun, getVariableList };
