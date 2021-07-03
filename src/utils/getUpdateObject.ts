type param = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
};

export default (propertiesObject: param): param => {
  const updateObject: param = {};

  Object.keys(propertiesObject).forEach(key => {
    if (typeof propertiesObject[key] === 'string') {
      updateObject[key] = propertiesObject[key];
    } else if (Array.isArray(propertiesObject[key])) {
      if (propertiesObject[key].length > 0) {
        updateObject[key] = propertiesObject[key];
      }
    }
  });

  return updateObject;
};
