function getOptionObj() {
  const str = localStorage.getItem('options');
  let options = {};
  if (str) {
    options = JSON.parse(str);
  }

  return options;
}

export function setOption(category, group, key, value) {
  if (localStorage) {
    const options = getOptionObj();
    if (!options[category]) {
      options[category] = {};
    }

    if (!options[category][group]) {
      options[category][group] = {};
    }

    options[category][group][key] = value;

    localStorage.setItem('options', JSON.stringify(options));
  }
}

export function getOption(category, group, key, parse) {
  if (localStorage) {
    const options = getOptionObj();

    if (options[category] && options[category][group]) {
      if (parse && options[category][group][key]) {
        return JSON.parse(options[category][group][key]);
      }
      return options[category][group][key];
    }
  }
  return null;
}
